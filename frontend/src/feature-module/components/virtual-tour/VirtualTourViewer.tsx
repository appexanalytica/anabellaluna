import { useEffect, useMemo, useRef, useState } from "react";
import publicService, { type VirtualTour, type VirtualTourScene } from "../../../services/publicService";
import { resolveMediaUrl } from "../listing-modules/common/funnelUtils";

type LoadedScene = {
  scene: VirtualTourScene;
  sourceUrl: string;
  width: number;
  height: number;
};

type ViewState = {
  yaw: number;
  pitch: number;
  fov: number;
};

const TWO_PI = Math.PI * 2;
const DEFAULT_VIEW: ViewState = { yaw: 0, pitch: 0, fov: Math.PI / 2 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeAngle = (angle: number) => {
  let value = (angle + Math.PI) % TWO_PI;
  if (value < 0) value += TWO_PI;
  return value - Math.PI;
};

const getNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const isTourControlTarget = (target: EventTarget | null) => {
  return target instanceof Element && !!target.closest("[data-vtour-control='true']");
};

const getInitialView = (scene?: VirtualTourScene | null): ViewState => ({
  yaw: getNumber(scene?.initialView?.yaw, DEFAULT_VIEW.yaw),
  pitch: clamp(getNumber(scene?.initialView?.pitch, DEFAULT_VIEW.pitch), -1.2, 1.2),
  fov: clamp(getNumber(scene?.initialView?.fov, DEFAULT_VIEW.fov), 0.45, Math.PI),
});

const getSceneSourceCandidates = (scene: VirtualTourScene) => {
  const candidates = [
    scene.previewUrl,
    scene.tileManifest?.source,
    scene.imageUrl,
    scene.tileManifest?.fallbackSource,
  ].map(resolveMediaUrl).filter(Boolean);

  return Array.from(new Set(candidates));
};

const loadImageSize = (url: string) => new Promise<{ width: number; height: number }>((resolve, reject) => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    resolve({
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
    });
  };
  image.onerror = () => reject(new Error(`No se pudo cargar la imagen 360: ${url}`));
  image.src = url;
});

const loadSceneAsset = async (scene: VirtualTourScene): Promise<LoadedScene | null> => {
  const candidates = getSceneSourceCandidates(scene);
  for (const sourceUrl of candidates) {
    try {
      const size = await loadImageSize(sourceUrl);
      return {
        scene,
        sourceUrl,
        width: Math.max(1, Math.round(size.width || Number(scene.tileManifest?.width || 4096))),
        height: Math.max(1, Math.round(size.height || Number(scene.tileManifest?.height || 2048))),
      };
    } catch {
      // Older tours can keep stale manifest URLs; try the next usable asset.
    }
  }
  return null;
};

type Props = {
  tour?: VirtualTour | null;
  propertyId?: string;
  height?: number | string;
  embedded?: boolean;
};

const VirtualTourViewer = ({ tour: providedTour, propertyId, height = 560, embedded = false }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneSourceRef = useRef<Record<string, string>>({});
  const dragRef = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  const [tour, setTour] = useState<VirtualTour | null>(providedTour || null);
  const [loadedScenes, setLoadedScenes] = useState<LoadedScene[]>([]);
  const [activeSceneId, setActiveSceneId] = useState("");
  const [currentView, setCurrentView] = useState<ViewState>(DEFAULT_VIEW);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [autorotateEnabled, setAutorotateEnabled] = useState(true);
  const [fallbackImageUrl, setFallbackImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setTour(providedTour || null);
  }, [providedTour]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (providedTour || !propertyId) return;
      try {
        setIsLoading(true);
        setError("");
        const data = await publicService.getVirtualTourByProperty(propertyId);
        if (!mounted) return;
        setTour(data);
      } catch {
        if (!mounted) return;
        setTour(null);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [propertyId, providedTour]);

  const orderedScenes = useMemo(() => {
    return [...(tour?.scenes || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tour?.scenes]);

  const initialScene = useMemo(() => {
    if (!orderedScenes.length) return null;
    const configured = tour?.settings?.initialSceneId
      ? orderedScenes.find((scene) => scene.id === tour.settings?.initialSceneId)
      : null;
    return configured || orderedScenes.find((scene) => scene.isInitial) || orderedScenes[0];
  }, [orderedScenes, tour?.settings?.initialSceneId]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!tour || !orderedScenes.length) {
        setLoadedScenes([]);
        setFallbackImageUrl("");
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        setFallbackImageUrl(orderedScenes.flatMap(getSceneSourceCandidates)[0] || "");

        const loadedSceneResults = await Promise.all(orderedScenes.map((scene) => loadSceneAsset(scene)));
        if (cancelled) return;

        const nextLoadedScenes = loadedSceneResults.filter((scene): scene is LoadedScene => !!scene);
        if (!nextLoadedScenes.length) throw new Error("No se pudo cargar ninguna imagen del recorrido 360°");

        const nextSceneSources = Object.fromEntries(nextLoadedScenes.map((item) => [item.scene.id, item.sourceUrl]));
        const startScene = nextLoadedScenes.find((item) => item.scene.id === initialScene?.id) || nextLoadedScenes[0];

        sceneSourceRef.current = nextSceneSources;
        setLoadedScenes(nextLoadedScenes);
        setActiveSceneId(startScene.scene.id);
        setCurrentView(getInitialView(startScene.scene));
        setFallbackImageUrl(startScene.sourceUrl);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "No se pudo iniciar el recorrido 360°");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
      sceneSourceRef.current = {};
      dragRef.current.active = false;
    };
  }, [tour, orderedScenes, initialScene]);

  const activeLoadedScene = useMemo(() => {
    return loadedScenes.find((item) => item.scene.id === activeSceneId) || loadedScenes[0] || null;
  }, [activeSceneId, loadedScenes]);

  const activeScene = activeLoadedScene?.scene || initialScene || orderedScenes[0] || null;
  const panoramaUrl = activeLoadedScene?.sourceUrl || fallbackImageUrl;

  useEffect(() => {
    if (!tour?.settings?.autorotate || !autorotateEnabled || !activeScene) return undefined;

    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = now - previous;
      previous = now;
      setCurrentView((view) => ({ ...view, yaw: normalizeAngle(view.yaw + delta * 0.00008) }));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeScene, autorotateEnabled, tour?.settings?.autorotate]);

  const visibleHotspots = useMemo(() => {
    const hotspots = activeScene?.hotspots || [];
    const halfYaw = Math.max(0.35, currentView.fov * 0.72);

    return hotspots.map((hotspot) => {
      const yawDelta = normalizeAngle(getNumber(hotspot.yaw, 0) - currentView.yaw);
      const pitchDelta = getNumber(hotspot.pitch, 0) - currentView.pitch;
      const left = 50 + (yawDelta / halfYaw) * 45;
      const top = 50 - (pitchDelta / 0.95) * 38;
      const visible = Math.abs(yawDelta) <= halfYaw && top >= 4 && top <= 96;
      return { hotspot, left, top, visible };
    }).filter((item) => item.visible);
  }, [activeScene?.hotspots, currentView]);

  const switchScene = (sceneId: string) => {
    const loadedScene = loadedScenes.find((item) => item.scene.id === sceneId);
    if (!loadedScene) return;
    setActiveSceneId(sceneId);
    setCurrentView(getInitialView(loadedScene.scene));
    setFallbackImageUrl(sceneSourceRef.current[sceneId] || loadedScene.sourceUrl);
  };

  const enterFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!panoramaUrl || isTourControlTarget(event.target)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      yaw: currentView.yaw,
      pitch: currentView.pitch,
    };
    setIsDragging(true);
    if (tour?.settings?.autorotate) setAutorotateEnabled(false);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    setCurrentView((view) => ({
      ...view,
      yaw: normalizeAngle(dragRef.current.yaw - dx * 0.0055),
      pitch: clamp(dragRef.current.pitch - dy * 0.0045, -1.2, 1.2),
    }));
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!panoramaUrl) return;
    event.preventDefault();
    setCurrentView((view) => ({
      ...view,
      fov: clamp(view.fov + event.deltaY * 0.001, 0.45, Math.PI),
    }));
  };

  const backgroundScale = activeLoadedScene
    ? clamp((TWO_PI / currentView.fov) * 100, 220, 900)
    : 400;
  const backgroundPositionX = ((normalizeAngle(currentView.yaw) + Math.PI) / TWO_PI) * 100;
  const backgroundPositionY = 50 - clamp(currentView.pitch, -1.2, 1.2) * 28;

  if (isLoading && (!tour || !orderedScenes.length)) {
    return <div className="al-vtour-shell" style={{ height }}><div className="al-vtour-loading">Cargando recorrido 360°...</div></div>;
  }

  if (!tour || !orderedScenes.length) return null;

  return (
    <section className={`al-vtour-shell ${embedded ? "al-vtour-embedded" : ""}`} style={{ height }}>
      {fallbackImageUrl && <img className="al-vtour-fallback-image" src={fallbackImageUrl} alt="" />}
      <div
        ref={containerRef}
        className={`al-vtour-canvas ${isDragging ? "is-dragging" : ""}`}
        role="application"
        aria-label="Visor de recorrido virtual 360"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onWheel={onWheel}
      >
        {panoramaUrl && (
          <div
            className="al-vtour-panorama-image"
            style={{
              backgroundImage: `url(${JSON.stringify(panoramaUrl)})`,
              backgroundSize: `${backgroundScale}% auto`,
              backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
            }}
          />
        )}
        <div className="al-vtour-gradient" />
        {visibleHotspots.map(({ hotspot, left, top }) => (
          <button
            type="button"
            key={hotspot.id}
            className={`al-vtour-hotspot al-vtour-hotspot-${hotspot.type}`}
            data-vtour-control="true"
            aria-label={hotspot.label || "Hotspot"}
            style={{ left: `${left}%`, top: `${top}%` }}
            onClick={(event) => {
              event.stopPropagation();
              if (hotspot.type === "navigation" && hotspot.targetSceneId) {
                switchScene(hotspot.targetSceneId);
              } else if (hotspot.payload?.url) {
                window.open(hotspot.payload.url, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <span>{hotspot.type === "navigation" ? "⌁" : "i"}</span>
            {hotspot.label && <em>{hotspot.label}</em>}
          </button>
        ))}
      </div>
      <div className="al-vtour-topbar">
        <div>
          <span>Recorrido virtual</span>
          <strong>{tour.title}</strong>
        </div>
        <div className="al-vtour-actions">
          {tour.settings?.autorotate && (
            <button type="button" onClick={() => setAutorotateEnabled((value) => !value)}>
              {autorotateEnabled ? "Pausar" : "Auto"}
            </button>
          )}
          {tour.settings?.fullscreen !== false && <button type="button" onClick={enterFullscreen}>Pantalla completa</button>}
        </div>
      </div>
      {tour.settings?.showSceneNavigator !== false && (
        <div className="al-vtour-scenes">
          {orderedScenes.map((scene) => (
            <button
              type="button"
              key={scene.id}
              className={scene.id === activeSceneId ? "active" : ""}
              disabled={!sceneSourceRef.current[scene.id]}
              onClick={() => switchScene(scene.id)}
            >
              {scene.thumbnailUrl && <img src={resolveMediaUrl(scene.thumbnailUrl)} alt="" loading="lazy" />}
              <span>{scene.title}</span>
            </button>
          ))}
        </div>
      )}
      {isLoading && <div className="al-vtour-loading">Cargando recorrido 360°...</div>}
      {error && <div className="al-vtour-error">{error}</div>}
    </section>
  );
};

export default VirtualTourViewer;
