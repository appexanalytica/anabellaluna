const express = require('express');
const Notification = require('../models/Notification');
const { authenticateToken, requireRole } = require('../auth');
const { buildNavbarSummary, ADMIN_AGENT_ID } = require('../services/navbarSummary');
const { generateAdminNotifications } = require('../services/notificationGenerator');

const router = express.Router();

// Las notificaciones programadas a futuro todavía no son visibles.
function applyVisibilityFilter(filter, now = new Date()) {
  const visibility = [
    { fechaProgramada: null },
    { fechaProgramada: { $exists: false } },
    { fechaProgramada: { $lte: now } },
  ];
  if (filter.$or) {
    filter.$and = filter.$and || [];
    filter.$and.push({ $or: filter.$or });
    filter.$and.push({ $or: visibility });
    delete filter.$or;
    return;
  }
  filter.$or = visibility;
}

// ============ GET /admin/notifications ============
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { leida, tipo, limite = 50, pagina = 1, prioridad } = req.query;
    const filter = { agenteId: ADMIN_AGENT_ID };
    if (leida !== undefined) filter.leida = leida === 'true';
    if (tipo) filter.tipo = tipo;
    if (prioridad) filter.prioridad = prioridad;
    applyVisibilityFilter(filter);

    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limite)).lean(),
      Notification.countDocuments(filter),
    ]);
    res.json({ items, total, pagina: parseInt(pagina), limite: parseInt(limite) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET /admin/notifications/unread-count ============
router.get('/unread-count', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const filter = { agenteId: ADMIN_AGENT_ID, leida: false };
    applyVisibilityFilter(filter);
    const count = await Notification.countDocuments(filter);
    const urgentes = await Notification.countDocuments({ ...filter, prioridad: 'urgente' });
    res.json({ count, urgentes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET /admin/notifications/navbar-summary ============
// MUST be before /:id routes
router.get('/navbar-summary', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const summary = await buildNavbarSummary({
      scopeId: null, // el admin ve toda la inmobiliaria
      notifOwnerId: ADMIN_AGENT_ID,
      incluirContacto: true,
      incluirProximaCita: false,
    });
    res.json(summary);
  } catch (err) {
    console.error('Admin navbar summary error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============ POST /admin/notifications/generate ============
// Escanea datos reales y crea las notificaciones accionables del admin.
// La lógica vive en services/notificationGenerator.js, compartida con el scheduler.
router.post('/generate', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const creadas = await generateAdminNotifications();
    res.json({ ok: true, created: creadas.length });
  } catch (err) {
    console.error('Admin notification generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============ PUT /admin/notifications/mark-all-read ============
// MUST be before /:id routes
router.put('/mark-all-read', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const filter = { agenteId: ADMIN_AGENT_ID, leida: false };
    applyVisibilityFilter(filter);
    const result = await Notification.updateMany(filter, { leida: true, fechaLectura: new Date() });
    res.json({ ok: true, modified: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ DELETE /admin/notifications/clear-read ============
// MUST be before /:id routes
router.delete('/clear-read', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await Notification.deleteMany({ agenteId: ADMIN_AGENT_ID, leida: true });
    res.json({ ok: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PUT /admin/notifications/:id/read ============
router.put('/:id/read', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, agenteId: ADMIN_AGENT_ID },
      { leida: true, fechaLectura: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ DELETE /admin/notifications/:id ============
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({ _id: req.params.id, agenteId: ADMIN_AGENT_ID });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
