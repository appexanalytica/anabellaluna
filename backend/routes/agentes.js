const express = require('express');

const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const Agente = require('../models/Agente');

const User = require('../models/User');

const AgentMetrics = require('../models/AgentMetrics');

const Operacion = require('../models/Operacion');

const Propiedad = require('../models/Propiedad');

const { authenticateToken, requireRole, agentScopeId, requireCRMUser } = require('../auth');
const { authenticateTokenOrService } = require('../middlewares/serviceAuth');

const engagementService = require('../services/engagementService');
const scoreSvc = require('../services/agentScoreService');
const rewardsEngine = require('../services/rewardsEngine');
const RewardConfig = require('../models/RewardConfig');



const router = express.Router();

/**
 * Construye la "scorecard" de un agente: citas, completitud de carga,
 * resumen de recompensas y el puntaje compuesto (0-100) con su desglose.
 * Reutilizado por /metrics/all y /metrics/:id.
 */
async function buildAgentScorecard(agente, deps) {
  const { cfg, qb, monthStart, engagement, metricas } = deps;
  const Cita = require('../models/Cita');
  const Cliente = require('../models/Cliente');
  const DocumentLink = require('../models/DocumentLink');
  const VirtualTour = require('../modules/tours/Tour');
  const SellerTierHistory = require('../models/SellerTierHistory');
  const CustomerLoyalty = require('../models/CustomerLoyalty');
  const BadgeRecord = require('../models/BadgeRecord');

  const agenteId = String(agente._id);
  const year = qb.start.getFullYear();
  const qcfg = (cfg.scoring && cfg.scoring.quality) || undefined;

  const [citasTotal, citasMes, clientesMes] = await Promise.all([
    Cita.countDocuments({ agenteId }).catch(() => 0),
    Cita.countDocuments({ agenteId, fecha: { $gte: monthStart } }).catch(() => 0),
    Cliente.countDocuments({ agenteId, createdAt: { $gte: monthStart } }).catch(() => 0),
  ]);

  // ── Completitud de carga de las propiedades del agente ──
  const props = await Propiedad.find({ agentId: agenteId })
    .select('title description address metadata').lean().catch(() => []);
  const propIds = props.map((p) => String(p._id));
  let formCompleteness = 0;
  let completenessParts = null;
  if (propIds.length) {
    const [links, tours] = await Promise.all([
      DocumentLink.find({ entity_type: 'propiedad', entity_id: { $in: propIds } })
        .populate({ path: 'document', select: 'nombre mimetype' }).lean().catch(() => []),
      VirtualTour.find({ propertyId: { $in: propIds } }).select('propertyId').lean().catch(() => []),
    ]);
    const imgCount = {};
    for (const l of links) {
      if (l.document && scoreSvc.isImageDoc(l.document)) {
        imgCount[l.entity_id] = (imgCount[l.entity_id] || 0) + 1;
      }
    }
    const tourSet = new Set(tours.map((t) => String(t.propertyId)));
    const detailed = props.map((p) => scoreSvc.propertyCompleteness(
      p,
      { imageCount: imgCount[String(p._id)] || 0, hasTour: tourSet.has(String(p._id)) },
      qcfg,
    ));
    formCompleteness = scoreSvc.averageCompleteness(detailed.map((d) => d.score));
    // Promedio de cada parte (para mostrar qué falta a nivel cartera)
    const acc = { fotos: 0, descripcion: 0, video: 0, tour: 0, geo: 0, direccion: 0 };
    detailed.forEach((d) => Object.keys(acc).forEach((k) => { acc[k] += d.parts[k]; }));
    completenessParts = {};
    Object.keys(acc).forEach((k) => { completenessParts[k] = Math.round(acc[k] / detailed.length); });
  }

  // ── Resumen de recompensas (lee documentos cacheados + cálculos read-only) ──
  const [tierDoc, loyaltyDoc, badge, qRev, capQ] = await Promise.all([
    SellerTierHistory.findOne({ agenteId, year }).lean().catch(() => null),
    CustomerLoyalty.findOne({ agenteId, year }).lean().catch(() => null),
    BadgeRecord.findOne({ agenteId, badgeType: 'pre_listing' }).sort({ createdAt: -1 }).lean().catch(() => null),
    rewardsEngine.getRevenueStats(agenteId, qb.start, qb.end).catch(() => ({ total: 0 })),
    rewardsEngine.getCaptureStats(agenteId, qb.start, qb.end, cfg).catch(() => ({ count: 0 })),
  ]);
  const preListingActive = badge ? badge.status === 'active' : false;
  const seniority = loyaltyDoc ? loyaltyDoc.seniority : 'none';

  const rewards = {
    tier: tierDoc ? tierDoc.tier : 'base',
    medal: tierDoc ? tierDoc.medal : 'none',
    annualRevenue: tierDoc ? tierDoc.totalRevenue : 0,
    quarterlyRevenue: qRev.total || 0,
    quarterlyCaptures: capQ.count || 0,
    seniority,
    loyalCount: loyaltyDoc ? loyaltyDoc.totalCount : 0,
    preListingActive,
    prize: tierDoc ? tierDoc.prize : '',
  };

  const eng = engagement || { logins: 0, activeDays: 0, activeHours: 0, activeMinutes: 0, streak: 0, lastSeenAt: null };

  const { score, breakdown } = scoreSvc.computeScore({
    capturesQuarterly: capQ.count || 0,
    captureTargetQuarterly: cfg.captureGoals.quarterlyTarget,
    revenueQuarterly: qRev.total || 0,
    revenueTargetQuarterly: cfg.revenueGoals.quarterlyTarget,
    citasMes,
    clientesMes,
    interaccionesMes: (metricas && (metricas.interactionsMes || metricas.actividadesMes)) || 0,
    formCompleteness,
    engagement: eng,
    tasaConversion: (metricas && metricas.tasaConversion) || 0,
    diasPromCierre: (metricas && metricas.diasPromCierre) || 0,
    seniority,
    preListingActive,
  }, cfg);

  return {
    citas: citasTotal,
    citasMes,
    clientesMes,
    formCompleteness,
    completenessParts,
    rewards,
    engagement: eng,
    score,
    scoreBreakdown: breakdown,
  };
}

const CLOSED_OPERATION_STATES = ['cerrada', 'completada', 'vendida', 'alquilada', 'finalizada'];

function numberOrZero(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

function isClosedOperation(operacion) {
  return CLOSED_OPERATION_STATES.includes(String(operacion?.estado || '').trim().toLowerCase());
}

function getOperationCommission(operacion) {
  const explicit = numberOrZero(operacion?.comisionMonto);
  if (explicit > 0) return explicit;
  const monto = numberOrZero(operacion?.monto);
  const pct = numberOrZero(operacion?.comisionPorcentaje);
  return pct > 0 ? (monto * pct) / 100 : 0;
}

function getOperationMetricDate(operacion) {
  return operacion?.comisionFechaCobro
    || operacion?.fechaCierre
    || operacion?.updatedAt
    || operacion?.createdAt;
}



async function generateUniqueUsername() {

  for (let i = 0; i < 10; i += 1) {

    const username = `agent_${crypto.randomBytes(4).toString('hex')}`;

    // eslint-disable-next-line no-await-in-loop

    const existing = await User.findOne({ username }).lean();

    if (!existing) return username;

  }

  throw new Error('failed to generate unique username');

}



router.get('/admins', authenticateToken, requireCRMUser, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('_id nombre email username cargo')
      .sort({ nombre: 1 })
      .lean();
    res.json(admins.map((a) => ({
      _id: a._id,
      nombre: a.nombre || a.username || '',
      email: a.email || '',
      cargo: a.cargo || 'Administrador',
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/for-assignment', authenticateToken, requireCRMUser, async (req, res) => {
  try {
    const agentes = await Agente.find({}).select('_id nombre email cargo avatar').sort({ nombre: 1 }).lean();
    const admins = await User.find({ role: 'admin' }).select('_id nombre username email cargo avatar').sort({ nombre: 1 }).lean();

    const list = [
      ...agentes.map((a) => ({ _id: String(a._id), nombre: a.nombre || '', cargo: a.cargo || 'Agente', tipo: 'agente', avatar: a.avatar || '' })),
      ...admins.map((u) => ({ _id: String(u._id), nombre: u.nombre || u.username || '', cargo: u.cargo || 'Administrador', tipo: 'admin', avatar: u.avatar || '' })),
    ].filter((x) => x.nombre);

    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', authenticateTokenOrService, requireCRMUser, async (req, res) => {

  try {

    const { q } = req.query;

    const scopeId = agentScopeId(req);

    const filter = q ? { nombre: { $regex: q, $options: 'i' } } : {};

    if (scopeId) filter._id = scopeId;

    const items = await Agente.find(filter).sort({ updatedAt: -1 }).limit(1000).lean();

    res.json(items);

  } catch (err) { res.status(500).json({ error: err.message }); }

});



router.get('/:id', authenticateToken, requireCRMUser, async (req, res) => {

  try {

    const scopeId = agentScopeId(req);

    if (scopeId && scopeId !== String(req.params.id)) return res.status(403).json({ error: 'forbidden' });

    const item = await Agente.findById(req.params.id).lean();

    if (!item) return res.status(404).json({ error: 'Not found' });

    res.json(item);

  } catch (err) { res.status(500).json({ error: err.message }); }

});



router.post('/', authenticateTokenOrService, requireRole('admin'), async (req, res) => {

  try {

    const created = await Agente.create(req.body || {});

    res.status(201).json(created);

  } catch (err) { res.status(400).json({ error: err.message }); }

});



router.post('/create-with-user', authenticateTokenOrService, requireRole('admin'), async (req, res) => {

  try {

    const body = req.body || {};

    if (!body.nombre) return res.status(400).json({ error: 'nombre required' });



    const agente = await Agente.create({

      nombre: body.nombre,

      email: body.email || '',

      telefono: body.telefono || '',

      role: 'agent',

      metadata: body.metadata || {},

    });



    const username = body.username || await generateUniqueUsername();

    const password = body.password && String(body.password).trim() ? String(body.password) : crypto.randomBytes(9).toString('base64url');

    const hash = await bcrypt.hash(password, 10);



    const user = new User({

      username,

      password_hash: hash,

      role: 'agent',

      agenteId: agente._id,

    });



    await user.save();



    return res.status(201).json({

      agente,

      user: { id: user._id, username: user.username, role: user.role, agenteId: user.agenteId },

      password,

    });

  } catch (err) {

    if (err && err.code === 11000) return res.status(409).json({ error: 'username already exists' });

    return res.status(400).json({ error: err.message });

  }

});



router.put('/:id', authenticateTokenOrService, requireCRMUser, async (req, res) => {

  try {

    const scopeId = agentScopeId(req);

    if (scopeId && scopeId !== String(req.params.id)) return res.status(403).json({ error: 'forbidden' });

    const updated = await Agente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updated) return res.status(404).json({ error: 'Not found' });

    res.json(updated);

  } catch (err) { res.status(400).json({ error: err.message }); }

});



// Reset agent password (admin only)
router.post('/:id/reset-password', authenticateTokenOrService, requireRole('admin'), async (req, res) => {
  try {
    const agente = await Agente.findById(req.params.id).lean();
    if (!agente) return res.status(404).json({ error: 'Agente no encontrado' });

    const user = await User.findOne({ agenteId: agente._id });
    if (!user) return res.status(404).json({ error: 'No se encontró usuario vinculado a este agente' });

    const newPassword = req.body.password && String(req.body.password).trim().length >= 6
      ? String(req.body.password).trim()
      : crypto.randomBytes(9).toString('base64url');

    const hash = await bcrypt.hash(newPassword, 10);
    user.password_hash = hash;
    await user.save();

    return res.json({
      success: true,
      username: user.username,
      password: newPassword,
      agente: agente.nombre,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateTokenOrService, requireRole('admin'), async (req, res) => {

  try {

    const deleted = await Agente.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.json({ ok: true });

  } catch (err) { res.status(500).json({ error: err.message }); }

});



// Heartbeat: acumula tiempo activo del agente (uso de la app)
router.post('/heartbeat', authenticateToken, async (req, res) => {
  try {
    const agenteId = req.user && req.user.agenteId ? String(req.user.agenteId) : null;
    // Admins (sin agenteId) o usuarios públicos: no se registra, pero responde OK
    if (!agenteId) return res.json({ ok: true, tracked: false });
    const seconds = Number(req.body && req.body.seconds) || 60;
    await engagementService.recordHeartbeat(agenteId, req.user.sub, seconds);
    return res.json({ ok: true, tracked: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get all agents with performance metrics (admin only)

router.get('/metrics/all', authenticateTokenOrService, requireCRMUser, async (req, res) => {

  try {

    const Cliente = require('../models/Cliente');

    const Propiedad = require('../models/Propiedad');

    const Activity = require('../models/Activity');

    const mongoose = require('mongoose');



    const scopeId = agentScopeId(req);
    const agenteFilter = scopeId ? { _id: scopeId } : {};
    const agentes = await Agente.find(agenteFilter).lean();

    // Contexto compartido para la scorecard (config, trimestre actual, engagement)
    const cfg = await RewardConfig.load();
    const nowQ = new Date();
    const qb = rewardsEngine.quarterBounds(nowQ.getFullYear(), rewardsEngine.currentQuarter(nowQ));
    const monthStart = new Date(nowQ.getFullYear(), nowQ.getMonth(), 1, 0, 0, 0, 0);
    const engagementMap = await engagementService.getEngagementMap({ days: 90 }).catch(() => ({}));



    const agentesConMetricas = await Promise.all(agentes.map(async (agente) => {

      const agenteId = String(agente._id);

      

      // Count clients assigned to this agent

      const clientesCount = await Cliente.countDocuments({ agenteId }).catch(() => 0);

      

      // Count properties assigned to this agent

      const propiedadesCount = await Propiedad.countDocuments({ agentId: agenteId }).catch(() => 0);

      // Real sales, commission & portfolio metrics from Operacion + Propiedad
      const propiedadesAsignadas = await Propiedad.find({ agentId: agenteId }).select('price status').lean().catch(() => []);
      const valorCartera = Math.round(propiedadesAsignadas.reduce((s, p) => s + Number(p.price || 0), 0));
      const propiedadesVendidas = propiedadesAsignadas.filter((p) => p.status === 'Vendida').length;
      const ops = await Operacion.find({ agenteId: agenteId }).lean().catch(() => []);
      const opsClosed = ops.filter(isClosedOperation);
      const ventas = opsClosed.filter((o) => o.tipo === 'Venta').length;
      const alquileres = opsClosed.filter((o) => o.tipo === 'Alquiler').length;
      const comisiones = Math.round(opsClosed.reduce((s, o) => s + getOperationCommission(o), 0));
      const clientesCerrados = await Cliente.countDocuments({ agenteId, 'metadata.estado': 'Cerrado' }).catch(() => 0);
      const tasaConversion = clientesCount > 0 ? Math.round((clientesCerrados / clientesCount) * 100) : 0;
      const diasPromCierre = opsClosed.length > 0
        ? Math.round(opsClosed.reduce((s, o) => {
            const c = new Date(o.createdAt);
            const u = o.fechaCierre ? new Date(o.fechaCierre) : (o.updatedAt ? new Date(o.updatedAt) : new Date());
            return s + Math.max(0, (u - c) / 86400000);
          }, 0) / opsClosed.length)
        : 0;
      const ventasMensual = [];
      for (let i = 5; i >= 0; i -= 1) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const ms = new Date(d.getFullYear(), d.getMonth(), 1);
        const me = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        ventasMensual.push(opsClosed.filter((o) => {
          const metricDate = new Date(getOperationMetricDate(o));
          return o.tipo === 'Venta' && metricDate >= ms && metricDate <= me;
        }).length);
      }

      

      // Count activities (visits, calls, etc.)

      const actividadesCount = await Activity.countDocuments({ agenteId }).catch(() => 0);

      

      // Get activities this month

      const inicioMes = new Date();

      inicioMes.setDate(1);

      inicioMes.setHours(0, 0, 0, 0);

      

      const actividadesMes = await Activity.countDocuments({

        agenteId,

        createdAt: { $gte: inicioMes }

      }).catch(() => 0);

      

      // Get different activity types count

      const actividadesPorTipo = await Activity.aggregate([

        { $match: { agenteId: String(agenteId) } },

        { $group: { _id: '$type', count: { $sum: 1 } } }

      ]).catch(() => []);

      

      // Calculate engagement metrics

      const sumTypes = (...keys) => actividadesPorTipo.filter(a => keys.includes(a._id)).reduce((s, a) => s + a.count, 0);
      const visitas = sumTypes('visita', 'visit', 'visit_scheduled', 'visit_done');

      const llamadas = sumTypes('llamada', 'call', 'phone');

      const emails = sumTypes('email', 'enquiry', 'mail');

      // ClientInteraction metrics
      const ClientInteraction = require('../models/ClientInteraction');
      const totalInteractions = await ClientInteraction.countDocuments({ agenteId: String(agenteId) }).catch(() => 0);
      const interactionsMes = await ClientInteraction.countDocuments({ agenteId: String(agenteId), createdAt: { $gte: inicioMes } }).catch(() => 0);
      const interactionsByType = await ClientInteraction.aggregate([
        { $match: { agenteId: String(agenteId) } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]).catch(() => []);
      const interactionTypes = {};
      interactionsByType.forEach(r => { interactionTypes[r._id] = r.count; });

      // Generate a consistent color based on agent name

      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

      const colorIndex = agente.nombre ? agente.nombre.charCodeAt(0) % colors.length : 0;



      const latestMetrics = await AgentMetrics.findOne({ agenteId: agente._id }).sort({ periodStart: -1 }).lean().catch(() => null);

      const avgRating = Number(latestMetrics?.avgRating || 0);

      const rating = Number(avgRating.toFixed(1));

      const satisfaccion = Math.round(avgRating * 20);

      

      const metricas = {

          clientes: clientesCount,

          propiedades: propiedadesCount,

          actividades: actividadesCount,

          actividadesMes,

          visitas,

          llamadas,

          emails,

          rating,

          satisfaccion,

          totalInteractions,
          interactionsMes,
          interactionTypes,
          ventas,
          alquileres,
          comisiones,
          valorCartera,
          propiedadesVendidas,
          tasaConversion,
          diasPromCierre,
          ventasMensual,
          metaMensual: Number(agente.metadata?.metaMensual || 0),

      };

      // Scorecard: citas, completitud de carga, recompensas, engagement y score
      const scorecard = await buildAgentScorecard(agente, {
        cfg, qb, monthStart, engagement: engagementMap[agenteId], metricas,
      }).catch((e) => { console.error('[scorecard] all:', e.message); return null; });

      if (scorecard) {
        metricas.citas = scorecard.citas;
        metricas.citasMes = scorecard.citasMes;
        metricas.clientesMes = scorecard.clientesMes;
        metricas.formCompleteness = scorecard.formCompleteness;
        metricas.score = scorecard.score;
      }

      return {

        ...agente,

        metricas,

        engagement: scorecard ? scorecard.engagement : null,
        formCompleteness: scorecard ? scorecard.formCompleteness : 0,
        completenessParts: scorecard ? scorecard.completenessParts : null,
        rewards: scorecard ? scorecard.rewards : null,
        score: scorecard ? scorecard.score : 0,
        scoreBreakdown: scorecard ? scorecard.scoreBreakdown : null,

        color: agente.metadata?.color || colors[colorIndex],

      };

    }));

    

    res.json(agentesConMetricas);

  } catch (err) {

    console.error('Error fetching agent metrics:', err);

    res.status(500).json({ error: err.message });

  }

});



// Get single agent with detailed metrics

router.get('/metrics/:id', authenticateToken, requireCRMUser, async (req, res) => {

  try {

    const Cliente = require('../models/Cliente');

    const Propiedad = require('../models/Propiedad');

    const Activity = require('../models/Activity');

    const mongoose = require('mongoose');



    const scopeId = agentScopeId(req);

    if (scopeId && scopeId !== String(req.params.id)) return res.status(403).json({ error: 'forbidden' });

    

    const agente = await Agente.findById(req.params.id).lean();

    if (!agente) return res.status(404).json({ error: 'Not found' });

    

    const agenteId = String(agente._id);

    

    // Get detailed metrics

    const clientes = await Cliente.find({ agenteId }).select('nombre email estado metadata createdAt').lean().catch(() => []);

    const propiedades = await Propiedad.find({ agentId: agenteId }).select('title tipo operacion price status').lean().catch(() => []);

    // Real sales & commission metrics from Operacion
    const ops = await Operacion.find({ agenteId }).lean().catch(() => []);
    const opsClosed = ops.filter(isClosedOperation);
    const ventas = opsClosed.filter((o) => o.tipo === 'Venta').length;
    const alquileres = opsClosed.filter((o) => o.tipo === 'Alquiler').length;
    const comisiones = Math.round(opsClosed.reduce((s, o) => s + getOperationCommission(o), 0));
    const valorCartera = Math.round(propiedades.reduce((s, p) => s + Number(p.price || 0), 0));
    const propiedadesVendidas = propiedades.filter((p) => p.status === 'Vendida').length;
    const clientesCerrados = clientes.filter((c) => (c.metadata?.estado) === 'Cerrado').length;
    const tasaConversion = clientes.length > 0 ? Math.round((clientesCerrados / clientes.length) * 100) : 0;
    const diasPromCierre = opsClosed.length > 0
      ? Math.round(opsClosed.reduce((s, o) => {
          const c = new Date(o.createdAt);
          const u = o.fechaCierre ? new Date(o.fechaCierre) : (o.updatedAt ? new Date(o.updatedAt) : new Date());
          return s + Math.max(0, (u - c) / 86400000);
        }, 0) / opsClosed.length)
      : 0;
    const ventasMensual = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const ms = new Date(d.getFullYear(), d.getMonth(), 1);
      const me = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      ventasMensual.push({
        mes: ms.toLocaleDateString('es-AR', { month: 'short' }),
        ventas: opsClosed.filter((o) => {
          const metricDate = new Date(getOperationMetricDate(o));
          return o.tipo === 'Venta' && metricDate >= ms && metricDate <= me;
        }).length,
      });
    }

    const actividades = await Activity.find({ agenteId }).sort({ createdAt: -1 }).limit(50).lean().catch(() => []);

    

    // Monthly activity trend (last 6 months)

    const actividadMensual = [];

    for (let i = 5; i >= 0; i--) {

      const fecha = new Date();

      fecha.setMonth(fecha.getMonth() - i);

      const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);

      const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59);

      

      const count = await Activity.countDocuments({

        agenteId: String(agenteId),

        createdAt: { $gte: inicioMes, $lte: finMes }

      }).catch(() => 0);

      

      actividadMensual.push({

        mes: inicioMes.toLocaleDateString('es-AR', { month: 'short' }),

        actividades: count

      });

    }

    

    // Activity breakdown by type

    const actividadesPorTipo = await Activity.aggregate([

      { $match: { agenteId: String(agenteId) } },

      { $group: { _id: '$type', count: { $sum: 1 } } }

    ]).catch(() => []);

    

    // Generate color

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

    const colorIndex = agente.nombre ? agente.nombre.charCodeAt(0) % colors.length : 0;



    const latestMetrics = await AgentMetrics.findOne({ agenteId: agente._id }).sort({ periodStart: -1 }).lean().catch(() => null);

    const avgRating = Number(latestMetrics?.avgRating || 0);

    const rating = Number(avgRating.toFixed(1));

    const satisfaccion = Math.round(avgRating * 20);

    // ── Scorecard del agente (citas, completitud, recompensas, engagement, score) ──
    const cfg = await RewardConfig.load();
    const nowQ = new Date();
    const qb = rewardsEngine.quarterBounds(nowQ.getFullYear(), rewardsEngine.currentQuarter(nowQ));
    const monthStart = new Date(nowQ.getFullYear(), nowQ.getMonth(), 1, 0, 0, 0, 0);
    const ClientInteraction = require('../models/ClientInteraction');
    const interactionsMes = await ClientInteraction.countDocuments({ agenteId, createdAt: { $gte: monthStart } }).catch(() => 0);
    const engagement = await engagementService.getEngagementSummary(agenteId, { days: 90 }).catch(() => null);
    const scorecard = await buildAgentScorecard(agente, {
      cfg, qb, monthStart, engagement,
      metricas: { tasaConversion, diasPromCierre, interactionsMes },
    }).catch((e) => { console.error('[scorecard] id:', e.message); return null; });

    res.json({

      ...agente,

      color: agente.metadata?.color || colors[colorIndex],

      metricas: {

        clientes: clientes.length,

        propiedades: propiedades.length,

        actividades: actividades.length,

        rating,

        satisfaccion,
        ventas,
        alquileres,
        comisiones,
        valorCartera,
        propiedadesVendidas,
        tasaConversion,
        diasPromCierre,
        metaMensual: Number(agente.metadata?.metaMensual || 0),
        citas: scorecard ? scorecard.citas : 0,
        citasMes: scorecard ? scorecard.citasMes : 0,
        clientesMes: scorecard ? scorecard.clientesMes : 0,
        formCompleteness: scorecard ? scorecard.formCompleteness : 0,
        score: scorecard ? scorecard.score : 0,

      },

      engagement: scorecard ? scorecard.engagement : engagement,
      formCompleteness: scorecard ? scorecard.formCompleteness : 0,
      completenessParts: scorecard ? scorecard.completenessParts : null,
      rewards: scorecard ? scorecard.rewards : null,
      score: scorecard ? scorecard.score : 0,
      scoreBreakdown: scorecard ? scorecard.scoreBreakdown : null,

      detalle: {

        clientes,

        propiedades,

        actividadesRecientes: actividades.slice(0, 10),

        actividadMensual,

        actividadesPorTipo,

        ventasMensual,

      }

    });

  } catch (err) {

    console.error('Error fetching agent metrics:', err);

    res.status(500).json({ error: err.message });

  }

});



module.exports = router;
