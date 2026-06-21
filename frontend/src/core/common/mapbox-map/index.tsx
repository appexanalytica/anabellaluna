import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapboxToken } from "../../../lib/mapbox";

// Buenos Aires fallback when no coordinates are provided
const DEFAULT_CENTER: [number, number] = [-58.3816, -34.6037];

interface MapboxMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number | string;
  showMarker?: boolean;
  markerColor?: string;
  /** Permite abrir un modal a pantalla completa al hacer click */
  expandable?: boolean;
  /** Habilita el zoom con la rueda del mouse (activado en el modal) */
  scrollZoom?: boolean;
}

const MapboxMap = ({
  lat,
  lng,
  zoom = 15,
  height = 320,
  showMarker = true,
  markerColor = "#e7424b",
  expandable = false,
  scrollZoom = false,
}: MapboxMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasCoords = typeof lat === "number" && Number.isFinite(lat) && typeof lng === "number" && Number.isFinite(lng);
  const canExpand = expandable && hasCoords;

  // Cerrar modal con Escape
  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getMapboxToken();
      if (cancelled || !containerRef.current || mapRef.current) return;
      if (!token) {
        setTokenMissing(true);
        return;
      }
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: hasCoords ? [lng as number, lat as number] : DEFAULT_CENTER,
        zoom: hasCoords ? zoom : 11,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      if (scrollZoom) {
        map.scrollZoom.enable();
      } else {
        map.scrollZoom.disable();
      }
      if (hasCoords && showMarker) {
        markerRef.current = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([lng as number, lat as number])
          .addTo(map);
      }
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep pin and center in sync if coordinates change after mount
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !hasCoords) return;
    map.setCenter([lng as number, lat as number]);
    if (markerRef.current) {
      markerRef.current.setLngLat([lng as number, lat as number]);
    } else if (showMarker) {
      markerRef.current = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([lng as number, lat as number])
        .addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  if (tokenMissing) {
    return (
      <div
        className="d-flex align-items-center justify-content-center text-secondary"
        style={{ width: "100%", height, background: "#f1f5f9", fontSize: "0.85rem" }}
      >
        Mapa no disponible — falta configurar el token de Mapbox
      </div>
    );
  }

  return (
    <>
      <div style={{ width: "100%", height, position: "relative" }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            title="Ver mapa completo"
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              border: "none",
              borderRadius: 6,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 500,
              padding: "5px 8px",
              cursor: "pointer",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            Ampliar
          </button>
        )}
      </div>

      {expanded && canExpand && (
        <div
          onClick={() => setExpanded(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 1100,
              height: "85vh",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              background: "#fff",
            }}
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              title="Cerrar"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                border: "none",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <MapboxMap
              lat={lat}
              lng={lng}
              zoom={16}
              height="100%"
              showMarker={showMarker}
              markerColor={markerColor}
              scrollZoom
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MapboxMap;
