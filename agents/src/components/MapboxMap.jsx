import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxToken } from '../utils/mapbox';

const DEFAULT_CENTER = [-58.3816, -34.6037]; // Buenos Aires [lng, lat]
const LIGHT_STYLE = 'mapbox://styles/mapbox/streets-v12';
const DARK_STYLE = 'mapbox://styles/mapbox/dark-v11';

function parseCoord(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Mapa Mapbox con pin. Si `draggable`, el pin se puede arrastrar y notifica
 * la nueva posición vía onMove(lat, lng).
 */
const MapboxMap = ({
  lat,
  lng,
  zoom = 15,
  height = 200,
  isDark = false,
  draggable = false,
  onMove,
  markerColor = '#ef4444',
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const markerAddedRef = useRef(false);
  const onMoveRef = useRef(onMove);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => { onMoveRef.current = onMove; }, [onMove]);

  const latNum = parseCoord(lat);
  const lngNum = parseCoord(lng);
  const hasCoords = latNum !== null && lngNum !== null;

  // Init map (once)
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
        style: isDark ? DARK_STYLE : LIGHT_STYLE,
        center: hasCoords ? [lngNum, latNum] : DEFAULT_CENTER,
        zoom: hasCoords ? zoom : 11,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

      const marker = new mapboxgl.Marker({ color: markerColor, draggable });
      if (hasCoords) {
        marker.setLngLat([lngNum, latNum]).addTo(map);
        markerAddedRef.current = true;
      }
      if (draggable) {
        marker.on('dragend', () => {
          const pos = marker.getLngLat();
          if (onMoveRef.current) onMoveRef.current(pos.lat, pos.lng);
        });
      }
      markerRef.current = marker;
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      markerRef.current = null;
      markerAddedRef.current = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync pin/center when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker || !hasCoords) return;
    marker.setLngLat([lngNum, latNum]);
    if (!markerAddedRef.current) {
      marker.addTo(map);
      markerAddedRef.current = true;
    }
    map.setCenter([lngNum, latNum]);
  }, [latNum, lngNum, hasCoords]);

  // Sync light/dark style
  useEffect(() => {
    if (mapRef.current) mapRef.current.setStyle(isDark ? DARK_STYLE : LIGHT_STYLE);
  }, [isDark]);

  if (tokenMissing) {
    return (
      <div
        className={`flex items-center justify-center text-xs ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}
        style={{ width: '100%', height }}
      >
        Mapa no disponible — configurá MAPBOX_TOKEN en backend/.env
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default MapboxMap;
