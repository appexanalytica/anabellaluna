/**
 * WhatsappProvider.js
 * Interfaz base para proveedores de WhatsApp.
 * Todas las implementaciones concretas deben extender esta clase.
 */

class WhatsappProvider {
  // ── Sesiones ──────────────────────────────────────────────────────────────────

  /**
   * Crear una nueva sesión/instancia en el proveedor.
   * @param {string} sessionName - Nombre único de la sesión
   * @param {string} userId - ID del usuario propietario
   */
  async createSession(sessionName, userId) {
    throw new Error('Not implemented');
  }

  /**
   * Eliminar una sesión del proveedor.
   * @param {string} sessionName
   */
  async deleteSession(sessionName) {
    throw new Error('Not implemented');
  }

  /**
   * Iniciar/conectar una sesión existente.
   * @param {string} sessionName
   */
  async startSession(sessionName) {
    throw new Error('Not implemented');
  }

  /**
   * Detener/desconectar una sesión.
   * @param {string} sessionName
   */
  async stopSession(sessionName) {
    throw new Error('Not implemented');
  }

  /**
   * Obtener el QR code actual de la sesión (base64).
   * @param {string} sessionName
   * @returns {string|null} base64 del QR o null si ya está conectado
   */
  async getQrCode(sessionName) {
    throw new Error('Not implemented');
  }

  /**
   * Obtener el estado de conexión de la sesión.
   * @param {string} sessionName
   * @returns {string} Estado: 'open' | 'close' | 'DISCONNECTED' | etc.
   */
  async getSessionStatus(sessionName) {
    throw new Error('Not implemented');
  }

  // ── Mensajes ──────────────────────────────────────────────────────────────────

  /**
   * Enviar mensaje de texto.
   * @param {string} sessionName
   * @param {string} to - Número de teléfono
   * @param {string} text
   */
  async sendText(sessionName, to, text) {
    throw new Error('Not implemented');
  }

  /**
   * Enviar imagen.
   * @param {string} sessionName
   * @param {string} to
   * @param {string} imageUrl
   * @param {string} caption
   */
  async sendImage(sessionName, to, imageUrl, caption) {
    throw new Error('Not implemented');
  }

  /**
   * Enviar documento.
   * @param {string} sessionName
   * @param {string} to
   * @param {string} documentUrl
   * @param {string} filename
   * @param {string} caption
   */
  async sendDocument(sessionName, to, documentUrl, filename, caption) {
    throw new Error('Not implemented');
  }

  /**
   * Enviar audio.
   * @param {string} sessionName
   * @param {string} to
   * @param {string} audioUrl
   */
  async sendAudio(sessionName, to, audioUrl) {
    throw new Error('Not implemented');
  }

  /**
   * Enviar video.
   * @param {string} sessionName
   * @param {string} to
   * @param {string} videoUrl
   * @param {string} caption
   */
  async sendVideo(sessionName, to, videoUrl, caption) {
    throw new Error('Not implemented');
  }

  // ── Chats ─────────────────────────────────────────────────────────────────────

  /**
   * Obtener lista de contactos de la sesión.
   * @param {string} sessionName
   */
  async getContacts(sessionName) {
    throw new Error('Not implemented');
  }

  /**
   * Obtener lista de chats de la sesión.
   * @param {string} sessionName
   */
  async getChats(sessionName) {
    throw new Error('Not implemented');
  }

  /**
   * Archivar un chat.
   * @param {string} sessionName
   * @param {string} chatId
   */
  async archiveChat(sessionName, chatId) {
    throw new Error('Not implemented');
  }

  /**
   * Marcar un chat como leído.
   * @param {string} sessionName
   * @param {string} chatId
   */
  async markAsRead(sessionName, chatId) {
    throw new Error('Not implemented');
  }

  // ── Callbacks de eventos ──────────────────────────────────────────────────────
  // Evolution llama via webhook HTTP, no in-process.
  // Estos métodos registran handlers que el webhook invocará.

  /**
   * Registrar handler para mensajes entrantes.
   * @param {Function} handler
   */
  onMessage(handler) {
    throw new Error('Not implemented');
  }

  /**
   * Registrar handler para actualizaciones de ACK de mensajes.
   * @param {Function} handler
   */
  onMessageAck(handler) {
    throw new Error('Not implemented');
  }

  /**
   * Registrar handler para eventos de presencia.
   * @param {Function} handler
   */
  onPresence(handler) {
    throw new Error('Not implemented');
  }

  /**
   * Registrar handler para cambios de estado de conexión.
   * @param {Function} handler
   */
  onConnectionState(handler) {
    throw new Error('Not implemented');
  }
}

module.exports = WhatsappProvider;
