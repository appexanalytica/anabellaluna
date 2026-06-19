/**
 * rewardsEngine.js – Core calculation service for Rewards V2.
 *
 * Pure business-logic functions. No Express dependency.
 * Every calculation returns evidence (IDs, counts, dates) for auditability.
 *
 * Sections:
 *   A) Capture goals   – exclusive properties >= 90 days
 *   B) Revenue goals   – billed commissions per quarter/year
 *   C) Client loyalty  – closed & loyal clients per agent
 *   D) Pre-Listing     – weekly badge check
 *   E) Seller tiers    – annual category by revenue
 *   F) Quarterly awards – top 1 & top 2 per quarter
 */
const mongoose = require('mongoose');
const Propiedad = require('../models/Propiedad');
const Operacion = require('../models/Operacion');
const Cliente = require('../models/Cliente');
const Agente = require('../models/Agente');
const PreListing = require('../models/PreListing');
const BadgeRecord = require('../models/BadgeRecord');
const SellerTierHistory = require('../models/SellerTierHistory');
const QuarterlyAward = require('../models/QuarterlyAward');
const CustomerLoyalty = require('../models/CustomerLoyalty');
const RewardConfig = require('../models/RewardConfig');

// ============================================================
// HELPERS
// ============================================================

function quarterBounds(year, quarter) {
  const startMonth = (quarter - 1) * 3;
  const start = new Date(year, startMonth, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(year, startMonth + 3, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function yearBounds(year) {
  const start = new Date(year, 0, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(year, 11, 31);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function monthBounds(year, month) {
  const start = new Date(year, month, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(year, month + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function weekBounds(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function currentQuarter(date = new Date()) {
  return Math.ceil((date.getMonth() + 1) / 3);
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ''));
}

function toDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function inRange(date, dateStart, dateEnd) {
  if (!date) return false;
  if (dateStart && date < dateStart) return false;
  if (dateEnd && date > dateEnd) return false;
  return true;
}

function isClosedState(estado) {
  return CLOSED_STATES.includes(String(estado || '').trim().toLowerCase());
}

function numberOrZero(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

function getOperationCommission(op) {
  const explicit = numberOrZero(op?.comisionMonto);
  if (explicit > 0) return explicit;
  const amount = numberOrZero(op?.monto);
  const pct = numberOrZero(op?.comisionPorcentaje);
  return pct > 0 ? (amount * pct) / 100 : 0;
}

function getOperationRewardDate(op) {
  return toDate(op?.comisionFechaCobro)
    || toDate(op?.fechaCierre)
    || toDate(op?.updatedAt)
    || toDate(op?.createdAt);
}

function getPropertyCaptureDate(prop) {
  return toDate(prop?.fechaCaptacion)
    || toDate(prop?.metadata?.fechaCaptacion)
    || toDate(prop?.createdAt);
}

function getPropertyExclusivityDays(prop, captureDate = null) {
  const explicit = numberOrZero(prop?.exclusividadDias || prop?.metadata?.exclusividadDias || prop?.metadata?.diasExclusividad);
  if (explicit > 0) return explicit;
  const start = captureDate || getPropertyCaptureDate(prop);
  if (!start) return 0;
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
}

function isExclusiveProperty(prop) {
  if (prop?.exclusiva === true) return true;
  if (prop?.metadata?.exclusiva === true || prop?.metadata?.exclusividad === true) return true;
  const contract = String(prop?.metadata?.tipoContrato || prop?.metadata?.contrato || '').toLowerCase();
  if (contract.includes('exclus')) return true;
  const hasExplicitExclusivitySignal = prop?.exclusiva !== undefined
    || prop?.metadata?.exclusiva !== undefined
    || prop?.metadata?.exclusividad !== undefined
    || Boolean(contract);
  // Legacy properties were assigned to agents before exclusivity fields existed.
  // Treat assigned legacy properties as captures so the rewards dashboard reflects DB data.
  return !hasExplicitExclusivitySignal && Boolean(prop?.agentId);
}

// ============================================================
// A) CAPTURE GOALS
// ============================================================

/**
 * Count valid captures (exclusive >= minDays) for an agent in a date range.
 * Returns { count, properties[] } for auditability.
 */
async function getCaptureStats(agenteId, dateStart, dateEnd, cfg) {
  const minDays = cfg.captureGoals.minExclusivityDays;
  const props = await Propiedad.find({ agentId: String(agenteId) })
    .select('_id title fechaCaptacion exclusividadDias exclusiva metadata createdAt')
    .lean();

  const valid = props
    .map((prop) => {
      const captureDate = getPropertyCaptureDate(prop);
      const exclusivityDays = getPropertyExclusivityDays(prop, captureDate);
      return {
        ...prop,
        fechaCaptacion: captureDate,
        exclusividadDias: exclusivityDays,
        exclusiveForRewards: isExclusiveProperty(prop),
      };
    })
    .filter((prop) => prop.exclusiveForRewards)
    .filter((prop) => prop.exclusividadDias >= minDays)
    .filter((prop) => inRange(prop.fechaCaptacion, dateStart, dateEnd));

  return { count: valid.length, properties: valid };
}

async function getAgentCaptureGoals(agenteId, year, cfg) {
  const now = new Date();
  const q = currentQuarter(now);
  const yb = yearBounds(year);
  const qb = quarterBounds(year, q);
  const mb = monthBounds(now.getFullYear(), now.getMonth());

  const [annual, quarterly, monthly] = await Promise.all([
    getCaptureStats(agenteId, yb.start, yb.end, cfg),
    getCaptureStats(agenteId, qb.start, qb.end, cfg),
    getCaptureStats(agenteId, mb.start, mb.end, cfg),
  ]);

  return {
    monthly: { count: monthly.count, target: cfg.captureGoals.monthlyTarget, properties: monthly.properties },
    quarterly: { count: quarterly.count, target: cfg.captureGoals.quarterlyTarget, properties: quarterly.properties },
    annual: { count: annual.count, target: cfg.captureGoals.annualTarget, properties: annual.properties },
  };
}

// ============================================================
// B) REVENUE GOALS
// ============================================================

const CLOSED_STATES = ['cerrada', 'completada', 'vendida', 'alquilada', 'finalizada'];

/**
 * Sum commissions for closed operations within a date range.
 * Uses explicit collection fields when present, and falls back to close/update dates
 * plus monto * comisionPorcentaje for legacy operations.
 */
async function getRevenueStats(agenteId, dateStart, dateEnd) {
  const ops = await Operacion.find({ agenteId: String(agenteId) })
    .select('_id monto comisionMonto comisionPorcentaje comisionCobrada comisionFechaCobro fechaCierre estado clienteId propiedadId createdAt updatedAt')
    .lean();

  const valid = ops
    .filter((op) => isClosedState(op.estado))
    .map((op) => ({
      ...op,
      rewardDate: getOperationRewardDate(op),
      rewardCommission: getOperationCommission(op),
    }))
    .filter((op) => op.rewardCommission > 0)
    .filter((op) => inRange(op.rewardDate, dateStart, dateEnd));

  const total = Math.round(valid.reduce((sum, op) => sum + op.rewardCommission, 0));
  return { total, count: valid.length, operaciones: valid };
}

async function getAgentRevenueGoals(agenteId, year, cfg) {
  const now = new Date();
  const q = currentQuarter(now);
  const yb = yearBounds(year);
  const qb = quarterBounds(year, q);

  const [annual, quarterly] = await Promise.all([
    getRevenueStats(agenteId, yb.start, yb.end),
    getRevenueStats(agenteId, qb.start, qb.end),
  ]);

  return {
    quarterly: { total: quarterly.total, target: cfg.revenueGoals.quarterlyTarget, operaciones: quarterly.operaciones },
    annual: { total: annual.total, target: cfg.revenueGoals.annualTarget, operaciones: annual.operaciones },
  };
}

// ============================================================
// C) CLIENT LOYALTY
// ============================================================

async function calculateClientLoyalty(agenteId, year, cfg) {
  const aid = String(agenteId);

  // Closed = clients with at least one completed operacion
  const closedOps = await Operacion.find({
    agenteId: aid,
    estado: { $in: CLOSED_STATES.concat(CLOSED_STATES.map(s => s.charAt(0).toUpperCase() + s.slice(1))) },
  }).select('clienteId').lean();
  const closedSet = new Set(closedOps.map(o => String(o.clienteId)).filter(Boolean));

  // Loyal = clients flagged as fidelizado in CRM
  const loyalClients = await Cliente.find({
    agenteId: aid,
    fidelizado: true,
  }).select('_id').lean();
  const loyalSet = new Set(loyalClients.map(c => String(c._id)));

  const unionSet = new Set([...closedSet, ...loyalSet]);
  const totalCount = unionSet.size;

  // Determine seniority
  let seniority = 'none';
  if (totalCount >= cfg.clientLoyalty.seniorMin) seniority = 'senior';
  else if (totalCount >= cfg.clientLoyalty.semiSeniorMin) seniority = 'semi_senior';
  else if (totalCount >= cfg.clientLoyalty.juniorMin) seniority = 'junior';

  const closedIds = [...closedSet].filter(isValidObjectId).map(id => new mongoose.Types.ObjectId(id));
  const loyalIds = [...loyalSet].filter(isValidObjectId).map(id => new mongoose.Types.ObjectId(id));

  const doc = await CustomerLoyalty.findOneAndUpdate(
    { agenteId, year },
    {
      closedClientIds: closedIds,
      loyalClientIds: loyalIds,
      closedCount: closedSet.size,
      loyalCount: loyalSet.size,
      totalCount,
      seniority,
      calculatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return doc.toObject();
}

// ============================================================
// D) PRE-LISTING BADGE
// ============================================================

async function checkPreListingBadge(agenteId, cfg) {
  const wb = weekBounds();
  const weeklyMin = cfg.preListing.weeklyMinimum;

  const count = await PreListing.countDocuments({
    agenteId,
    valido: true,
    fecha: { $gte: wb.start, $lte: wb.end },
  });

  const meetsRequirement = count >= weeklyMin;

  // Find latest badge record
  const latestBadge = await BadgeRecord.findOne({ agenteId, badgeType: 'pre_listing' })
    .sort({ createdAt: -1 }).lean();

  const wasActive = latestBadge && latestBadge.status === 'active';
  let newStatus = null;

  if (meetsRequirement && !wasActive) {
    newStatus = latestBadge ? 'reactivated' : 'earned';
  } else if (!meetsRequirement && wasActive) {
    newStatus = 'lost';
  }

  if (newStatus) {
    const record = {
      agenteId,
      badgeType: 'pre_listing',
      status: newStatus === 'earned' || newStatus === 'reactivated' ? 'active' : 'inactive',
      evidence: { weekStart: wb.start, weekEnd: wb.end, count, required: weeklyMin },
    };
    if (newStatus === 'earned') record.earnedAt = new Date();
    if (newStatus === 'reactivated') record.reactivatedAt = new Date();
    if (newStatus === 'lost') record.lostAt = new Date();

    await BadgeRecord.create(record);
  }

  return {
    active: meetsRequirement || (wasActive && newStatus !== 'lost'),
    weekCount: count,
    weeklyMin,
    history: await BadgeRecord.find({ agenteId, badgeType: 'pre_listing' }).sort({ createdAt: -1 }).limit(20).lean(),
  };
}

// ============================================================
// E) SELLER TIERS
// ============================================================

function resolveTier(annualRevenue, cfg) {
  const tiers = cfg.sellerTiers;
  if (annualRevenue >= tiers.club100.minRevenue) return { tier: 'club100', medal: 'Oro', prize: tiers.club100.prize };
  if (annualRevenue >= tiers.executive.minRevenue) return { tier: 'executive', medal: 'Plata', prize: '' };
  if (annualRevenue >= tiers.rookie.minRevenue) return { tier: 'rookie', medal: 'Bronce', prize: '' };
  return { tier: 'base', medal: 'none', prize: '' };
}

async function calculateSellerTier(agenteId, year, cfg) {
  const yb = yearBounds(year);
  const revenue = await getRevenueStats(agenteId, yb.start, yb.end);
  const { tier, medal, prize } = resolveTier(revenue.total, cfg);

  const doc = await SellerTierHistory.findOneAndUpdate(
    { agenteId, year },
    {
      tier,
      medal,
      totalRevenue: revenue.total,
      operacionIds: revenue.operaciones.map(o => o._id),
      prize,
      calculatedAt: new Date(),
    },
    { upsert: true, new: true }
  );
  return doc.toObject();
}

// ============================================================
// F) QUARTERLY AWARDS
// ============================================================

async function calculateQuarterlyAwards(year, quarter, cfg) {
  const qb = quarterBounds(year, quarter);
  const agentes = await Agente.find().select('_id nombre').lean();

  const rankings = [];
  for (const ag of agentes) {
    const rev = await getRevenueStats(ag._id, qb.start, qb.end);
    rankings.push({ agenteId: ag._id, nombre: ag.nombre, total: rev.total, operaciones: rev.operaciones });
  }

  rankings.sort((a, b) => b.total - a.total);

  const results = [];
  for (let i = 0; i < rankings.length; i++) {
    const r = rankings[i];
    let prize = '';
    if (r.total > 0 && i === 0) prize = cfg.revenueGoals.quarterlyPrizes.first;
    if (r.total > 0 && i === 1) prize = cfg.revenueGoals.quarterlyPrizes.second;

    const doc = await QuarterlyAward.findOneAndUpdate(
      { agenteId: r.agenteId, year, quarter },
      {
        ranking: i + 1,
        totalRevenue: r.total,
        prize,
        operacionIds: r.operaciones.map(o => o._id),
        calculatedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    results.push({ ...doc.toObject(), nombre: r.nombre });
  }
  return results;
}

// ============================================================
// FULL RECALCULATION (dry-run or persist)
// ============================================================

async function recalculateAll({ year, quarter, dryRun = false } = {}) {
  const now = new Date();
  const y = year || now.getFullYear();
  const q = quarter || currentQuarter(now);
  const cfg = await RewardConfig.load();
  const agentes = await Agente.find().select('_id nombre').lean();

  const report = { year: y, quarter: q, agents: [], quarterlyAwards: [] };

  for (const ag of agentes) {
    const captures = await getAgentCaptureGoals(ag._id, y, cfg);
    const revenue = await getAgentRevenueGoals(ag._id, y, cfg);
    const loyalty = await calculateClientLoyalty(ag._id, y, cfg);
    const badge = await checkPreListingBadge(ag._id, cfg);
    const tier = await calculateSellerTier(ag._id, y, cfg);

    report.agents.push({
      agente: { _id: ag._id, nombre: ag.nombre },
      captures,
      revenue,
      loyalty: { closedCount: loyalty.closedCount, loyalCount: loyalty.loyalCount, totalCount: loyalty.totalCount, seniority: loyalty.seniority },
      preListing: { active: badge.active, weekCount: badge.weekCount },
      tier: { tier: tier.tier, medal: tier.medal, totalRevenue: tier.totalRevenue, prize: tier.prize },
    });
  }

  report.quarterlyAwards = await calculateQuarterlyAwards(y, q, cfg);

  return report;
}

// ============================================================
// SINGLE AGENT DASHBOARD
// ============================================================

async function getAgentDashboard(agenteId) {
  const now = new Date();
  const year = now.getFullYear();
  const q = currentQuarter(now);
  const cfg = await RewardConfig.load();

  const [captures, revenue, loyalty, badge, tier, awards, tierHistory] = await Promise.all([
    getAgentCaptureGoals(agenteId, year, cfg),
    getAgentRevenueGoals(agenteId, year, cfg),
    calculateClientLoyalty(agenteId, year, cfg),
    checkPreListingBadge(agenteId, cfg),
    calculateSellerTier(agenteId, year, cfg),
    QuarterlyAward.find({ agenteId }).sort({ year: -1, quarter: -1 }).limit(8).lean(),
    SellerTierHistory.find({ agenteId }).sort({ year: -1 }).limit(5).lean(),
  ]);

  return {
    year,
    quarter: q,
    captures,
    revenue,
    loyalty: { closedCount: loyalty.closedCount, loyalCount: loyalty.loyalCount, totalCount: loyalty.totalCount, seniority: loyalty.seniority },
    preListing: badge,
    tier: { tier: tier.tier, medal: tier.medal, totalRevenue: tier.totalRevenue, prize: tier.prize },
    awards,
    tierHistory,
    config: {
      captureGoals: cfg.captureGoals,
      revenueGoals: { annualTarget: cfg.revenueGoals.annualTarget, quarterlyTarget: cfg.revenueGoals.quarterlyTarget },
      clientLoyalty: cfg.clientLoyalty,
      preListing: { weeklyMinimum: cfg.preListing.weeklyMinimum },
      sellerTiers: cfg.sellerTiers,
    },
  };
}

// ============================================================
// LEADERBOARD
// ============================================================

async function getLeaderboard(year, quarter) {
  const cfg = await RewardConfig.load();
  const qb = quarterBounds(year, quarter);
  const yb = yearBounds(year);
  const agentes = await Agente.find().select('_id nombre email avatar').lean();

  const board = [];
  for (const ag of agentes) {
    const qRev = await getRevenueStats(ag._id, qb.start, qb.end);
    const yRev = await getRevenueStats(ag._id, yb.start, yb.end);
    const capQ = await getCaptureStats(ag._id, qb.start, qb.end, cfg);
    const loyalty = await calculateClientLoyalty(ag._id, year, cfg);
    const tierDoc = await calculateSellerTier(ag._id, year, cfg);
    const latestBadge = await BadgeRecord.findOne({ agenteId: ag._id, badgeType: 'pre_listing' }).sort({ createdAt: -1 }).lean();

    board.push({
      agente: { _id: ag._id, nombre: ag.nombre, email: ag.email, avatar: ag.avatar },
      quarterlyRevenue: qRev.total,
      annualRevenue: yRev.total,
      quarterlyCaptures: capQ.count,
      loyalty: { closedCount: loyalty.closedCount, loyalCount: loyalty.loyalCount, totalCount: loyalty.totalCount, seniority: loyalty.seniority },
      tier: { tier: tierDoc.tier, medal: tierDoc.medal },
      preListingActive: latestBadge ? latestBadge.status === 'active' : false,
    });
  }

  board.sort((a, b) => b.quarterlyRevenue - a.quarterlyRevenue);
  return board;
}

module.exports = {
  getCaptureStats,
  getAgentCaptureGoals,
  getRevenueStats,
  getAgentRevenueGoals,
  calculateClientLoyalty,
  checkPreListingBadge,
  resolveTier,
  calculateSellerTier,
  calculateQuarterlyAwards,
  recalculateAll,
  getAgentDashboard,
  getLeaderboard,
  quarterBounds,
  yearBounds,
  monthBounds,
  weekBounds,
  currentQuarter,
};
