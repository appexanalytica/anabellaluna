import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
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
const DEFAULT_FOV = Math.PI / 2;
const MIN_FOV = 0.55;
const MAX_FOV = 2.1;
const SOFT_SMOOTHING_MS = 180;
const TELEPORT_DEPART_MS = 460;
const TELEPORT_ARRIVE_MS = 560;
const TELEPORT_TEXTURE_WAIT_MS = 260;
const PANORAMA_TEXTURE_CENTER_OFFSET = Math.PI;
const DEFAULT_VIEW: ViewState = { yaw: 0, pitch: 0, fov: DEFAULT_FOV };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const radiansToDegrees = (value: number) => (value * 180) / Math.PI;

const normalizeAngle = (angle: number) => {
  let value = (angle + Math.PI) % TWO_PI;
  if (value < 0) value += TWO_PI;
  return value - Math.PI;
};

const shortestAngleDelta = (from: number, to: number) => normalizeAngle(to - from);

const cloneView = (view: ViewState): ViewState => ({
  yaw: normalizeAngle(view.yaw),
  pitch: clamp(view.pitch, -1.2, 1.2),
  fov: clamp(getNumber(view.fov, DEFAULT_FOV), MIN_FOV, MAX_FOV),
});

const getNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const isTourControlTarget = (target: EventTarget | null) => {
  return target instanceof Element && !!target.closest("[data-vtour-control='true']");
};

const getCenteredView = (): ViewState => cloneView(DEFAULT_VIEW);

const getSceneSourceCandidates = (scene: VirtualTourScene) => {
  const candidates = [
    scene.imageUrl,
    scene.tileManifest?.source,
    scene.tileManifest?.fallbackSource,
    scene.previewUrl,
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

const getTextureSize = (texture: THREE.Texture) => {
  const image = texture.image as {
    width?: number;
    height?: number;
    naturalWidth?: number;
    naturalHeight?: number;
  } | null;

  return {
    width: Number(image?.naturalWidth || image?.width || 0),
    height: Number(image?.naturalHeight || image?.height || 0),
  };
};

const getPointerDistance = (pointers: Map<number, { x: number; y: number }>) => {
  const [first, second] = Array.from(pointers.values());
  if (!first || !second) return 0;
  return Math.hypot(first.x - second.x, first.y - second.y);
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

type Props = {
  tour?: VirtualTour | null;
  propertyId?: string;
  height?: number | string;
  embedded?: boolean;
};

const VirtualTourViewer = ({ tour: providedTour, propertyId, height = 560, embedded = false }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<HTMLDivElement | null>(null);
  const sceneSourceRef = useRef<Record<string, string>>({});
  const dragRef = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef({ active: false, distance: 0, fov: DEFAULT_VIEW.fov });
  const renderViewRef = useRef<ViewState>(cloneView(DEFAULT_VIEW));
  const targetViewRef = useRef<ViewState>(cloneView(DEFAULT_VIEW));
  const autorotateActiveRef = useRef(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const textureCacheRef = useRef<Record<string, THREE.Texture>>({});
  const texturePromiseRef = useRef<Partial<Record<string, Promise<THREE.Texture | null>>>>({});
  const textureCacheGenerationRef = useRef(0);
  const animationRef = useRef(0);
  const previousFrameRef = useRef(0);
  const lastHotspotSyncRef = useRef(0);
  const transitionTimeoutsRef = useRef<number[]>([]);
  const [tour, setTour] = useState<VirtualTour | null>(providedTour || null);
  const [loadedScenes, setLoadedScenes] = useState<LoadedScene[]>([]);
  const [activeSceneId, setActiveSceneId] = useState("");
  const [currentView, setCurrentView] = useState<ViewState>(DEFAULT_VIEW);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [autorotateEnabled, setAutorotateEnabled] = useState(true);
  const [fallbackImageUrl, setFallbackImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isWebglReady, setIsWebglReady] = useState(false);
  const [teleportTransition, setTeleportTransition] = useState({
    phase: "idle" as "idle" | "departing" | "arriving",
    left: 50,
    top: 50,
  });

  const isTeleporting = teleportTransition.phase !== "idle";

  const clearTransitionTimers = useCallback(() => {
    transitionTimeoutsRef.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimeoutsRef.current = [];
  }, []);

  const disposeCachedTextures = useCallback(() => {
    textureCacheGenerationRef.current += 1;
    Object.values(textureCacheRef.current).forEach((texture) => texture.dispose());
    textureCacheRef.current = {};
    texturePromiseRef.current = {};
    textureRef.current = null;
    if (materialRef.current) {
      materialRef.current.map = null;
      materialRef.current.needsUpdate = true;
    }
  }, []);

  const loadTextureForScene = useCallback((loadedScene: LoadedScene) => {
    const renderer = rendererRef.current;
    if (!renderer) return Promise.resolve(null);

    const sceneId = loadedScene.scene.id;
    const cachedTexture = textureCacheRef.current[sceneId];
    if (cachedTexture) return Promise.resolve(cachedTexture);
    if (texturePromiseRef.current[sceneId]) return texturePromiseRef.current[sceneId];

    const loader = new THREE.TextureLoader();
    const maxTextureSize = renderer.capabilities.maxTextureSize || 4096;
    const candidates = Array.from(new Set([...getSceneSourceCandidates(loadedScene.scene), loadedScene.sourceUrl].filter(Boolean)));
    const cacheGeneration = textureCacheGenerationRef.current;
    loader.setCrossOrigin("anonymous");

    const promise = new Promise<THREE.Texture | null>((resolve) => {
      const loadCandidate = (index: number) => {
        const candidate = candidates[index];
        if (!candidate) {
          resolve(null);
          return;
        }

        loader.load(
          candidate,
          (texture) => {
            const { width, height } = getTextureSize(texture);
            if ((width && width > maxTextureSize) || (height && height > maxTextureSize)) {
              texture.dispose();
              loadCandidate(index + 1);
              return;
            }

            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
            texture.needsUpdate = true;

            if (cacheGeneration !== textureCacheGenerationRef.current) {
              texture.dispose();
              resolve(null);
              return;
            }

            textureCacheRef.current[sceneId] = texture;
            resolve(texture);
          },
          undefined,
          () => loadCandidate(index + 1),
        );
      };

      loadCandidate(0);
    }).finally(() => {
      delete texturePromiseRef.current[sceneId];
    });

    texturePromiseRef.current[sceneId] = promise;
    return promise;
  }, []);

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
        disposeCachedTextures();
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        disposeCachedTextures();
        setFallbackImageUrl(orderedScenes.flatMap(getSceneSourceCandidates)[0] || "");

        const loadedSceneResults = await Promise.all(orderedScenes.map((scene) => loadSceneAsset(scene)));
        if (cancelled) return;

        const nextLoadedScenes = loadedSceneResults.filter((scene): scene is LoadedScene => !!scene);
        if (!nextLoadedScenes.length) throw new Error("No se pudo cargar ninguna imagen del recorrido 360°");

        const nextSceneSources = Object.fromEntries(nextLoadedScenes.map((item) => [item.scene.id, item.sourceUrl]));
        const startScene = nextLoadedScenes.find((item) => item.scene.id === initialScene?.id) || nextLoadedScenes[0];
        const startView = getCenteredView();

        sceneSourceRef.current = nextSceneSources;
        renderViewRef.current = startView;
        targetViewRef.current = startView;
        setLoadedScenes(nextLoadedScenes);
        setActiveSceneId(startScene.scene.id);
        setCurrentView(startView);
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

  const hasRenderableTour = !!tour && orderedScenes.length > 0;
  const activeScene = activeLoadedScene?.scene || initialScene || orderedScenes[0] || null;
  const panoramaUrl = activeLoadedScene?.sourceUrl || fallbackImageUrl;

  useEffect(() => {
    autorotateActiveRef.current = !!(tour?.settings?.autorotate && autorotateEnabled && activeScene && !isTeleporting);
  }, [activeScene, autorotateEnabled, isTeleporting, tour?.settings?.autorotate]);

  useEffect(() => {
    if (!hasRenderableTour) return undefined;

    const host = webglRef.current;
    if (!host) return undefined;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x020617, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(radiansToDegrees(DEFAULT_VIEW.fov), 1, 0.1, 1100);
    const geometry = new THREE.SphereGeometry(500, 128, 64);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    rendererRef.current = renderer;
    cameraRef.current = camera;
    materialRef.current = material;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener("resize", resize);
    resize();

    const animate = (now: number) => {
      const previous = previousFrameRef.current || now;
      const delta = Math.min(64, Math.max(1, now - previous));
      previousFrameRef.current = now;

      const targetView = targetViewRef.current;
      if (autorotateActiveRef.current && !dragRef.current.active) {
        targetView.yaw = normalizeAngle(targetView.yaw + delta * 0.00008);
      }

      const renderView = renderViewRef.current;
      const smoothing = 1 - Math.exp(-delta / SOFT_SMOOTHING_MS);
      renderView.yaw = normalizeAngle(renderView.yaw + shortestAngleDelta(renderView.yaw, targetView.yaw) * smoothing);
      renderView.pitch += (targetView.pitch - renderView.pitch) * smoothing;
      renderView.pitch = clamp(renderView.pitch, -1.2, 1.2);
      renderView.fov += (targetView.fov - renderView.fov) * smoothing;
      renderView.fov = clamp(renderView.fov, MIN_FOV, MAX_FOV);
      camera.fov = radiansToDegrees(renderView.fov);
      camera.updateProjectionMatrix();

      const phi = Math.PI / 2 - renderView.pitch;
      const theta = renderView.yaw + PANORAMA_TEXTURE_CENTER_OFFSET;
      camera.lookAt(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta),
      );
      renderer.render(scene, camera);

      if (now - lastHotspotSyncRef.current > 50) {
        lastHotspotSyncRef.current = now;
        setCurrentView({ ...renderView });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      disposeCachedTextures();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = null;
      cameraRef.current = null;
      materialRef.current = null;
      pointersRef.current.clear();
      pinchRef.current.active = false;
    };
  }, [disposeCachedTextures, hasRenderableTour]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const onWheelZoom = (event: WheelEvent) => {
      if (isTeleporting || isTourControlTarget(event.target)) return;
      event.preventDefault();
      const modeMultiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1;
      const delta = event.deltaY * modeMultiplier * 0.001;
      const nextView = cloneView({ ...targetViewRef.current, fov: targetViewRef.current.fov + delta });
      targetViewRef.current = nextView;
      setCurrentView(nextView);
    };

    el.addEventListener("wheel", onWheelZoom, { passive: false });
    return () => el.removeEventListener("wheel", onWheelZoom);
  }, [hasRenderableTour, isTeleporting]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material || !activeLoadedScene) return undefined;
    let cancelled = false;
    setIsWebglReady(false);

    loadTextureForScene(activeLoadedScene).then((texture) => {
      if (cancelled) return;
      if (!texture) {
        setError("No se pudo cargar la textura premium del panorama 360°");
        return;
      }

      textureRef.current = texture;
      material.map = texture;
      material.needsUpdate = true;
      setError("");
      setIsWebglReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [activeLoadedScene, loadTextureForScene]);

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

  useEffect(() => {
    if (!activeScene || !loadedScenes.length) return;

    const targetIds = (activeScene.hotspots || [])
      .filter((hotspot) => hotspot.type === "navigation" && hotspot.targetSceneId)
      .map((hotspot) => hotspot.targetSceneId as string);

    const currentIndex = orderedScenes.findIndex((scene) => scene.id === activeScene.id);
    const nextScene = orderedScenes[currentIndex + 1] || orderedScenes[0];
    if (nextScene?.id && nextScene.id !== activeScene.id) targetIds.push(nextScene.id);

    Array.from(new Set(targetIds)).forEach((targetSceneId) => {
      const loadedScene = loadedScenes.find((item) => item.scene.id === targetSceneId);
      if (loadedScene) void loadTextureForScene(loadedScene);
    });
  }, [activeScene, loadedScenes, loadTextureForScene, orderedScenes]);

  useEffect(() => {
    return () => clearTransitionTimers();
  }, [clearTransitionTimers]);

  const applyScene = (loadedScene: LoadedScene) => {
    const nextView = getCenteredView();
    setActiveSceneId(loadedScene.scene.id);
    renderViewRef.current = nextView;
    targetViewRef.current = nextView;
    setCurrentView(nextView);
    setFallbackImageUrl(sceneSourceRef.current[loadedScene.scene.id] || loadedScene.sourceUrl);
  };

  const switchScene = (
    sceneId: string,
    origin?: { yaw?: number; pitch?: number; left?: number; top?: number },
  ) => {
    const loadedScene = loadedScenes.find((item) => item.scene.id === sceneId);
    if (!loadedScene || sceneId === activeSceneId || isTeleporting) return;

    clearTransitionTimers();
    setIsDragging(false);
    dragRef.current.active = false;
    pinchRef.current.active = false;
    const focusView = cloneView({
      ...targetViewRef.current,
      yaw: getNumber(origin?.yaw, targetViewRef.current.yaw),
      pitch: getNumber(origin?.pitch, targetViewRef.current.pitch),
      fov: Math.max(MIN_FOV, Math.min(0.72, targetViewRef.current.fov * 0.58)),
    });
    renderViewRef.current = { ...renderViewRef.current, fov: Math.min(renderViewRef.current.fov, targetViewRef.current.fov) };
    targetViewRef.current = focusView;
    setCurrentView(focusView);
    setTeleportTransition({
      phase: "departing",
      left: clamp(getNumber(origin?.left, 50), 0, 100),
      top: clamp(getNumber(origin?.top, 50), 0, 100),
    });

    const texturePromise = loadTextureForScene(loadedScene);
    const departTimer = window.setTimeout(async () => {
      await Promise.race([texturePromise, wait(TELEPORT_TEXTURE_WAIT_MS)]);
      applyScene(loadedScene);
      setTeleportTransition((current) => ({ ...current, phase: "arriving" }));

      const arriveTimer = window.setTimeout(() => {
        setTeleportTransition((current) => ({ ...current, phase: "idle" }));
      }, TELEPORT_ARRIVE_MS);
      transitionTimeoutsRef.current.push(arriveTimer);
    }, TELEPORT_DEPART_MS);

    transitionTimeoutsRef.current.push(departTimer);
  };

  const enterFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!panoramaUrl || isTeleporting || isTourControlTarget(event.target)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size >= 2) {
      pinchRef.current = {
        active: true,
        distance: Math.max(1, getPointerDistance(pointersRef.current)),
        fov: targetViewRef.current.fov,
      };
      dragRef.current.active = false;
      setIsDragging(false);
      if (tour?.settings?.autorotate) setAutorotateEnabled(false);
      return;
    }

    const targetView = targetViewRef.current;
    dragRef.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      yaw: targetView.yaw,
      pitch: targetView.pitch,
    };
    setIsDragging(true);
    if (tour?.settings?.autorotate) setAutorotateEnabled(false);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }

    if (pinchRef.current.active && pointersRef.current.size >= 2) {
      event.preventDefault();
      const distance = Math.max(1, getPointerDistance(pointersRef.current));
      const nextFov = pinchRef.current.fov * (pinchRef.current.distance / distance);
      const nextView = cloneView({ ...targetViewRef.current, fov: nextFov });
      targetViewRef.current = nextView;
      setCurrentView(nextView);
      return;
    }

    if (!dragRef.current.active) return;
    event.preventDefault();
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    const nextView = cloneView({
      yaw: normalizeAngle(dragRef.current.yaw - dx * 0.0055),
      pitch: clamp(dragRef.current.pitch + dy * 0.0045, -1.2, 1.2),
      fov: targetViewRef.current.fov,
    });
    targetViewRef.current = nextView;
    setCurrentView(nextView);
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    dragRef.current.active = false;
    if (pointersRef.current.size < 2) pinchRef.current.active = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (isLoading && (!tour || !orderedScenes.length)) {
    return <div className="al-vtour-shell" style={{ height }}><div className="al-vtour-loading">Cargando recorrido 360°...</div></div>;
  }

  if (!tour || !orderedScenes.length) return null;

  const fallbackBackgroundScale = Math.max(220, Math.min(900, (TWO_PI / currentView.fov) * 100));
  const fallbackBackgroundPositionX = ((normalizeAngle(currentView.yaw) + Math.PI) / TWO_PI) * 100;
  const fallbackBackgroundPositionY = 50 - clamp(currentView.pitch, -1.2, 1.2) * 28;
  const teleportClassName = teleportTransition.phase === "idle" ? "" : `is-teleporting is-teleport-${teleportTransition.phase}`;
  const teleportStyle = {
    "--al-vtour-teleport-x": `${teleportTransition.left}%`,
    "--al-vtour-teleport-y": `${teleportTransition.top}%`,
  } as CSSProperties;

  return (
    <section
      className={`al-vtour-shell ${embedded ? "al-vtour-embedded" : ""} ${teleportClassName}`}
      style={{ height, ...teleportStyle }}
    >
      {fallbackImageUrl && <img className="al-vtour-fallback-image" src={fallbackImageUrl} alt="" />}
      <div
        ref={containerRef}
        className={`al-vtour-canvas ${isDragging ? "is-dragging" : ""} ${teleportClassName}`}
        role="application"
        aria-label="Visor de recorrido virtual 360"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        {panoramaUrl && (
          <div
            className="al-vtour-css-panorama"
            style={{
              backgroundImage: `url(${JSON.stringify(panoramaUrl)})`,
              backgroundSize: `${fallbackBackgroundScale}% auto`,
              backgroundPosition: `${fallbackBackgroundPositionX}% ${fallbackBackgroundPositionY}%`,
            }}
          />
        )}
        <div ref={webglRef} className={`al-vtour-panorama-image ${isWebglReady ? "is-ready" : ""}`} />
        <div className="al-vtour-gradient" />
        <div className="al-vtour-teleport-rush" aria-hidden="true" />
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
                switchScene(hotspot.targetSceneId, {
                  yaw: getNumber(hotspot.yaw, currentView.yaw),
                  pitch: getNumber(hotspot.pitch, currentView.pitch),
                  left,
                  top,
                });
              } else if (hotspot.payload?.url) {
                window.open(hotspot.payload.url, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <span aria-hidden="true" />
            {hotspot.label && <em>{hotspot.label}</em>}
          </button>
        ))}
      </div>
      <div className="al-vtour-teleport-flash" aria-hidden="true" />
      <div className="al-vtour-topbar">
        <div>
          <span>Recorrido virtual</span>
          <strong>{tour.title}</strong>
        </div>
      </div>
      {tour.settings?.fullscreen !== false && (
        <button type="button" className="al-vtour-start-btn" onClick={enterFullscreen} data-vtour-control="true">
          Iniciar recorrido
        </button>
      )}
      {isLoading && <div className="al-vtour-loading">Cargando recorrido 360°...</div>}
      {error && <div className="al-vtour-error">{error}</div>}
    </section>
  );
};

export default VirtualTourViewer;
