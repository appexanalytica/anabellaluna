/**
 * whatsappService.js
 * Fachada del servicio de WhatsApp.
 * Delega todas las operaciones al proveedor activo (EvolutionProvider u otro).
 * Ya no llama directamente a Meta Cloud API.
 */

const { getProvider } = require('./ProviderFactory');

module.exports = {
  sendText: (sessionName, to, text) =>
    getProvider().sendText(sessionName, to, text),

  sendImage: (sessionName, to, imageUrl, caption) =>
    getProvider().sendImage(sessionName, to, imageUrl, caption),

  sendDocument: (sessionName, to, url, filename, caption) =>
    getProvider().sendDocument(sessionName, to, url, filename, caption),

  sendAudio: (sessionName, to, audioUrl) =>
    getProvider().sendAudio(sessionName, to, audioUrl),

  sendVideo: (sessionName, to, videoUrl, caption) =>
    getProvider().sendVideo(sessionName, to, videoUrl, caption),

  getContacts: (sessionName) =>
    getProvider().getContacts(sessionName),

  getChats: (sessionName) =>
    getProvider().getChats(sessionName),

  markAsRead: (sessionName, chatId) =>
    getProvider().markAsRead(sessionName, chatId),

  getSessionStatus: (sessionName) =>
    getProvider().getSessionStatus(sessionName),

  getQrCode: (sessionName) =>
    getProvider().getQrCode(sessionName),
};
