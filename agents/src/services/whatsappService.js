import { api } from '../config/api';

const whatsappService = {
  // Conversaciones
  getConversations: () => api.get('/whatsapp/conversations'),

  getMessages: (conversationId, page = 1, limit = 50) =>
    api.get(`/whatsapp/conversations/${conversationId}/messages?page=${page}&limit=${limit}`),

  sendMessage: (conversationId, payload) =>
    api.post(`/whatsapp/conversations/${conversationId}/send`, payload),

  assignConversation: (conversationId, agentId) =>
    api.patch(`/whatsapp/conversations/${conversationId}/assign`, { agentId }),

  markAsRead: (conversationId) =>
    api.patch(`/whatsapp/conversations/${conversationId}/read`),

  updateLabel: (conversationId, labels) =>
    api.patch(`/whatsapp/conversations/${conversationId}/label`, { labels }),

  updateStatus: (conversationId, status) =>
    api.patch(`/whatsapp/conversations/${conversationId}/status`, { status }),

  // Contactos
  getContacts: () => api.get('/whatsapp/contacts'),

  linkCliente: (contactId, clienteId) =>
    api.post(`/whatsapp/contacts/${contactId}/link-cliente`, { clienteId }),

  // Templates
  getTemplates: () => api.get('/whatsapp/templates'),

  // Estadísticas
  getStats: () => api.get('/whatsapp/stats'),

  // Sesiones
  getSessions: () => api.get('/whatsapp/sessions'),
  createSession: () => api.post('/whatsapp/sessions', {}),
  getSessionQr: (sessionName) => api.get(`/whatsapp/sessions/${sessionName}/qr`),
  getSessionStatus: (sessionName) => api.get(`/whatsapp/sessions/${sessionName}/status`),
  deleteSession: (sessionName) => api.delete(`/whatsapp/sessions/${sessionName}`),
  stopSession: (sessionName) => api.post(`/whatsapp/sessions/${sessionName}/stop`, {}),
  startSession: (sessionName) => api.post(`/whatsapp/sessions/${sessionName}/start`, {}),
};

export default whatsappService;
