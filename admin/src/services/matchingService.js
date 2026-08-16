import { api } from '../config/api';

/**
 * Motor de recomendaciones — cliente HTTP.
 */
const qs = (params) => {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.append(k, String(v));
  });
  const s = search.toString();
  return s ? `?${s}` : '';
};

export const matchingService = {
  /** Propiedades sugeridas para un cliente. */
  propiedadesParaCliente: (clienteId, params = {}) =>
    api.get(`/crm/matching/clientes/${clienteId}/propiedades${qs(params)}`),

  /** Clientes a los que les puede servir una propiedad. */
  clientesParaPropiedad: (propiedadId, params = {}) =>
    api.get(`/crm/matching/propiedades/${propiedadId}/clientes${qs(params)}`),

  /** Marca qué hizo el agente con una recomendación. */
  feedback: (recomendacionId, status, motivo = '') =>
    api.post(`/crm/matching/${recomendacionId}/feedback`, { status, motivo }),

  /** Perfil semántico de una entidad. */
  perfil: (tipo, id) => api.get(`/crm/matching/perfil/${tipo}/${id}`),

  // ── Panel del admin ──────────────────────────────────────────────────────
  oportunidades: (params = {}) => api.get(`/crm/matching/oportunidades${qs(params)}`),
  cobertura: () => api.get('/crm/matching/cobertura'),
  demandaInsatisfecha: (params = {}) => api.get(`/crm/matching/demanda-insatisfecha${qs(params)}`),
  propiedadesHuerfanas: (params = {}) => api.get(`/crm/matching/propiedades-huerfanas${qs(params)}`),

  /** Regenera perfiles (carga inicial o recálculo). */
  reprocesar: (body = {}) => api.post('/crm/matching/reprocesar', body),
};

export default matchingService;
