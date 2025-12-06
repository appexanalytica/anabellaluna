const express = require('express');
const Tarea = require('../models/Tarea');
const { authenticateToken } = require('../auth');

const router = express.Router();

// Listar tareas con filtros opcionales ?status=Open&priority=Alta
router.get('/', async (req, res) => {
  try {
    const { status, priority, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { summary: { $regex: q, $options: 'i' } }
    ];
    const tareas = await Tarea.find(filter).sort({ updatedAt: -1 }).limit(1000).lean();
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una tarea
router.get('/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id).lean();
    if (!tarea) return res.status(404).json({ error: 'Not found' });
    res.json(tarea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear tarea
router.post('/', authenticateToken, async (req, res) => {
  try {
    const body = req.body || {};
    const tarea = await Tarea.create(body);
    res.status(201).json(tarea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar tarea
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar tarea
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Tarea.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
