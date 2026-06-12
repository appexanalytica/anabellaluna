import React, { useEffect, useRef, useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaSearch, FaTimes, FaFilter, FaHome } from 'react-icons/fa';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxToken } from '../utils/mapbox';

const DEFAULT_CENTER = [-58.3816, -34.6037]; // Buenos Aires [lng, lat]
const LIGHT_STYLE = 'mapbox://styles/mapbox/streets-v12';
const DARK_STYLE = 'mapbox://styles/mapbox/dark-v11';

const PropiedadesMapView = ({ propiedades = [], isDark = false, verDetalle }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [filtros, setFiltros] = useState({
    texto: '',
    operacion: '',
    tipo: '',
    barrio: '',
    precioMin: '',
    precioMax: '',
    dormitorios: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const tiposUnicos = useMemo(() => [...new Set(propiedades.map((p) => p.tipo).filter(Boolean))].sort(), [propiedades]);
  const barriosUnicos = useMemo(() => [...new Set(propiedades.map((p) => p.barrio).filter(Boolean))].sort(), [propiedades]);

  const propiedadesFiltradas = useMemo(() => propiedades.filter((p) => {
    if (filtros.texto && !`${p.titulo} ${p.barrio} ${p.direccion}`.toLowerCase().includes(filtros.texto.toLowerCase())) return false;
    if (filtros.operacion && p.operacion !== filtros.operacion) return false;
    if (filtros.tipo && p.tipo !== filtros.tipo) return false;
    if (filtros.barrio && p.barrio !== filtros.barrio) return false;
    if (filtros.precioMin && p.precio < Number(filtros.precioMin)) return false;
    if (filtros.precioMax && p.precio > Number(filtros.precioMax)) return false;
    if (filtros.dormitorios && Number(p.dormitorios) < Number(filtros.dormitorios)) return false;
    return true;
  }), [propiedades, filtros]);

  const propConCoordenadas = useMemo(() => propiedadesFiltradas.filter((p) => p.lat && p.lng), [propiedadesFiltradas]);
  const propSinCoordenadas = useMemo(() => propiedadesFiltradas.filter((p) => !p.lat || !p.lng), [propiedadesFiltradas]);

  const filtrosActivos = Object.values(filtros).filter(Boolean).length;
  const limpiarFiltros = () => setFiltros({ texto: '', operacion: '', tipo: '', barrio: '', precioMin: '', precioMax: '', dormitorios: '' });

  // Init map
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getMapboxToken();
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;
      if (!token) {
        setTokenMissing(true);
        return;
      }
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: isDark ? DARK_STYLE : LIGHT_STYLE,
        center: DEFAULT_CENTER,
        zoom: 11,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      mapInstanceRef.current = map;
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync light/dark style
  useEffect(() => {
    if (mapInstanceRef.current) mapInstanceRef.current.setStyle(isDark ? DARK_STYLE : LIGHT_STYLE);
  }, [isDark]);

  // Update markers
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    propConCoordenadas.forEach((prop) => {
      const color = prop.operacion === 'Venta' ? '#10b981' : '#6366f1';
      const el = document.createElement('div');
      el.style.cssText = `width:20px;height:20px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35);cursor:pointer`;

      const popupContent = `
        <div style="max-width:240px;font-family:sans-serif;padding:4px">
          <p style="font-weight:bold;margin:0 0 3px;font-size:14px">${prop.titulo}</p>
          <p style="margin:0 0 2px;color:#666;font-size:12px">${prop.tipo} · ${prop.operacion}</p>
          <p style="margin:0 0 6px;font-weight:bold;color:#111;font-size:13px">${prop.moneda} ${prop.precio?.toLocaleString()}</p>
          <p style="margin:0 0 8px;color:#888;font-size:11px">📍 ${prop.barrio}${prop.ciudad ? ', ' + prop.ciudad : ''}</p>
          <button onclick="window.__mapVerDetalleCRM__('${prop.id}')" style="background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px">Ver detalle →</button>
        </div>`;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([Number(prop.lng), Number(prop.lat)])
        .setPopup(new mapboxgl.Popup({ offset: 14, maxWidth: '260px' }).setHTML(popupContent))
        .addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });

    if (propConCoordenadas.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      propConCoordenadas.forEach((p) => bounds.extend([Number(p.lng), Number(p.lat)]));
      mapInstanceRef.current.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    }
  }, [propConCoordenadas, mapReady]);

  // Bridge verDetalle to popup button
  useEffect(() => {
    window.__mapVerDetalleCRM__ = (id) => {
      const prop = propiedades.find((p) => String(p.id) === String(id));
      if (prop && verDetalle) verDetalle(prop);
    };
    return () => { delete window.__mapVerDetalleCRM__; };
  }, [propiedades, verDetalle]);

  const inputCls = `w-full px-3 py-2 text-sm border rounded-lg ${isDark ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-violet-400`;
  const labelCls = `block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`;

  return (
    <div>
      {/* Filter bar */}
      <div className={`mb-4 p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-52 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Buscar por título, barrio, dirección..."
              value={filtros.texto}
              onChange={(e) => setFiltros((prev) => ({ ...prev, texto: e.target.value }))}
              className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-violet-400`}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${showFilters || filtrosActivos > 0 ? 'bg-violet-500 text-white border-violet-500' : `${isDark ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}`}
          >
            <FaFilter size={12} /> Filtros {filtrosActivos > 0 && <span className="bg-white text-violet-600 rounded-full text-xs px-1.5 font-bold">{filtrosActivos}</span>}
          </button>
          {filtrosActivos > 0 && (
            <button type="button" onClick={limpiarFiltros} className="flex items-center gap-1 px-2 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <FaTimes size={11} /> Limpiar
            </button>
          )}
          <span className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-semibold text-violet-500">{propConCoordenadas.length}</span> en mapa · {propiedadesFiltradas.length} total
          </span>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 pt-4 border-t dark:border-gray-700">
            <div>
              <label className={labelCls}>Operación</label>
              <select value={filtros.operacion} onChange={(e) => setFiltros((prev) => ({ ...prev, operacion: e.target.value }))} className={inputCls}>
                <option value="">Todas</option>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Alquiler Temporal">Alquiler Temporal</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tipo</label>
              <select value={filtros.tipo} onChange={(e) => setFiltros((prev) => ({ ...prev, tipo: e.target.value }))} className={inputCls}>
                <option value="">Todos</option>
                {tiposUnicos.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Barrio</label>
              <select value={filtros.barrio} onChange={(e) => setFiltros((prev) => ({ ...prev, barrio: e.target.value }))} className={inputCls}>
                <option value="">Todos</option>
                {barriosUnicos.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Precio mín</label>
              <input type="number" placeholder="0" value={filtros.precioMin} onChange={(e) => setFiltros((prev) => ({ ...prev, precioMin: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Precio máx</label>
              <input type="number" placeholder="∞" value={filtros.precioMax} onChange={(e) => setFiltros((prev) => ({ ...prev, precioMax: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Dormitorios mín</label>
              <input type="number" min="0" placeholder="0" value={filtros.dormitorios} onChange={(e) => setFiltros((prev) => ({ ...prev, dormitorios: e.target.value }))} className={inputCls} />
            </div>
            <div className="flex items-end">
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Venta</span>
                <span className="flex items-center gap-1"><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} /> Alquiler</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border dark:border-gray-700" style={{ height: 600 }}>
        {tokenMissing ? (
          <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            <FaMapMarkerAlt className="text-3xl" />
            <p className="text-sm">Mapa no disponible — configurá MAPBOX_TOKEN en backend/.env</p>
          </div>
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      {/* Properties without coordinates */}
      {propSinCoordenadas.length > 0 && (
        <div className={`mt-4 p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-amber-50 border-amber-200'}`}>
          <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
            <FaMapMarkerAlt /> {propSinCoordenadas.length} propiedad{propSinCoordenadas.length !== 1 ? 'es' : ''} sin coordenadas — editá cada una y seleccioná la dirección del autocompletado para ubicarla en el mapa
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {propSinCoordenadas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => verDetalle && verDetalle(p)}
                className={`text-left p-3 rounded-lg border text-sm transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700 text-gray-200' : 'border-gray-200 hover:bg-white text-gray-700'}`}
              >
                <p className="font-medium truncate">{p.titulo}</p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><FaHome className="inline mr-1" />{p.barrio} · {p.tipo}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropiedadesMapView;
