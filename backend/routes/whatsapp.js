/**
 * routes/whatsapp.js
 * WhatsApp — Webhook de Evolution API + API interna.
 *
 * Montado en server.js con: app.use('/whatsapp', whatsappRoutes)
 *
 * IMPORTANTE: Las rutas del webhook van ANTES del middleware authenticateToken
 * para que Evolution pueda llamarlas sin token JWT.
 */

const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../auth');
const { getProvider } = require('../services/ProviderFactory');
const { emitToAdmin, emitToUser } = require('../socket');

const WhatsAppContact = require('../models/WhatsAppContact');
const WhatsAppConversation = require('../models/WhatsAppConversation');
const WhatsAppMessage = require('../models/WhatsAppMessage');
const WhatsAppTemplate = require('../models/WhatsAppTemplate');
const WhatsAppSession = require('../models/WhatsAppSession');

const minio = require('../minio');

// ── Helpers ────────────────────────────────────────────────────────────────────

async function findOrCreateContact(phoneNumber, profileName = '') {
  let contact = await WhatsAppContact.findOne({ phoneNumber }).exec();
  if (!contact) {
    contact = new WhatsAppContact({
      phoneNumber,
      displayName: profileName || phoneNumber,
      firstContactAt: new Date(),
      lastContactAt: new Date(),
    });
    await contact.save();
  } else {
    contact.lastContactAt = new Date();
    if (profileName && !contact.displayName) contact.displayName = profileName;
    await contact.save();
  }
  return contact;
}

async function findOrCreateConversation(contact, sessionName) {
  let conv = await WhatsAppConversation.findOne({
    contactId: contact._id,
    status: { $in: ['open', 'pending'] },
  }).exec();

  if (!conv) {
    conv = new WhatsAppConversation({
      contactId: contact._id,
      clienteId: contact.clienteId || null,
      status: 'open',
      sessionName: sessionName || '',
    });
    await conv.save();
  } else if (sessionName && !conv.sessionName) {
    // Actualizar sessionName si no estaba registrado
    conv.sessionName = sessionName;
    await conv.save();
  }
  return conv;
}

async function storeMediaInMinio(buffer, contentType, filename) {
  if (!minio.isConfigured()) return null;

  try {
    await minio.ensureBuckets();
    const bucket = minio.buckets.crm || minio.bucket;
    if (!bucket) return null;

    const safeName = String(filename || 'media').replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectKey = `whatsapp/media/${Date.now()}-${safeName}`;

    await minio.putObject(bucket, objectKey, buffer, buffer.length, {
      'Content-Type': contentType || 'application/octet-stream',
    });

    return { bucket, objectKey };
  } catch (err) {
    console.error('[WhatsApp] Error guardando media en MinIO:', err.message);
    return null;
  }
}

// Mapeo de status de Evolution a internos
const EVOLUTION_STATUS_MAP = {
  PENDING: 'pending',
  SERVER_ACK: 'sent',
  DELIVERY_ACK: 'delivered',
  READ: 'read',
  PLAYED: 'read',
};

// ═══════════════════════════════════════════════════════════════════════════════
// WEBHOOK EVOLUTION — Sin autenticación JWT (Evolution llama sin token)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /whatsapp/webhook/evolution
 * Recibe todos los eventos de Evolution API.
 */
router.post('/webhook/evolution', async (req, res) => {
  // Verificar apikey si está configurado
  const webhookSecret = process.env.EVOLUTION_WEBHOOK_SECRET;
  if (webhookSecret) {
    const receivedKey = req.headers['apikey'] || req.headers['x-api-key'];
    if (receivedKey !== webhookSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // Responder 200 inmediatamente — Evolution no espera procesamiento
  res.json({ ok: true });

  // Procesar de forma asíncrona sin bloquear la respuesta
  setImmediate(async () => {
    try {
      const body = req.body;
      if (!body || !body.event) return;

      const { event, instance: sessionName, data } = body;

      switch (event) {
        case 'messages.upsert':
          await handleMessageUpsert(sessionName, data);
          break;

        case 'connection.update':
          await handleConnectionUpdate(sessionName, data);
          break;

        case 'qrcode.updated':
          await handleQrcodeUpdated(sessionName, data);
          break;

        case 'messages.update':
          await handleMessagesUpdate(sessionName, data);
          break;

        default:
          // Evento no manejado — ignorar silenciosamente
          break;
      }
    } catch (err) {
      console.error('[WhatsApp] Error procesando webhook Evolution:', err.message);
    }
  });
});

async function handleMessageUpsert(sessionName, data) {
  try {
    // Solo procesar mensajes entrantes (no propios)
    if (!data || data.key?.fromMe === true) return;

    const remoteJid = data.key?.remoteJid || '';
    if (!remoteJid) return;

    // Limpiar número: "5491112345678@s.whatsapp.net" → "5491112345678"
    const phoneNumber = remoteJid.split('@')[0];
    const pushName = data.pushName || '';

    // 1. Buscar o crear contacto
    const contact = await findOrCreateContact(phoneNumber, pushName);

    // 2. Buscar sesión para obtener propietario
    const session = await WhatsAppSession.findOne({ sessionName }).exec();
    const sessionUserId = session ? String(session.userId) : null;

    // 3. Buscar o crear conversación
    const conv = await findOrCreateConversation(contact, sessionName);

    // 4. Determinar tipo y contenido del mensaje
    const messageType = data.messageType || 'conversation';
    const msgObj = data.message || {};

    let type = 'text';
    const content = {};

    if (messageType === 'conversation' || msgObj.conversation !== undefined) {
      type = 'text';
      content.text = msgObj.conversation || '';
    } else if (messageType === 'extendedTextMessage' || msgObj.extendedTextMessage) {
      type = 'text';
      content.text = msgObj.extendedTextMessage?.text || '';
    } else if (messageType === 'imageMessage' || msgObj.imageMessage) {
      type = 'image';
      content.mediaUrl = msgObj.imageMessage?.url || '';
      content.caption = msgObj.imageMessage?.caption || '';
      content.mimeType = msgObj.imageMessage?.mimetype || '';
    } else if (messageType === 'documentMessage' || msgObj.documentMessage) {
      type = 'document';
      content.mediaUrl = msgObj.documentMessage?.url || '';
      content.filename = msgObj.documentMessage?.fileName || '';
      content.mimeType = msgObj.documentMessage?.mimetype || '';
      content.caption = msgObj.documentMessage?.caption || '';
    } else if (messageType === 'audioMessage' || msgObj.audioMessage) {
      type = 'audio';
      content.mediaUrl = msgObj.audioMessage?.url || '';
    } else if (messageType === 'videoMessage' || msgObj.videoMessage) {
      type = 'video';
      content.mediaUrl = msgObj.videoMessage?.url || '';
      content.caption = msgObj.videoMessage?.caption || '';
    } else {
      type = messageType || 'text';
      content.raw = JSON.stringify(msgObj).slice(0, 500);
    }

    const msgTimestamp = data.messageTimestamp
      ? new Date(parseInt(data.messageTimestamp, 10) * 1000)
      : new Date();

    // 5. Crear mensaje en BD (deduplicar por waMessageId)
    const evolutionMsgId = data.key?.id || `ev_${Date.now()}`;
    const existing = await WhatsAppMessage.findOne({ waMessageId: evolutionMsgId }).exec();
    if (existing) return;
    const newMessage = new WhatsAppMessage({
      conversationId: conv._id,
      contactId: contact._id,
      waMessageId: evolutionMsgId,
      direction: 'inbound',
      type,
      content,
      status: 'delivered',
      statusAt: { delivered: msgTimestamp },
    });
    await newMessage.save();

    // 6. Actualizar conversación
    const contentText = content.text || content.caption || content.filename || `[${type}]`;
    conv.unreadCount = (conv.unreadCount || 0) + 1;
    conv.lastMessage = {
      content: contentText,
      type,
      direction: 'inbound',
      timestamp: msgTimestamp,
    };
    await conv.save();

    // 7. Emitir evento Socket.IO
    const payload = {
      message: newMessage.toObject(),
      conversation: conv.toObject(),
      contact: contact.toObject(),
      sessionName,
    };

    if (sessionUserId) {
      emitToUser(sessionUserId, 'whatsapp:message', payload);
    }
    emitToAdmin('whatsapp:message', payload);
  } catch (err) {
    console.error('[WhatsApp] handleMessageUpsert error:', err.message);
  }
}

async function handleConnectionUpdate(sessionName, data) {
  try {
    const session = await WhatsAppSession.findOne({ sessionName }).exec();
    if (!session) return;

    const state = data?.state || '';

    if (state === 'open') {
      session.status = 'CONNECTED';
      session.lastSeen = new Date();
    } else if (state === 'close' || state === 'closed') {
      session.status = 'DISCONNECTED';
    }

    await session.save();

    const userId = String(session.userId);
    const statusPayload = {
      sessionName,
      status: session.status,
      phone: session.phone,
      displayName: session.displayName,
    };

    emitToUser(userId, 'whatsapp:session_status', statusPayload);
    emitToAdmin('whatsapp:session_status', { ...statusPayload, userId });
  } catch (err) {
    console.error('[WhatsApp] handleConnectionUpdate error:', err.message);
  }
}

async function handleQrcodeUpdated(sessionName, data) {
  try {
    const session = await WhatsAppSession.findOne({ sessionName }).exec();
    if (!session) return;

    const qrBase64 = data?.qrcode?.base64 || data?.base64 || '';

    session.qrCodeBase64 = qrBase64;
    session.status = 'WAITING_QR';
    await session.save();

    const userId = String(session.userId);
    emitToUser(userId, 'whatsapp:session_qr', {
      sessionName,
      qr: qrBase64,
      status: 'WAITING_QR',
    });
  } catch (err) {
    console.error('[WhatsApp] handleQrcodeUpdated error:', err.message);
  }
}

async function handleMessagesUpdate(sessionName, data) {
  try {
    // data es un array de actualizaciones
    const updates = Array.isArray(data) ? data : [data];

    for (const update of updates) {
      const evolutionMsgId = update?.key?.id;
      const evolutionStatus = update?.update?.status;

      if (!evolutionMsgId || !evolutionStatus) continue;

      const mappedStatus = EVOLUTION_STATUS_MAP[evolutionStatus] || evolutionStatus.toLowerCase();

      const message = await WhatsAppMessage.findOne({ waMessageId: evolutionMsgId }).exec();
      if (!message) continue;

      message.status = mappedStatus;
      if (!message.statusAt) message.statusAt = {};

      const now = new Date();
      if (mappedStatus === 'sent') message.statusAt.sent = now;
      else if (mappedStatus === 'delivered') message.statusAt.delivered = now;
      else if (mappedStatus === 'read') message.statusAt.read = now;

      await message.save();

      emitToAdmin('whatsapp:status', {
        waMessageId: evolutionMsgId,
        status: mappedStatus,
        statusAt: message.statusAt,
        conversationId: message.conversationId,
        sessionName,
      });
    }
  } catch (err) {
    console.error('[WhatsApp] handleMessagesUpdate error:', err.message);
  }
}

// ── Mantener compatibilidad con webhook de verificación Meta (GET) ──────────────
// Se deja el GET para no romper configuraciones existentes
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('[WhatsApp] Webhook Meta verificado.');
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: 'Forbidden' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API INTERNA — Con autenticación JWT
// ═══════════════════════════════════════════════════════════════════════════════

router.use(authenticateToken);

// ── Helpers RBAC ───────────────────────────────────────────────────────────────

function isAdmin(req) {
  return req.user && req.user.role === 'admin';
}

function getRequestUserId(req) {
  return String(req.user.sub || req.user.id || '');
}

/**
 * Devuelve los sessionNames que pertenecen al usuario autenticado.
 * Si es admin, devuelve null (sin restricción).
 */
async function getOwnedSessionNames(req) {
  if (isAdmin(req)) return null;
  const userId = getRequestUserId(req);
  const sessions = await WhatsAppSession.find({ userId }).select('sessionName').lean().exec();
  return sessions.map((s) => s.sessionName);
}

/**
 * Verifica que el usuario autenticado puede acceder a una conversación.
 * Admin: siempre sí. Agente: solo si la conversación pertenece a una de sus sesiones.
 */
async function canAccessConversation(req, conv) {
  if (isAdmin(req)) return true;
  const ownedNames = await getOwnedSessionNames(req);
  return ownedNames.includes(conv.sessionName);
}

// ── Conversaciones ─────────────────────────────────────────────────────────────

router.get('/conversations', async (req, res) => {
  try {
    const { status, agentId, sessionName } = req.query;
    const filter = {};
    if (status) filter.status = status;

    if (isAdmin(req)) {
      // Admin: puede filtrar por agente o sesión opcionalmente
      if (agentId) filter.assignedAgentId = agentId;
      if (sessionName) filter.sessionName = sessionName;
    } else {
      // Agente: solo ve las conversaciones de sus propias sesiones
      const ownedNames = await getOwnedSessionNames(req);
      filter.sessionName = { $in: ownedNames };
    }

    const conversations = await WhatsAppConversation.find(filter)
      .populate('contactId')
      .populate('assignedAgentId', 'nombre email')
      .sort({ updatedAt: -1 })
      .exec();

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
    const skip = (page - 1) * limit;

    const conv = await WhatsAppConversation.findById(id).exec();
    if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' });

    if (!await canAccessConversation(req, conv)) {
      return res.status(403).json({ error: 'No autorizado para acceder a esta conversación' });
    }

    const [messages, total] = await Promise.all([
      WhatsAppMessage.find({ conversationId: id })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      WhatsAppMessage.countDocuments({ conversationId: id }),
    ]);

    return res.json({
      messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /whatsapp/conversations/:id/send
 * Enviar mensaje en una conversación usando el proveedor activo.
 * Body: { type, text, mediaUrl, filename, caption }
 */
router.post('/conversations/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type = 'text',
      text,
      mediaUrl,
      filename,
      caption,
    } = req.body;

    const conv = await WhatsAppConversation.findById(id).populate('contactId').exec();
    if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' });

    if (!await canAccessConversation(req, conv)) {
      return res.status(403).json({ error: 'No autorizado para enviar mensajes en esta conversación' });
    }

    const phoneNumber = conv.contactId.phoneNumber;
    const sessionName = conv.sessionName;

    if (!sessionName) {
      return res.status(400).json({ error: 'La conversación no tiene sesión asignada (sessionName vacío)' });
    }

    const content = {};
    let providerResponse;

    if (type === 'text') {
      if (!text) return res.status(400).json({ error: 'El campo text es requerido' });
      providerResponse = await getProvider().sendText(sessionName, phoneNumber, text);
      content.text = text;
    } else if (type === 'image') {
      if (!mediaUrl) return res.status(400).json({ error: 'mediaUrl es requerido para imagen' });
      providerResponse = await getProvider().sendImage(sessionName, phoneNumber, mediaUrl, caption || '');
      content.mediaUrl = mediaUrl;
      content.caption = caption || '';
    } else if (type === 'document') {
      if (!mediaUrl) return res.status(400).json({ error: 'mediaUrl es requerido para documento' });
      providerResponse = await getProvider().sendDocument(sessionName, phoneNumber, mediaUrl, filename || 'document', caption || '');
      content.mediaUrl = mediaUrl;
      content.filename = filename || '';
      content.caption = caption || '';
    } else if (type === 'audio') {
      if (!mediaUrl) return res.status(400).json({ error: 'mediaUrl es requerido para audio' });
      providerResponse = await getProvider().sendAudio(sessionName, phoneNumber, mediaUrl);
      content.mediaUrl = mediaUrl;
    } else if (type === 'video') {
      if (!mediaUrl) return res.status(400).json({ error: 'mediaUrl es requerido para video' });
      providerResponse = await getProvider().sendVideo(sessionName, phoneNumber, mediaUrl, caption || '');
      content.mediaUrl = mediaUrl;
      content.caption = caption || '';
    } else {
      return res.status(400).json({ error: `Tipo de mensaje no soportado: ${type}` });
    }

    const agentId = req.user && (req.user.agenteId || req.user.sub || req.user.id);
    const newMessage = new WhatsAppMessage({
      conversationId: conv._id,
      contactId: conv.contactId._id,
      direction: 'outbound',
      type,
      content,
      status: 'sent',
      statusAt: { sent: new Date() },
      agentId: agentId || null,
    });
    await newMessage.save();

    const contentText = text || caption || filename || `[${type}]`;
    conv.lastMessage = {
      content: contentText,
      type,
      direction: 'outbound',
      timestamp: new Date(),
    };
    await conv.save();

    return res.status(201).json({ message: newMessage, providerResponse });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/conversations/:id/assign', async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'Solo el administrador puede reasignar conversaciones' });
  }
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const conv = await WhatsAppConversation.findByIdAndUpdate(
      id,
      { assignedAgentId: agentId || null },
      { new: true }
    )
      .populate('contactId')
      .populate('assignedAgentId', 'nombre email')
      .exec();

    if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' });
    return res.json(conv);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/conversations/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const conv = await WhatsAppConversation.findByIdAndUpdate(
      id,
      { unreadCount: 0 },
      { new: true }
    ).exec();

    if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' });
    return res.json({ ok: true, conversation: conv });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/conversations/:id/label', async (req, res) => {
  try {
    const { id } = req.params;
    const { labels } = req.body;

    if (!Array.isArray(labels)) {
      return res.status(400).json({ error: 'labels debe ser un array' });
    }

    const conv = await WhatsAppConversation.findByIdAndUpdate(
      id,
      { labels },
      { new: true }
    ).exec();

    if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' });
    return res.json(conv);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/conversations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'closed', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status debe ser open, closed o pending' });
    }

    const conv = await WhatsAppConversation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();

    if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' });
    return res.json(conv);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Contactos ──────────────────────────────────────────────────────────────────

router.get('/contacts', async (req, res) => {
  try {
    const { q, limit = '100', page = '1' } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (q) {
      filter.$or = [
        { phoneNumber: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      WhatsAppContact.find(filter)
        .populate('clienteId', 'nombre email')
        .sort({ lastContactAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      WhatsAppContact.countDocuments(filter),
    ]);

    res.json({ contacts, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/contacts/:id/link-cliente', async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId } = req.body;

    const contact = await WhatsAppContact.findByIdAndUpdate(
      id,
      { clienteId: clienteId || null },
      { new: true }
    )
      .populate('clienteId', 'nombre email')
      .exec();

    if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });

    if (clienteId) {
      await WhatsAppConversation.updateMany(
        { contactId: id },
        { clienteId }
      );
    }

    return res.json(contact);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Templates ──────────────────────────────────────────────────────────────────

router.get('/templates', async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const templates = await WhatsAppTemplate.find(filter)
      .sort({ name: 1 })
      .exec();

    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Estadísticas ───────────────────────────────────────────────────────────────

router.get('/stats', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalConversations,
      openConversations,
      messagesHoy,
      totalMessages,
    ] = await Promise.all([
      WhatsAppConversation.countDocuments({}),
      WhatsAppConversation.countDocuments({ status: 'open' }),
      WhatsAppMessage.countDocuments({ createdAt: { $gte: todayStart } }),
      WhatsAppMessage.countDocuments({}),
    ]);

    let avgResponseMs = null;
    try {
      const recentInbound = await WhatsAppMessage.find({
        direction: 'inbound',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      })
        .select('conversationId createdAt')
        .sort({ createdAt: 1 })
        .limit(200)
        .lean();

      const responseTimes = [];
      for (const inMsg of recentInbound) {
        const outMsg = await WhatsAppMessage.findOne({
          conversationId: inMsg.conversationId,
          direction: 'outbound',
          createdAt: { $gt: inMsg.createdAt },
        })
          .select('createdAt')
          .sort({ createdAt: 1 })
          .lean();

        if (outMsg) {
          responseTimes.push(outMsg.createdAt - inMsg.createdAt);
        }
      }

      if (responseTimes.length > 0) {
        avgResponseMs = Math.round(
          responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        );
      }
    } catch (e) {
      // no crítico
    }

    res.json({
      totalConversations,
      openConversations,
      messagesHoy,
      totalMessages,
      avgResponseMs,
      avgResponseMinutes: avgResponseMs ? Math.round(avgResponseMs / 60000) : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
