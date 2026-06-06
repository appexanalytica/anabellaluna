import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiBox, FiUploadCloud, FiPlus, FiPlay, FiEye, FiTrash2, FiMapPin } from 'react-icons/fi';
import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';
import tourService from '../services/tourService';

const resolveUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://api.anabellaluna.com.ar');
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getTourKey = (tour) => {
  if (!tour) return '';
  if (typeof tour === 'string' || typeof tour === 'number') return String(tour);
  return tour.id || tour._id || tour.slug || '';
};
const getSceneKey = (scene) => {
  if (!scene) return '';
  if (typeof scene === 'string' || typeof scene === 'number') return String(scene);
  return scene.id || scene._id || scene.slug || scene.title || '';
};

const TWO_PI = Math.PI * 2;
const DEFAULT_FOV = Math.PI / 2;
const MIN_FOV = 0.55;
const MAX_FOV = 2.1;

const normalizeAngle = (angle) => {
  let value = (angle + Math.PI) % TWO_PI;
  if (value < 0) value += TWO_PI;
  return value - Math.PI;
};

const getNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const isTourControlTarget = (target) => !!target?.closest?.('[data-tour-control="true"]');

const getPointerDistance = (pointers) => {
  const [first, second] = Array.from(pointers.values());
  if (!first || !second) return 0;
  return Math.hypot(first.x - second.x, first.y - second.y);
};

const haloRingStyle = {
  boxShadow: '0 0 0 2px rgba(255,255,255,0.95), 0 0 0 10px rgba(255,255,255,0.16), 0 0 28px rgba(255,255,255,0.9), inset 0 0 18px rgba(255,255,255,0.62)',
};

const haloDotStyle = {
  boxShadow: '0 0 18px rgba(255,255,255,0.9)',
};

const getSceneImageUrl = (scene) => resolveUrl(
  scene?.imageUrl || scene?.tileManifest?.source || scene?.tileManifest?.fallbackSource || scene?.previewUrl || ''
);

const getInitialView = (scene) => ({
  yaw: getNumber(scene?.initialView?.yaw, 0),
  pitch: clamp(getNumber(scene?.initialView?.pitch, 0), -1.2, 1.2),
  fov: clamp(getNumber(scene?.initialView?.fov, DEFAULT_FOV), MIN_FOV, MAX_FOV),
});

const getHotspotScreenPosition = (yaw, pitch, view) => {
  const yawDelta = normalizeAngle(getNumber(yaw, 0) - view.yaw);
  const pitchDelta = getNumber(pitch, 0) - view.pitch;
  const halfYaw = Math.max(0.35, view.fov * 0.72);
  const left = 50 + (yawDelta / halfYaw) * 45;
  const top = 50 - (pitchDelta / 0.95) * 38;
  return { left, top, visible: Math.abs(yawDelta) <= halfYaw && top >= 4 && top <= 96 };
};

const getHotspotCoordinatesFromPointer = (event, view) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const xPercent = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
  const yPercent = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
  const halfYaw = Math.max(0.35, view.fov * 0.72);
  const yaw = normalizeAngle(view.yaw + ((xPercent - 50) / 45) * halfYaw);
  const pitch = clamp(view.pitch + ((50 - yPercent) / 38) * 0.95, -1.2, 1.2);
  return { yaw, pitch };
};

const ToursVirtuales = () => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === 'Dark';
  const canvasRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  const pointersRef = useRef(new Map());
  const pinchRef = useRef({ active: false, distance: 0, fov: DEFAULT_FOV });
  const [properties, setProperties] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState('');
  const [selectedSceneId, setSelectedSceneId] = useState('');
  const [view, setView] = useState({ yaw: 0, pitch: 0, fov: DEFAULT_FOV });
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [placingHotspot, setPlacingHotspot] = useState(false);
  const [draftPinVisible, setDraftPinVisible] = useState(false);
  const [form, setForm] = useState({ propertyId: '', title: '' });
  const [sceneForm, setSceneForm] = useState({ title: '', file: null });
  const [hotspotForm, setHotspotForm] = useState({ targetSceneId: '', label: '', yaw: 0, pitch: 0 });

  const selectedTour = useMemo(() => tours.find((tour) => getTourKey(tour) === selectedTourId), [tours, selectedTourId]);
  const selectedTourKey = getTourKey(selectedTour);
  const scenes = selectedTour?.scenes || [];
  const selectedScene = scenes.find((scene) => getSceneKey(scene) === selectedSceneId) || scenes[0] || null;

  const loadData = async () => {
    setLoading(true);
    try {
      const [props, tourRes] = await Promise.all([crmService.propiedades.getAll(), tourService.list()]);
      setProperties(Array.isArray(props) ? props : []);
      const items = tourRes.items || [];
      setTours(items);
      if (!selectedTourId && items[0]) setSelectedTourId(items[0]._id || items[0].id);
    } catch (err) {
      toast.error(err.message || 'No se pudieron cargar los tours');
    } finally {
      setLoading(false);
    }
  };

  const refreshTour = async (id) => {
    if (!id) return;
    const tour = await tourService.get(id);
    setTours((prev) => [tour, ...prev.filter((item) => (item.id || item._id) !== tour.id)]);
    setSelectedTourId(tour.id);
    if (tour.scenes?.[0]) setSelectedSceneId(tour.scenes[0].id);
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!selectedScene) return;
    setView(getInitialView(selectedScene));
    dragRef.current.active = false;
    pointersRef.current.clear();
    pinchRef.current.active = false;
    setDragging(false);
    setPlacingHotspot(false);
    setDraftPinVisible(false);
  }, [selectedSceneId, selectedTourId, selectedScene]);

  const createTour = async (event) => {
    event.preventDefault();
    if (!form.propertyId || !form.title.trim()) return toast.error('Seleccioná propiedad y título');
    setCreating(true);
    try {
      const tour = await tourService.create(form);
      setTours((prev) => [tour, ...prev]);
      setSelectedTourId(tour.id);
      setForm({ propertyId: '', title: '' });
      toast.success('Tour creado');
    } catch (err) {
      toast.error(err.message || 'No se pudo crear el tour');
    } finally {
      setCreating(false);
    }
  };

  const uploadScene = async (event) => {
    event.preventDefault();
    if (!selectedTourKey || !sceneForm.file) return toast.error('Seleccioná un tour y una imagen 360');
    setUploading(true);
    try {
      const tour = await tourService.uploadScene(selectedTourKey, sceneForm.file, { title: sceneForm.title });
      setTours((prev) => [tour, ...prev.filter((item) => (item.id || item._id) !== tour.id)]);
      setSelectedTourId(tour.id);
      setSelectedSceneId(tour.scenes?.[tour.scenes.length - 1]?.id || '');
      setSceneForm({ title: '', file: null });
      toast.success('Panorama subido');
    } catch (err) {
      toast.error(err.message || 'No se pudo subir el panorama');
    } finally {
      setUploading(false);
    }
  };

  const addHotspot = async (event) => {
    event.preventDefault();
    if (!selectedTourKey || !selectedScene) return toast.error('Seleccioná escena');
    if (!hotspotForm.targetSceneId) return toast.error('Seleccioná escena destino');
    try {
      const tour = await tourService.createHotspot(selectedTourKey, selectedScene.id, {
        type: 'navigation',
        label: hotspotForm.label,
        targetSceneId: hotspotForm.targetSceneId,
        yaw: Number(hotspotForm.yaw),
        pitch: Number(hotspotForm.pitch),
      });
      setTours((prev) => [tour, ...prev.filter((item) => (item.id || item._id) !== tour.id)]);
      setHotspotForm({ targetSceneId: '', label: '', yaw: 0, pitch: 0 });
      setPlacingHotspot(false);
      setDraftPinVisible(false);
      toast.success('Hotspot creado');
    } catch (err) {
      toast.error(err.message || 'No se pudo crear el hotspot');
    }
  };

  const publish = async () => {
    if (!selectedTour) return;
    try {
      const tour = await tourService.publish(selectedTourKey, !selectedTour.published);
      setTours((prev) => [tour, ...prev.filter((item) => (item.id || item._id) !== tour.id)]);
      toast.success(tour.published ? 'Tour publicado' : 'Tour despublicado');
    } catch (err) {
      toast.error(err.message || 'No se pudo cambiar publicación');
    }
  };

  const removeTour = async () => {
    if (!selectedTour || !window.confirm('¿Eliminar este tour virtual?')) return;
    await tourService.delete(selectedTourKey);
    setTours((prev) => prev.filter((tour) => getTourKey(tour) !== selectedTourKey));
    setSelectedTourId('');
    toast.success('Tour eliminado');
  };

  const removeHotspot = async (hotspotId) => {
    if (!selectedTourKey) return;
    try {
      const tour = await tourService.deleteHotspot(selectedTourKey, hotspotId);
      setTours((prev) => [tour, ...prev.filter((item) => (item.id || item._id) !== tour.id)]);
      toast.success('Hotspot eliminado');
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar el hotspot');
    }
  };

  const removeScene = async (sceneId) => {
    if (!selectedTourKey || !window.confirm('¿Eliminar este panorama?')) return;
    try {
      const tour = await tourService.deleteScene(selectedTourKey, sceneId);
      setTours((prev) => [tour, ...prev.filter((item) => (item.id || item._id) !== tour.id)]);
      if (getSceneKey(selectedScene) === sceneId) setSelectedSceneId('');
      toast.success('Panorama eliminado');
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar el panorama');
    }
  };

  const sceneImageUrl = getSceneImageUrl(selectedScene);
  const backgroundScale = Math.max(220, Math.min(900, (TWO_PI / view.fov) * 100));
  const backgroundPositionX = ((normalizeAngle(view.yaw) + Math.PI) / TWO_PI) * 100;
  const backgroundPositionY = 50 - clamp(view.pitch, -1.2, 1.2) * 28;
  const visibleHotspots = (selectedScene?.hotspots || []).map((hotspot) => {
    return { hotspot, ...getHotspotScreenPosition(hotspot.yaw, hotspot.pitch, view) };
  }).filter((item) => item.visible);
  const draftPinPosition = draftPinVisible
    ? getHotspotScreenPosition(hotspotForm.yaw, hotspotForm.pitch, view)
    : null;

  const startDrag = (event) => {
    if (!sceneImageUrl || placingHotspot || isTourControlTarget(event.target)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size >= 2) {
      pinchRef.current = {
        active: true,
        distance: Math.max(1, getPointerDistance(pointersRef.current)),
        fov: view.fov,
      };
      dragRef.current.active = false;
      setDragging(false);
      return;
    }

    dragRef.current = { active: true, x: event.clientX, y: event.clientY, yaw: view.yaw, pitch: view.pitch };
    setDragging(true);
  };

  const moveDrag = (event) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }

    if (pinchRef.current.active && pointersRef.current.size >= 2) {
      event.preventDefault();
      const distance = Math.max(1, getPointerDistance(pointersRef.current));
      const nextFov = pinchRef.current.fov * (pinchRef.current.distance / distance);
      setView((current) => ({ ...current, fov: clamp(nextFov, MIN_FOV, MAX_FOV) }));
      return;
    }

    if (!dragRef.current.active) return;
    event.preventDefault();
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    setView((current) => ({
      ...current,
      yaw: normalizeAngle(dragRef.current.yaw - dx * 0.0055),
      pitch: clamp(dragRef.current.pitch + dy * 0.0045, -1.2, 1.2),
    }));
  };

  const stopDrag = (event) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current.active = false;
    dragRef.current.active = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const zoomPreview = (event) => {
    if (!sceneImageUrl) return;
    event.preventDefault();
    const modeMultiplier = event.deltaMode === 1 ? 16 : 1;
    const delta = event.deltaY * modeMultiplier * 0.001;
    setView((current) => ({ ...current, fov: clamp(current.fov + delta, MIN_FOV, MAX_FOV) }));
  };

  const placeHotspotFromCanvas = (event) => {
    if (!placingHotspot || !sceneImageUrl || isTourControlTarget(event.target)) return;
    const { yaw, pitch } = getHotspotCoordinatesFromPointer(event, view);
    setHotspotForm((current) => ({
      ...current,
      yaw: yaw.toFixed(4),
      pitch: pitch.toFixed(4),
    }));
    setDraftPinVisible(true);
    setPlacingHotspot(false);
  };

  const card = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const border = isDark ? 'border-gray-700' : 'border-gray-200';
  const sidebarBg = isDark ? 'bg-gray-800/40' : 'bg-gray-50';
  const inputCls = `w-full rounded-xl border px-3 py-3 text-sm ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`;
  const selectCls = `w-full rounded-xl border px-3 py-3 text-sm ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;
  const ghostBtn = `rounded-xl border py-3 font-bold ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600' : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'}`;

  return (
    <div className="m-2 md:m-6 mt-24 p-2 md:p-6 min-h-screen bg-main-bg dark:bg-main-dark-bg">
      <div className={`rounded-3xl overflow-hidden shadow-lg border ${card} ${border}`}>
        <div className={`p-6 md:p-8 border-b ${border} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-3"><FiBox /> Tour 360</div>
            <h1 className="text-3xl font-black tracking-tight">Recorridos Virtuales</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Editor de tours inmobiliarios.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={publish} disabled={!selectedTour} className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-40 transition-colors"><FiPlay className="inline mr-2" />{selectedTour?.published ? 'Despublicar' : 'Publicar'}</button>
            <button type="button" onClick={removeTour} disabled={!selectedTour} className={`px-4 py-3 rounded-xl font-bold disabled:opacity-40 ${isDark ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-colors`}><FiTrash2 className="inline mr-2" />Eliminar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[720px]">
          <aside className={`xl:col-span-3 border-r ${border} p-5 space-y-5 ${sidebarBg}`}>
            <form onSubmit={createTour} className="space-y-3">
              <h2 className="font-black flex items-center gap-2 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400"><FiPlus /> Nuevo tour</h2>
              <select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} className={selectCls}>
                <option value="">Seleccionar propiedad</option>
                {properties.map((property) => <option key={property._id} value={property._id}>{property.title || property.metadata?.titulo || property._id}</option>)}
              </select>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título del recorrido" className={inputCls} />
              <button disabled={creating} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold transition-colors disabled:opacity-40">{creating ? 'Creando...' : 'Crear tour'}</button>
            </form>

            <div className="space-y-2">
              <h2 className="font-black text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Tours</h2>
              {loading && <div className="text-gray-400 text-sm">Cargando...</div>}
              {tours.map((tour, index) => {
                const tourKey = getTourKey(tour) || `tour-${index}`;
                const renderKey = `${tourKey}-${index}`;
                const isActive = selectedTourId === tourKey;
                return (
                <button key={renderKey} type="button" onClick={() => { setSelectedTourId(tourKey); refreshTour(tourKey); }} className={`w-full text-left rounded-2xl p-4 border transition-colors ${isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : `${border} ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50'}`}`}>
                  <strong className="block text-sm">{tour.title}</strong>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{tour.published ? 'Publicado' : 'Borrador'} · {tour.scenes?.length || 0} escenas</span>
                </button>
                );
              })}
            </div>
          </aside>

          <main className="xl:col-span-6 p-5">
            <div
              ref={canvasRef}
              className={`relative h-[520px] rounded-2xl overflow-hidden bg-gray-950 border ${border} ${placingHotspot ? 'cursor-crosshair' : dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ touchAction: 'none', userSelect: 'none' }}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={stopDrag}
              onPointerCancel={stopDrag}
              onWheel={zoomPreview}
              onClick={placeHotspotFromCanvas}
            >
              {sceneImageUrl ? (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${JSON.stringify(sceneImageUrl)})`,
                    backgroundRepeat: 'repeat-x',
                    backgroundSize: `${backgroundScale}% auto`,
                    backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
                  }}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-gray-500 text-sm">Sin panorama seleccionado</div>
              )}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/35 via-transparent to-black/45" />
              {placingHotspot && (
                <div className="absolute left-4 top-4 z-30 inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-lg pointer-events-none">
                  <FiMapPin /> Colocar pin
                </div>
              )}
              {draftPinPosition?.visible && (
                <div
                  className="absolute z-30 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{ left: `${draftPinPosition.left}%`, top: `${draftPinPosition.top}%` }}
                >
                  <span className="absolute inset-1 rounded-full bg-white/20" style={haloRingStyle} />
                  <span className="absolute rounded-full border-2 border-white" style={{ inset: 13, boxShadow: '0 0 20px rgba(255,255,255,0.78)' }} />
                  <span className="absolute rounded-full bg-white" style={{ inset: 24, ...haloDotStyle }} />
                </div>
              )}
              {visibleHotspots.map(({ hotspot, left, top }) => (
                <button
                  key={hotspot.id}
                  type="button"
                  data-tour-control="true"
                  className="absolute z-20 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent p-0"
                  aria-label={hotspot.label || 'Hotspot'}
                  title={hotspot.label || 'Hotspot'}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onClick={() => {
                    if (placingHotspot) return;
                    if (hotspot.targetSceneId) setSelectedSceneId(hotspot.targetSceneId);
                  }}
                >
                  <span className="absolute inset-1 rounded-full bg-white/20 transition-transform hover:scale-105" style={haloRingStyle} />
                  <span className="absolute rounded-full border-2 border-white" style={{ inset: 13, boxShadow: '0 0 20px rgba(255,255,255,0.78)' }} />
                  <span className="absolute rounded-full bg-white" style={{ inset: 24, ...haloDotStyle }} />
                </button>
              ))}
            </div>
            {!selectedScene && <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Subí un panorama equirectangular JPG/WebP para iniciar el preview 360.</div>}
            {selectedTour && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {scenes.map((scene, index) => {
                  const sceneKey = getSceneKey(scene) || `scene-${index}`;
                  const renderKey = `${sceneKey}-${index}`;
                  const isActive = getSceneKey(selectedScene) === sceneKey;
                  return (
                  <div key={renderKey} className={`flex flex-col min-w-[160px] rounded-xl overflow-hidden border transition-colors ${isActive ? 'border-blue-500' : border}`}>
                    <button type="button" onClick={() => setSelectedSceneId(sceneKey)} className="block w-full text-left flex-1">
                      {scene.thumbnailUrl
                        ? <img src={resolveUrl(scene.thumbnailUrl)} alt="" className="w-full h-20 object-cover" />
                        : <div className={`w-full h-20 grid place-items-center text-xs text-gray-400 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>Sin preview</div>
                      }
                      <span className={`block p-2 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{scene.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeScene(sceneKey)}
                      className={`flex items-center justify-center gap-1 w-full py-1.5 text-xs transition-colors border-t ${border} ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
                    >
                      <FiTrash2 size={11} /> Eliminar
                    </button>
                  </div>
                  );
                })}
              </div>
            )}
          </main>

          <aside className={`xl:col-span-3 border-l ${border} p-5 space-y-6 ${sidebarBg}`}>
            <form onSubmit={uploadScene} className="space-y-3">
              <h2 className="font-black text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-2"><FiUploadCloud /> Upload panorama</h2>
              <input value={sceneForm.title} onChange={(e) => setSceneForm({ ...sceneForm, title: e.target.value })} placeholder="Nombre de ambiente" className={inputCls} />
              <input type="file" accept="image/jpeg,image/jpg,image/webp,image/png,.insp" onChange={(e) => setSceneForm({ ...sceneForm, file: e.target.files?.[0] || null })} className="w-full text-sm text-gray-600 dark:text-gray-300" />
              <button disabled={uploading || !selectedTour} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold disabled:opacity-40 transition-colors">{uploading ? 'Procesando...' : 'Subir escena'}</button>
            </form>

            <form onSubmit={addHotspot} className="space-y-3">
              <h2 className="font-black text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Hotspot navegación</h2>
              <select value={hotspotForm.targetSceneId} onChange={(e) => setHotspotForm({ ...hotspotForm, targetSceneId: e.target.value })} className={selectCls}>
                <option value="">Escena destino</option>
                {scenes.filter((scene) => getSceneKey(scene) !== getSceneKey(selectedScene)).map((scene, index) => {
                  const sceneKey = getSceneKey(scene) || `target-scene-${index}`;
                  const renderKey = `${sceneKey}-${index}`;
                  return <option key={renderKey} value={sceneKey}>{scene.title}</option>;
                })}
              </select>
              <input value={hotspotForm.label} onChange={(e) => setHotspotForm({ ...hotspotForm, label: e.target.value })} placeholder="Etiqueta" className={inputCls} />
              <button
                type="button"
                disabled={!selectedScene || !sceneImageUrl}
                onClick={() => setPlacingHotspot((value) => !value)}
                className={`w-full rounded-xl border py-3 font-bold disabled:opacity-40 transition-colors ${placingHotspot ? 'border-blue-500 bg-blue-600 text-white' : ghostBtn}`}
              >
                <FiMapPin className="inline mr-2" />{placingHotspot ? 'Colocando pin...' : 'Colocar pin con cursor'}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" value={hotspotForm.yaw} onChange={(e) => { setHotspotForm({ ...hotspotForm, yaw: e.target.value }); setDraftPinVisible(true); }} placeholder="Yaw" className={inputCls.replace('w-full ', '')} />
                <input type="number" step="0.01" value={hotspotForm.pitch} onChange={(e) => { setHotspotForm({ ...hotspotForm, pitch: e.target.value }); setDraftPinVisible(true); }} placeholder="Pitch" className={inputCls.replace('w-full ', '')} />
              </div>
              <button disabled={!selectedScene} className={`w-full ${ghostBtn} disabled:opacity-40`}>Agregar hotspot</button>
            </form>

            {selectedScene?.hotspots?.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-black text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Hotspots en esta escena</h2>
                {selectedScene.hotspots.map((hotspot) => (
                  <div key={hotspot.id} className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <div className="min-w-0">
                      <span className="font-medium truncate block">{hotspot.label || '(sin etiqueta)'}</span>
                      <span className="text-xs text-gray-400 truncate block">
                        → {scenes.find((s) => getSceneKey(s) === hotspot.targetSceneId)?.title || hotspot.targetSceneId || '—'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHotspot(hotspot.id)}
                      className={`shrink-0 rounded-lg p-1.5 transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
                      title="Eliminar hotspot"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedTour?.propertyId && (
              <a href={`https://anabellaluna.com.ar/propiedad/${selectedTour.propertyId}`} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-2 rounded-xl border py-3 font-bold transition-colors ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600' : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><FiEye />Ver propiedad</a>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ToursVirtuales;
