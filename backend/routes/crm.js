const express = require('express');
const DocumentLink = require('../models/DocumentLink');
const Document = require('../models/Document');
const Propiedad = require('../models/Propiedad');
const Cliente = require('../models/Cliente');
const Operacion = require('../models/Operacion');
const {
  authenticateToken,
  agentScopeId,
  requireCRMUser,
} = require('../auth');
const { buildNavbarSummary } = require('../services/navbarSummary');

const router = express.Router();

// ============ BÚSQUEDA GLOBAL (Ctrl+K de la navbar) ============
// Devuelve resultados agrupados de propiedades, clientes y operaciones.
// Los agentes sólo ven lo suyo; el admin ve toda la inmobiliaria.
const LIMITE_POR_GRUPO = 5;

/** Escapa el texto para usarlo como regex literal. */
function regexBusqueda(q) {
  return new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

router.get('/search', authenticateToken, requireCRMUser, async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ propiedades: [], clientes: [], operaciones: [], total: 0 });

    const scopeId = agentScopeId(req);
    const rx = regexBusqueda(q);

    const [propiedades, clientes, operaciones] = await Promise.all([
      Propiedad.find({
        ...(scopeId ? { agentId: scopeId } : {}),
        $or: [{ title: rx }, { address: rx }],
      }).select('_id title address status price moneda').limit(LIMITE_POR_GRUPO).lean(),

      Cliente.find({
        ...(scopeId ? { agenteId: scopeId } : {}),
        $or: [{ nombre: rx }, { email: rx }, { telefono: rx }],
      }).select('_id nombre email telefono').limit(LIMITE_POR_GRUPO).lean(),

      Operacion.find({
        ...(scopeId ? { agenteId: scopeId } : {}),
        $or: [{ 'metadata.propiedad': rx }, { 'metadata.cliente': rx }, { estado: rx }],
      }).select('_id tipo estado monto moneda metadata.propiedad metadata.cliente')
        .limit(LIMITE_POR_GRUPO).lean(),
    ]);

    res.json({
      propiedades: propiedades.map((p) => ({
        id: String(p._id),
        titulo: p.title || 'Sin título',
        subtitulo: p.address || '',
        estado: p.status || '',
        precio: p.price || 0,
        moneda: p.moneda || 'USD',
      })),
      clientes: clientes.map((c) => ({
        id: String(c._id),
        titulo: c.nombre || 'Sin nombre',
        subtitulo: c.email || c.telefono || '',
      })),
      operaciones: operaciones.map((o) => ({
        id: String(o._id),
        titulo: o.metadata?.propiedad || `${o.tipo || 'Operación'}`,
        subtitulo: [o.metadata?.cliente, o.estado].filter(Boolean).join(' · '),
        monto: o.monto || 0,
        moneda: o.moneda || 'USD',
      })),
      total: propiedades.length + clientes.length + operaciones.length,
    });
  } catch (err) {
    console.error('Global search error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============ NAVBAR SUMMARY (counts for badges) ============
// La lógica vive en services/navbarSummary.js para que admin y agentes no diverjan.
router.get('/navbar-summary', authenticateToken, requireCRMUser, async (req, res) => {
  try {
    const scopeId = agentScopeId(req);
    const summary = await buildNavbarSummary({
      scopeId,
      notifOwnerId: scopeId,
      // El formulario de contacto del sitio no tiene agente: sólo lo ve quien ve todo.
      incluirContacto: !scopeId,
      incluirProximaCita: true,
    });
    res.json(summary);
  } catch (err) {
    console.error('Navbar summary error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Link a CRM entity: { documentId, entityType, entityId }
router.post('/link', authenticateToken, requireCRMUser, async (req, res) => {
  const { documentId, entityType, entityId } = req.body;
  if (!documentId || !entityType || !entityId) return res.status(400).json({ error: 'missing fields' });
  try {
    const scopeId = agentScopeId(req);
    if (scopeId) {
      const doc = await Document.findById(documentId).lean();
      if (!doc) return res.status(404).json({ error: 'Not found' });
      if (String(doc.agenteId || '') !== scopeId) return res.status(403).json({ error: 'forbidden' });
    }
    const existing = await DocumentLink.findOne({ document: documentId, entity_type: entityType, entity_id: entityId }).exec();
    if (existing) return res.json({ ok: true, id: existing._id });
    const link = new DocumentLink({ document: documentId, entity_type: entityType, entity_id: entityId, agenteId: scopeId || '' });
    await link.save();
    return res.json({ ok: true, id: link._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Unlink
router.post('/unlink', authenticateToken, requireCRMUser, async (req, res) => {
  const { documentId, entityType, entityId } = req.body;
  if (!documentId || !entityType || !entityId) return res.status(400).json({ error: 'missing fields' });
  try {
    const scopeId = agentScopeId(req);
    const filter = { document: documentId, entity_type: entityType, entity_id: entityId };
    if (scopeId) filter.agenteId = scopeId;
    const result = await DocumentLink.deleteOne(filter).exec();
    return res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List links for an entity: /crm/links?entityType=cliente&entityId=123
router.get('/links', authenticateToken, requireCRMUser, async (req, res) => {
  const { entityType, entityId } = req.query;
  if (!entityType || !entityId) return res.status(400).json({ error: 'entityType and entityId required' });
  try {
    const scopeId = agentScopeId(req);
    const filter = { entity_type: entityType, entity_id: entityId };
    if (scopeId) filter.agenteId = scopeId;
    const links = await DocumentLink.find(filter)
      .sort({ order: 1, created_at: 1 })
      .populate('document', 'nombre tipo agenteId url categoria tamano fecha mimetype')
      .exec();
    if (scopeId) {
      const safe = links.filter((l) => String(l.document && l.document.agenteId ? l.document.agenteId : '') === scopeId);
      return res.json(safe);
    }
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reorder links: PATCH /crm/links/reorder { ids: [linkId, ...] } in desired order
router.patch('/links/reorder', authenticateToken, requireCRMUser, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'ids array required' });
  try {
    const scopeId = agentScopeId(req);
    const ops = ids.map((id, idx) => ({
      updateOne: {
        filter: scopeId ? { _id: id, agenteId: scopeId } : { _id: id },
        update: { $set: { order: idx } },
      },
    }));
    await DocumentLink.bulkWrite(ops);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
