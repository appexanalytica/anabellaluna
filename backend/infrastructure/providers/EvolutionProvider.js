/**
 * EvolutionProvider.js
 * Implementación de WhatsappProvider para Evolution API (Baileys-based).
 * Toda comunicación HTTP con Evolution está encapsulada aquí.
 *
 * Variables de entorno requeridas:
 *   EVOLUTION_API_URL  — ej: http://localhost:8080
 *   EVOLUTION_API_KEY  — API key de Evolution
 */

const WhatsappProvider = require('../../domain/interfaces/WhatsappProvider');

class EvolutionProvider extends WhatsappProvider {
  constructor() {
    super();
    this._baseUrl = (process.env.EVOLUTION_API_URL || 'http://localhost:8080').replace(/\/$/, '');
    this._apiKey = process.env.EVOLUTION_API_KEY || '';
    this._handlers = {
      message: [],
      messageAck: [],
      presence: [],
      connectionState: [],
    };
  }

  // ── Helper interno ──────────────────────────────────────────────────────────

  /**
   * Realiza una petición HTTP/HTTPS a Evolution API.
   * @param {string} method - GET | POST | PUT | DELETE
   * @param {string} path - Ruta relativa, ej: /instance/create
   * @param {object|null} body - Cuerpo de la petición (se serializa a JSON)
   * @returns {Promise<any>} JSON parseado de la respuesta
   */
  async _request(method, path, body = null) {
    const url = `${this._baseUrl}${path}`;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        apikey: this._apiKey,
      },
    };

    if (body !== null && method !== 'GET' && method !== 'DELETE') {
      options.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(url, options);
    } catch (err) {
      throw new Error(`Evolution API request failed [${method} ${path}]: ${err.message}`);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      const errMsg = data?.message || data?.error || JSON.stringify(data);
      throw new Error(`Evolution API [${response.status}]: ${errMsg}`);
    }

    return data;
  }

  // ── Sesiones ──────────────────────────────────────────────────────────────────

  async createSession(sessionName) {
    const backendUrl = (process.env.BACKEND_PUBLIC_URL || '').replace(/\/$/, '');
    const webhookUrl = backendUrl ? `${backendUrl}/whatsapp/webhook/evolution` : null;

    const body = {
      instanceName: sessionName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    };

    if (webhookUrl) {
      body.webhook = {
        url: webhookUrl,
        byEvents: false,
        base64: false,
        headers: {},
        events: [
          'MESSAGES_UPSERT',
          'MESSAGES_UPDATE',
          'CONNECTION_UPDATE',
          'QRCODE_UPDATED',
        ],
      };
    }

    return this._request('POST', '/instance/create', body);
  }

  async deleteSession(sessionName) {
    return this._request('DELETE', `/instance/delete/${sessionName}`);
  }

  async startSession(sessionName) {
    return this._request('GET', `/instance/connect/${sessionName}`);
  }

  async stopSession(sessionName) {
    return this._request('DELETE', `/instance/logout/${sessionName}`);
  }

  async getQrCode(sessionName) {
    const data = await this._request('GET', `/instance/connect/${sessionName}`);
    return data?.base64 || data?.qrcode?.base64 || null;
  }

  async getSessionStatus(sessionName) {
    const data = await this._request('GET', `/instance/connectionState/${sessionName}`);
    return data?.instance?.state || 'DISCONNECTED';
  }

  // ── Mensajes ──────────────────────────────────────────────────────────────────

  async sendText(sessionName, to, text) {
    return this._request('POST', `/message/sendText/${sessionName}`, {
      number: to,
      text,
    });
  }

  async sendImage(sessionName, to, imageUrl, caption) {
    return this._request('POST', `/message/sendMedia/${sessionName}`, {
      number: to,
      mediatype: 'image',
      media: imageUrl,
      caption,
    });
  }

  async sendDocument(sessionName, to, documentUrl, filename, caption) {
    return this._request('POST', `/message/sendMedia/${sessionName}`, {
      number: to,
      mediatype: 'document',
      media: documentUrl,
      fileName: filename,
      caption,
    });
  }

  async sendAudio(sessionName, to, audioUrl) {
    return this._request('POST', `/message/sendWhatsAppAudio/${sessionName}`, {
      number: to,
      audio: audioUrl,
    });
  }

  async sendVideo(sessionName, to, videoUrl, caption) {
    return this._request('POST', `/message/sendMedia/${sessionName}`, {
      number: to,
      mediatype: 'video',
      media: videoUrl,
      caption,
    });
  }

  // ── Chats ─────────────────────────────────────────────────────────────────────

  async getContacts(sessionName) {
    return this._request('GET', `/chat/findContacts/${sessionName}`);
  }

  async getChats(sessionName) {
    return this._request('GET', `/chat/findChats/${sessionName}`);
  }

  async archiveChat(sessionName, chatId) {
    return this._request('PUT', `/chat/archiveChat/${sessionName}`, {
      chat: chatId,
      archive: true,
    });
  }

  async markAsRead(sessionName, chatId) {
    return this._request('PUT', `/chat/markMessageAsRead/${sessionName}`, {
      readMessages: [{ id: chatId }],
    });
  }

  // ── Callbacks de eventos ──────────────────────────────────────────────────────
  // Evolution llama via webhook HTTP, no in-process.
  // Los handlers se registran aquí y el webhook los invoca.

  onMessage(handler) {
    this._handlers.message.push(handler);
  }

  onMessageAck(handler) {
    this._handlers.messageAck.push(handler);
  }

  onPresence(handler) {
    this._handlers.presence.push(handler);
  }

  onConnectionState(handler) {
    this._handlers.connectionState.push(handler);
  }
}

module.exports = EvolutionProvider;
