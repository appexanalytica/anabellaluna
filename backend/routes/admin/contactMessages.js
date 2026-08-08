const express = require('express');
const ContactMessage = require('../../models/ContactMessage');
const { authenticateToken, requireRole } = require('../../auth');

const router = express.Router();

// ============ GET /admin/contact-messages ============
// Mensajes del formulario de contacto del sitio público
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { leido, limite = 500 } = req.query;
    const filter = {};
    if (leido !== undefined) filter.leido = leido === 'true';

    const items = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limite, 10) || 500, 1000))
      .lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PATCH /admin/contact-messages/:id/read ============
router.patch('/:id/read', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const leido = !(req.body && req.body.read === false);
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { $set: { leido } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ============ DELETE /admin/contact-messages/:id ============
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
