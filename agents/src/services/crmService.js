import { api } from '../config/api';

export const crmService = {
  // ============ PROPIEDADES ============
  propiedades: {
    getAll: () => api.get('/crm/propiedades'),
    getById: (id) => api.get(`/crm/propiedades/${id}`),
    create: (data) => api.post('/crm/propiedades', data),
    update: (id, data) => api.put(`/crm/propiedades/${id}`, data),
    delete: (id) => api.delete(`/crm/propiedades/${id}`),
  },

  // ============ CLIENTES ============
  clientes: {
    getAll: () => api.get('/crm/clientes'),
    getById: (id) => api.get(`/crm/clientes/${id}`),
    create: (data) => api.post('/crm/clientes', data),
    update: (id, data) => api.put(`/crm/clientes/${id}`, data),
    delete: (id) => api.delete(`/crm/clientes/${id}`),
  },

  // ============ AGENTES ============
  agentes: {
    getAll: () => api.get('/crm/agentes'),
    getById: (id) => api.get(`/crm/agentes/${id}`),
    create: (data) => api.post('/crm/agentes', data),
    update: (id, data) => api.put(`/crm/agentes/${id}`, data),
    delete: (id) => api.delete(`/crm/agentes/${id}`),
  },

  // ============ OPERACIONES/VENTAS ============
  operaciones: {
    getAll: () => api.get('/crm/operaciones'),
    getById: (id) => api.get(`/crm/operaciones/${id}`),
    create: (data) => api.post('/crm/operaciones', data),
    update: (id, data) => api.put(`/crm/operaciones/${id}`, data),
    delete: (id) => api.delete(`/crm/operaciones/${id}`),
  },

  // ============ CITAS ============
  citas: {
    getAll: () => api.get('/crm/citas'),
    getById: (id) => api.get(`/crm/citas/${id}`),
    create: (data) => api.post('/crm/citas', data),
    update: (id, data) => api.put(`/crm/citas/${id}`, data),
    delete: (id) => api.delete(`/crm/citas/${id}`),
  },

  // ============ TAREAS ============
  tareas: {
    getAll: () => api.get('/crm/tareas'),
    getById: (id) => api.get(`/crm/tareas/${id}`),
    create: (data) => api.post('/crm/tareas', data),
    update: (id, data) => api.put(`/crm/tareas/${id}`, data),
    delete: (id) => api.delete(`/crm/tareas/${id}`),
  },

  // ============ ESTADÍSTICAS ============
  stats: {
    getDashboard: () => api.get('/crm/stats/dashboard'),
    getPropiedadesStats: () => api.get('/crm/stats/propiedades'),
    getVentasStats: () => api.get('/crm/stats/ventas'),
    getAgentesStats: () => api.get('/crm/stats/agentes'),
  },
};

export default crmService;
