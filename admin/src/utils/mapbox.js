import API_CONFIG from '../config/api';

let cachedToken = null;
let pending = null;

/**
 * Resolves the Mapbox public token: REACT_APP_MAPBOX_TOKEN if set at build time,
 * otherwise fetched once from the backend (GET /public/maps-config) and cached.
 */
export function getMapboxToken() {
  const envToken = process.env.REACT_APP_MAPBOX_TOKEN;
  if (envToken) return Promise.resolve(envToken);
  if (cachedToken !== null) return Promise.resolve(cachedToken);
  if (!pending) {
    pending = fetch(`${API_CONFIG.baseURL}/public/maps-config`)
      .then((res) => (res.ok ? res.json() : { mapboxToken: '' }))
      .then((data) => {
        cachedToken = (data && data.mapboxToken) || '';
        return cachedToken;
      })
      .catch(() => {
        pending = null;
        return '';
      });
  }
  return pending;
}

/**
 * Forward geocoding (Mapbox Geocoding v6) tuned for Argentina:
 * autocompletes while the user types an address. Returns GeoJSON features.
 */
export async function searchAddress(query) {
  const token = await getMapboxToken();
  if (!token) return [];
  const params = new URLSearchParams({
    q: query,
    autocomplete: 'true',
    limit: '6',
    language: 'es',
    country: 'ar',
    proximity: '-58.3816,-34.6037',
    types: 'address,street,place,locality,neighborhood,postcode',
    access_token: token,
  });
  try {
    const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.features || [];
  } catch {
    return [];
  }
}

/**
 * Structured forward geocoding (Mapbox v6): resolves street + house number ("altura")
 * to rooftop/interpolated coordinates. Returns the best matching feature or null.
 */
export async function geocodeStreetNumber({ street, number, place, region, postcode }) {
  const token = await getMapboxToken();
  if (!token || !street) return null;
  const params = new URLSearchParams({
    street,
    language: 'es',
    country: 'ar',
    limit: '1',
    types: 'address',
    proximity: '-58.3816,-34.6037',
    access_token: token,
  });
  if (number) params.set('address_number', String(number));
  if (place) params.set('place', place);
  if (region) params.set('region', region);
  if (postcode) params.set('postcode', postcode);
  try {
    const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return (data.features && data.features[0]) || null;
  } catch {
    return null;
  }
}

/** Maps a Mapbox v6 feature to the property location fields used across the CRM. */
export function featureToLocation(feature) {
  const props = (feature && feature.properties) || {};
  const ctx = props.context || {};
  const coords = props.coordinates || {};
  // Street name + house number ("altura") split, so forms can edit them separately
  const altura = (ctx.address && ctx.address.address_number) || '';
  const calle = (ctx.street && ctx.street.name)
    || (ctx.address && ctx.address.street_name)
    || (props.feature_type === 'street' || props.feature_type === 'address' ? props.name : '')
    || '';
  return {
    direccion: props.full_address || props.name || '',
    calle,
    altura: altura ? String(altura) : '',
    barrio: (ctx.neighborhood && ctx.neighborhood.name) || (ctx.locality && ctx.locality.name) || '',
    ciudad: (ctx.place && ctx.place.name) || '',
    provincia: (ctx.region && ctx.region.name) || '',
    pais: (ctx.country && ctx.country.name) || '',
    codigoPostal: (ctx.postcode && ctx.postcode.name) || '',
    lat: coords.latitude != null ? String(coords.latitude) : '',
    lng: coords.longitude != null ? String(coords.longitude) : '',
  };
}

/**
 * Splits a stored "direccion" string into street + number, e.g.
 * "Av. Santa Fe 1234, Buenos Aires" -> { calle: 'Av. Santa Fe', altura: '1234' }.
 * Used to hydrate the edit form from properties saved as a single string.
 */
export function splitDireccion(direccion) {
  const raw = String(direccion || '').split(',')[0].trim();
  const match = raw.match(/^(.*?)\s+(\d+)\s*$/);
  if (match && match[1]) return { calle: match[1].trim(), altura: match[2] };
  return { calle: raw, altura: '' };
}
