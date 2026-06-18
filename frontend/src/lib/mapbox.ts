import { API_BASE_URL } from "../config/api";

let cachedToken: string | null = null;
let pending: Promise<string> | null = null;

/**
 * Resolves the Mapbox public token: VITE_MAPBOX_TOKEN if set at build time,
 * otherwise fetched once from the backend (GET /public/maps-config) and cached.
 */
export function getMapboxToken(): Promise<string> {
  const envToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  if (envToken) return Promise.resolve(envToken);
  if (cachedToken !== null) return Promise.resolve(cachedToken);
  if (!pending) {
    pending = fetch(`${API_BASE_URL}/public/maps-config`)
      .then((res) => (res.ok ? res.json() : { mapboxToken: "" }))
      .then((data) => {
        cachedToken = data?.mapboxToken || "";
        return cachedToken as string;
      })
      .catch(() => {
        pending = null;
        return "";
      });
  }
  return pending;
}
