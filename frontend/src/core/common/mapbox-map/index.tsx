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
}

const MapboxMap = ({
  lat,
  lng,
  zoom = 15,
  height = 320,
  showMarker = true,
  markerColor = "#e7424b",
}: MapboxMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  const hasCoords = typeof lat === "number" && Number.isFinite(lat) && typeof lng === "number" && Number.isFinite(lng);

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
      map.scrollZoom.disable();
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

  return <div ref={containerRef} style={{ width: "100%", height }} />;
};

export default MapboxMap;
