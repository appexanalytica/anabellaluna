import { api, apiRequest } from '../config/api';

export const tourService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/crm/tours${qs ? `?${qs}` : ''}`);
  },
  get: (id) => api.get(`/crm/tours/${encodeURIComponent(id)}`),
  create: (data) => api.post('/crm/tours', data),
  update: (id, data) => api.put(`/crm/tours/${encodeURIComponent(id)}`, data),
  delete: (id) => api.delete(`/crm/tours/${encodeURIComponent(id)}`),
  publish: (id, published) => api.patch(`/crm/tours/${encodeURIComponent(id)}/publish`, { published }),
  reorderScenes: (tourId, sceneIds) => api.patch(`/crm/tours/${encodeURIComponent(tourId)}/scenes/reorder`, { sceneIds }),
  updateScene: (tourId, sceneId, data) => api.put(`/crm/tours/${encodeURIComponent(tourId)}/scenes/${encodeURIComponent(sceneId)}`, data),
  deleteScene: (tourId, sceneId) => api.delete(`/crm/tours/${encodeURIComponent(tourId)}/scenes/${encodeURIComponent(sceneId)}`),
  createHotspot: (tourId, sceneId, data) => api.post(`/crm/tours/${encodeURIComponent(tourId)}/scenes/${encodeURIComponent(sceneId)}/hotspots`, data),
  updateHotspot: (tourId, hotspotId, data) => api.put(`/crm/tours/${encodeURIComponent(tourId)}/hotspots/${encodeURIComponent(hotspotId)}`, data),
  deleteHotspot: (tourId, hotspotId) => api.delete(`/crm/tours/${encodeURIComponent(tourId)}/hotspots/${encodeURIComponent(hotspotId)}`),
  uploadScene: (tourId, file, fields = {}) => {
    const formData = new FormData();
    formData.append('panorama', file);
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, String(value));
    });
    return apiRequest(`/crm/tours/${encodeURIComponent(tourId)}/scenes/upload`, {
      method: 'POST',
      body: formData,
      headers: {},
    });
  },
};

export default tourService;
