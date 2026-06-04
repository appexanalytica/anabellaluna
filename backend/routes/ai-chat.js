/**
 * AI Chat Route — New MCP-based endpoint.
 * Replaces the old marketing-ai/conversations message flow.
 *
 * POST /ai/chat          — send message, get AI response
 * GET  /ai/conversations — list conversations
 * POST /ai/conversations — create conversation
 * GET  /ai/conversations/:id/messages — get messages
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { authenticateToken } = require('../auth');
const { resolvePermissions } = require('../middlewares/rbac');
const { aiRateLimit } = require('../middlewares/aiRateLimit');
const { chat } = require('../services/ai/mcpChatService');
const { chatCompletion } = require('../services/ai/providerAbstraction');
const AIConversation = require('../models/AIConversation');
const AIMessage = require('../models/AIMessage');

router.use(authenticateToken);
router.use(aiRateLimit({ maxRequests: 30, windowSeconds: 60 }));

// Middleware: require crm:read or marketing:read
function requireAIAccess(req, res, next) {
  const perms = resolvePermissions(req.user);
  if (!perms.includes('crm:read') && !perms.includes('marketing:read')) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  req.permissions = perms;
  next();
}
router.use(requireAIAccess);

function currentUserId(req) {
  return String(req.user.sub || req.user.id || req.user._id || '');
}

function contextTagFrom(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return `chat:${raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40)}`;
}

// POST /ai/chat — main endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, clientMessageId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (conversationId && !mongoose.isValidObjectId(conversationId)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const userId = currentUserId(req);
    const agenteId = req.user.agenteId || '';

    const result = await chat({
      conversationId: conversationId || null,
      userMessage: message.trim(),
      userId,
      agenteId,
      agenteName: req.user.username || '',
      permissions: req.permissions,
      clientMessageId,
    });

    res.json(result);
  } catch (err) {
    console.error('[AI/Chat] Error:', err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// GET /ai/conversations
router.get('/conversations', async (req, res) => {
  try {
    const userId = currentUserId(req);
    const tag = contextTagFrom(req.query.context || req.query.contextKey);
    const filter = { userId, status: { $ne: 'deleted' } };
    if (tag) filter['metadata.tags'] = tag;
    const conversations = await AIConversation.find(filter)
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /ai/conversations
router.post('/conversations', async (req, res) => {
  try {
    const userId = currentUserId(req);
    const tag = contextTagFrom(req.body.context || req.body.contextKey);
    const conversation = await AIConversation.create({
      userId,
      agenteId: req.user.agenteId || '',
      title: req.body.title || 'Nueva conversación',
      contextType: 'general',
      metadata: { tags: tag ? [tag] : [] },
    });
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ai/conversations/:id/messages
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    const conversation = await AIConversation.findOne({
      _id: req.params.id,
      userId: currentUserId(req),
      status: { $ne: 'deleted' },
    }).select('_id').lean();
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const messages = await AIMessage.find({
      conversationId: req.params.id,
      userId: currentUserId(req),
      $or: [
        { role: 'user' },
        { role: 'tool', content: { $ne: '' } },
        { role: 'assistant', content: { $ne: '' } },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /ai/conversations/:id
router.patch('/conversations/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    const { title, status } = req.body;
    const update = {};
    if (title) update.title = title;
    if (status) update.status = status;
    const updated = await AIConversation.findOneAndUpdate(
      { _id: req.params.id, userId: currentUserId(req) },
      { $set: update },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Conversation not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /ai/generate-description — generate property description with AI
router.post('/generate-description', async (req, res) => {
  try {
    const { propertyData } = req.body;
    if (!propertyData) {
      return res.status(400).json({ error: 'propertyData is required' });
    }

    const p = propertyData;
    const parts = [];
    if (p.tipo) parts.push(`Tipo: ${p.tipo}`);
    if (p.operacion) parts.push(`Operación: ${p.operacion}`);
    if (p.titulo) parts.push(`Título: ${p.titulo}`);
    if (p.direccion) parts.push(`Dirección: ${p.direccion}`);
    if (p.barrio) parts.push(`Barrio: ${p.barrio}`);
    if (p.ciudad) parts.push(`Ciudad: ${p.ciudad}`);
    if (p.precio) parts.push(`Precio: ${p.moneda || 'USD'} ${p.precio}`);
    if (p.m2Totales) parts.push(`Superficie total: ${p.m2Totales} m²`);
    if (p.m2Cubiertos) parts.push(`Superficie cubierta: ${p.m2Cubiertos} m²`);
    if (p.ambientes) parts.push(`Ambientes: ${p.ambientes}`);
    if (p.dormitorios) parts.push(`Dormitorios: ${p.dormitorios}`);
    if (p.baños) parts.push(`Baños: ${p.baños}`);
    if (p.cocheras) parts.push(`Cocheras: ${p.cocheras}`);
    if (p.anioConstruccion) parts.push(`Año de construcción: ${p.anioConstruccion}`);
    if (p.antiguedad) parts.push(`Antigüedad: ${p.antiguedad}`);
    if (p.tipoCalefaccion) parts.push(`Calefacción: ${p.tipoCalefaccion}`);
    if (p.amenities && p.amenities.length) parts.push(`Amenities: ${p.amenities.join(', ')}`);
    if (p.estado) parts.push(`Estado: ${p.estado}`);

    const propertyInfo = parts.join('\n');

    const messages = [
      {
        role: 'system',
        content: `Sos un copywriter inmobiliario profesional argentino. Generás descripciones atractivas, naturales y persuasivas para publicaciones de propiedades.
Reglas:
- Escribí en español rioplatense, profesional pero cálido.
- Destacá los puntos fuertes de la propiedad.
- Usá un tono que invite a visitar la propiedad.
- Máximo 3-4 párrafos cortos.
- No inventés datos que no estén en la información proporcionada.
- No incluyas el precio en la descripción.
- Devolvé SOLO la descripción, sin títulos ni etiquetas.`,
      },
      {
        role: 'user',
        content: `Generá una descripción atractiva para esta propiedad:\n\n${propertyInfo}`,
      },
    ];

    const result = await chatCompletion({
      messages,
      userId: currentUserId(req),
      agenteId: req.user.agenteId || '',
      maxTokens: 1024,
    });

    const description = result.choices[0]?.message?.content || '';
    res.json({ description: description.trim() });
  } catch (err) {
    console.error('[AI/GenerateDescription] Error:', err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
