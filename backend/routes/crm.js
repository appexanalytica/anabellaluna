const express = require('express');
const DocumentLink = require('../models/DocumentLink');
const Document = require('../models/Document');

const router = express.Router();

// Link a CRM entity: { documentId, entityType, entityId }
router.post('/link', async (req, res) => {
  const { documentId, entityType, entityId } = req.body;
  if (!documentId || !entityType || !entityId) return res.status(400).json({ error: 'missing fields' });
  try {
    const existing = await DocumentLink.findOne({ document: documentId, entity_type: entityType, entity_id: entityId }).exec();
    if (existing) return res.json({ ok: true, id: existing._id });
    const link = new DocumentLink({ document: documentId, entity_type: entityType, entity_id: entityId });
    await link.save();
    return res.json({ ok: true, id: link._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Unlink
router.post('/unlink', async (req, res) => {
  const { documentId, entityType, entityId } = req.body;
  if (!documentId || !entityType || !entityId) return res.status(400).json({ error: 'missing fields' });
  try {
    const result = await DocumentLink.deleteOne({ document: documentId, entity_type: entityType, entity_id: entityId }).exec();
    return res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List links for an entity: /crm/links?entityType=cliente&entityId=123
router.get('/links', async (req, res) => {
  const { entityType, entityId } = req.query;
  if (!entityType || !entityId) return res.status(400).json({ error: 'entityType and entityId required' });
  try {
    const links = await DocumentLink.find({ entity_type: entityType, entity_id: entityId }).populate('document', 'nombre tipo').exec();
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
