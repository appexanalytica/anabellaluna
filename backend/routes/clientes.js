const express = require('express');
const Cliente = require('../models/Cliente');
const { authenticateToken } = require('../auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { nombre: { $regex: q, $options: 'i' } } : {};
    const items = await Cliente.find(filter).sort({ updatedAt: -1 }).limit(1000).lean();
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Cliente.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const created = await Cliente.create(req.body || {});
    res.status(201).json(created);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Cliente.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
