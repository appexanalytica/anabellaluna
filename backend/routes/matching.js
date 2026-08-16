/**
 * Motor de recomendaciones — Endpoints.
 *
 * Prefix: /crm/matching
 *
 * Visibilidad: un agente ve propiedades de toda la cartera para sus clientes,
 * pero solo sus propios clientes. El admin ve todo.
 */

const express = require('express');
const { authenticateToken, requireCRMUser, agentScopeId } = require('../auth');
const { requireAdmin } = require('../middlewares/rbac');
const Cliente = require('../models/Cliente');
const MatchRecommendation = require('../models/MatchRecommendation');

const matchService = require('../services/matching/matchService');
const profileService = require('../services/matching/profileService');
const insightsService = require('../services/matching/insightsService');
const currency = require('../services/matching/currency');

const router = express.Router();

router.use(authenticateToken, requireCRMUser);

const asInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
};

// ── Cliente → propiedades ─────────────────────────────────────────────────────

// GET /crm/matching/clientes/:id/propiedades
router.get('/clientes/:id/propiedades', async (req, res) => {
  try {
    const scopeId = agentScopeId(req);

    // Un agente solo pide matches de sus propios clientes.
    if (scopeId) {
      const cliente = await Cliente.findById(req.params.id).select('agenteId').lean();
      if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
      if (String(cliente.agenteId || '') !== scopeId) {
        return res.status(403).json({ error: 'Ese cliente no es de tu cartera' });
      }
    }

    const limit    = Math.min(asInt(req.query.limit, 10), 50);
    const minScore = asInt(req.query.minScore, 50);
    const explicar = req.query.explicar !== 'false';
    const topK     = Math.min(asInt(req.query.topK, 5), limit);

    const resultado = await matchService.clienteAPropiedades(req.params.id, { limit, minScore });

    const rate = await currency.getRate();
    resultado.matches = await matchService.explicarMatches(
      resultado.matches,
      'cliente_a_propiedad',
      { topK, explicar, rate }
    );

    res.json(resultado);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// ── Propiedad → clientes ──────────────────────────────────────────────────────

// GET /crm/matching/propiedades/:id/clientes
router.get('/propiedades/:id/clientes', async (req, res) => {
  try {
    const scopeId = agentScopeId(req);

    const limit    = Math.min(asInt(req.query.limit, 10), 50);
    const minScore = asInt(req.query.minScore, 50);
    const explicar = req.query.explicar !== 'false';
    const topK     = Math.min(asInt(req.query.topK, 5), limit);

    const resultado = await matchService.propiedadAClientes(req.params.id, {
      limit,
      minScore,
      agenteId: scopeId || '',
    });

    const rate = await currency.getRate();
    resultado.matches = await matchService.explicarMatches(
      resultado.matches,
      'propiedad_a_cliente',
      { topK, explicar, rate }
    );

    res.json(resultado);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// ── Feedback del agente ───────────────────────────────────────────────────────

const ESTADOS = ['viewed', 'sent', 'visita_agendada', 'descartado', 'convertido'];

// POST /crm/matching/:id/feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    const { status, motivo } = req.body || {};
    if (!ESTADOS.includes(status)) {
      return res.status(400).json({ error: `status debe ser uno de: ${ESTADOS.join(', ')}` });
    }

    const rec = await MatchRecommendation.findById(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Recomendación no encontrada' });

    const scopeId = agentScopeId(req);
    if (scopeId && String(rec.colocadorId || '') !== scopeId) {
      return res.status(403).json({ error: 'Esa recomendación no es de tu cartera' });
    }

    const userId = String(req.user.sub || req.user.id || req.user._id || '');
    const ahora = new Date();

    rec.status = status;
    if (status === 'viewed' && !rec.viewedAt) rec.viewedAt = ahora;
    if (status === 'sent') rec.sentAt = ahora;
    if (['descartado', 'convertido', 'visita_agendada'].includes(status)) {
      rec.resolvedAt = ahora;
      rec.resolvedBy = userId;
    }
    if (status === 'descartado') {
      rec.motivoDescarte = String(motivo || '').slice(0, 300);
      // Un descarte deja de vencer: es memoria, no una sugerencia pendiente.
      rec.expiresAt = undefined;
    }

    await rec.save();
    res.json({ success: true, status: rec.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Panel del admin ───────────────────────────────────────────────────────────

// GET /crm/matching/oportunidades — matches fuertes sin accionar
router.get('/oportunidades', async (req, res) => {
  try {
    const scopeId = agentScopeId(req);
    const horas = asInt(req.query.horas, 48);
    const limit = Math.min(asInt(req.query.limit, 20), 100);

    const data = await insightsService.oportunidadesSinAccion({
      agenteId: scopeId || '',
      horas,
      limit,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /crm/matching/cobertura — qué parte de la cartera de clientes tiene match
router.get('/cobertura', requireAdmin, async (req, res) => {
  try {
    res.json(await insightsService.coberturaDeCartera());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /crm/matching/demanda-insatisfecha — qué piden los clientes y no tenemos
router.get('/demanda-insatisfecha', requireAdmin, async (req, res) => {
  try {
    res.json(await insightsService.demandaInsatisfecha({
      limit: Math.min(asInt(req.query.limit, 20), 50),
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /crm/matching/propiedades-huerfanas — publicadas y sin ningún match
router.get('/propiedades-huerfanas', requireAdmin, async (req, res) => {
  try {
    res.json(await insightsService.propiedadesHuerfanas({
      dias: asInt(req.query.dias, 30),
      limit: Math.min(asInt(req.query.limit, 20), 50),
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Perfiles ──────────────────────────────────────────────────────────────────

// GET /crm/matching/perfil/:tipo/:id — perfil semántico de una entidad
router.get('/perfil/:tipo/:id', async (req, res) => {
  try {
    const tipo = req.params.tipo === 'cliente' ? 'cliente' : 'propiedad';
    const perfil = await profileService.ensureProfile(tipo, req.params.id);
    if (!perfil) return res.status(404).json({ error: 'No se pudo generar el perfil' });

    const { embedding, ...resto } = perfil;
    res.json({ ...resto, tieneVector: Array.isArray(embedding) && embedding.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /crm/matching/reprocesar — carga inicial o recálculo (solo admin)
router.post('/reprocesar', requireAdmin, async (req, res) => {
  try {
    const { entityType, limit, force, conIA } = req.body || {};

    // Puede tardar minutos: se responde enseguida y sigue en segundo plano.
    res.json({ success: true, mensaje: 'Reproceso iniciado. Mirá los logs del servidor para el avance.' });

    profileService.backfill({
      entityType: entityType === 'cliente' || entityType === 'propiedad' ? entityType : undefined,
      limit: Math.min(asInt(limit, 500), 5000),
      force: force === true,
      conIA: conIA !== false,
    }).then((resumen) => {
      matchService.invalidarVectores();
      console.log('[matching] Reproceso terminado:', JSON.stringify(resumen));
    }).catch((err) => {
      console.error('[matching] Reproceso falló:', err.message);
    });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

module.exports = router;
