/**
 * routes/whatsappSessions.js
 * Gestión de sesiones de WhatsApp (Evolution API).
 *
 * Montado en server.js con: app.use('/whatsapp/sessions', whatsappSessionsRoutes)
 * IMPORTANTE: debe quedar ANTES de app.use('/whatsapp', whatsappRoutes).
 */

const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../auth');
const { getProvider } = require('../services/ProviderFactory');
const WhatsAppSession = require('../models/WhatsAppSession');
const { emitToUser, emitToAdmin } = require('../socket');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// ── Helper de autorización ─────────────────────────────────────────────────────

/**
 * Verifica que el usuario puede operar sobre la sesión.
 * Admin puede ver/modificar cualquier sesión.
 * Otros usuarios solo sus propias sesiones.
 */
function isAuthorized(req, session) {
  if (req.user.role === 'admin') return true;
  const userId = String(req.user.sub || req.user.id || '');
  return String(session.userId) === userId;
}

function getUserId(req) {
  return String(req.user.sub || req.user.id || '');
}

// ── GET / — Listar sesiones ────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.user.role !== 'admin') {
      filter.userId = getUserId(req);
    }

    const sessions = await WhatsAppSession.find(filter)
      .sort({ createdAt: -1 })
      .exec();

    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── POST / — Crear sesión ──────────────────────────────────────────────────────

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { agentId } = req.body;

    // Generar nombre único de sesión
    const sessionName = `${userId}_${Date.now()}`;

    // 1. Crear registro en MongoDB con status CREATED
    const session = new WhatsAppSession({
      sessionName,
      userId,
      agentId: agentId || null,
      provider: process.env.WHATSAPP_PROVIDER || 'evolution',
      status: 'CREATED',
    });
    await session.save();

    // 2. Crear la instancia en Evolution API
    try {
      await getProvider().createSession(sessionName);
    } catch (err) {
      // Si falla la creación en el proveedor, actualizar status a ERROR
      session.status = 'ERROR';
      session.metadata = { providerError: err.message };
      await session.save();
      return res.status(502).json({ error: `Error al crear sesión en proveedor: ${err.message}`, session });
    }

    // 3. Actualizar status a WAITING_QR
    session.status = 'WAITING_QR';
    await session.save();

    // 4. Emitir evento Socket.IO al propietario
    emitToUser(userId, 'whatsapp:session_created', { session: session.toObject() });

    return res.status(201).json(session);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── GET /:name/qr — Obtener QR base64 ─────────────────────────────────────────

router.get('/:name/qr', async (req, res) => {
  try {
    const { name } = req.params;

    const session = await WhatsAppSession.findOne({ sessionName: name }).exec();
    if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (!isAuthorized(req, session)) return res.status(403).json({ error: 'No autorizado' });

    // Obtener QR del proveedor
    let qr = null;
    try {
      qr = await getProvider().getQrCode(name);
    } catch (err) {
      // Si hay error al obtener QR, retornar el guardado en BD (puede estar vacío)
      console.warn(`[WhatsAppSessions] Error obteniendo QR de proveedor para ${name}:`, err.message);
    }

    if (qr) {
      // Guardar QR actualizado en BD
      session.qrCodeBase64 = qr;
      await session.save();
      return res.json({ qr, status: session.status });
    }

    // Sin QR — ya conectado o error
    return res.json({ qr: null, status: session.status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── GET /:name/status — Estado de la sesión ────────────────────────────────────

router.get('/:name/status', async (req, res) => {
  try {
    const { name } = req.params;

    const session = await WhatsAppSession.findOne({ sessionName: name }).exec();
    if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (!isAuthorized(req, session)) return res.status(403).json({ error: 'No autorizado' });

    // Consultar estado actual al proveedor
    let providerStatus = null;
    try {
      providerStatus = await getProvider().getSessionStatus(name);
    } catch (err) {
      console.warn(`[WhatsAppSessions] Error obteniendo status de proveedor para ${name}:`, err.message);
    }

    return res.json({
      sessionName: session.sessionName,
      status: session.status,
      providerStatus,
      phone: session.phone,
      displayName: session.displayName,
      lastSeen: session.lastSeen,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── DELETE /:name — Eliminar sesión ───────────────────────────────────────────

router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const session = await WhatsAppSession.findOne({ sessionName: name }).exec();
    if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (!isAuthorized(req, session)) return res.status(403).json({ error: 'No autorizado' });

    const userId = String(session.userId);

    // Eliminar del proveedor (best-effort — no bloquear si falla)
    try {
      await getProvider().deleteSession(name);
    } catch (err) {
      console.warn(`[WhatsAppSessions] Error eliminando sesión en proveedor ${name}:`, err.message);
    }

    // Eliminar de MongoDB
    await WhatsAppSession.deleteOne({ sessionName: name });

    // Emitir evento
    emitToUser(userId, 'whatsapp:session_deleted', { sessionName: name });
    emitToAdmin('whatsapp:session_deleted', { sessionName: name, userId });

    return res.json({ ok: true, sessionName: name });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── POST /:name/stop — Desconectar sesión ─────────────────────────────────────

router.post('/:name/stop', async (req, res) => {
  try {
    const { name } = req.params;

    const session = await WhatsAppSession.findOne({ sessionName: name }).exec();
    if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (!isAuthorized(req, session)) return res.status(403).json({ error: 'No autorizado' });

    await getProvider().stopSession(name);

    session.status = 'DISCONNECTED';
    await session.save();

    emitToUser(String(session.userId), 'whatsapp:session_status', {
      sessionName: name,
      status: 'DISCONNECTED',
    });

    return res.json({ ok: true, status: 'DISCONNECTED' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── POST /:name/start — Reconectar sesión ─────────────────────────────────────

router.post('/:name/start', async (req, res) => {
  try {
    const { name } = req.params;

    const session = await WhatsAppSession.findOne({ sessionName: name }).exec();
    if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (!isAuthorized(req, session)) return res.status(403).json({ error: 'No autorizado' });

    await getProvider().startSession(name);

    session.status = 'WAITING_QR';
    await session.save();

    emitToUser(String(session.userId), 'whatsapp:session_status', {
      sessionName: name,
      status: 'WAITING_QR',
    });

    return res.json({ ok: true, status: 'WAITING_QR' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
