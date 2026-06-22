/**
 * engagementService.js – Registro y consulta del uso de la plataforma por agente.
 *
 * Captura dos señales:
 *   1) Logins   – contados en /auth/login (recordLogin)
 *   2) Tiempo activo – acumulado vía heartbeat liviano del frontend (recordHeartbeat)
 *
 * Todo se agrega en buckets diarios (AgentEngagement) para poder calcular
 * días activos, racha (streak), minutos/horas activas y frecuencia de uso.
 */
const AgentEngagement = require('../models/AgentEngagement');

const MAX_HEARTBEAT_SECONDS = 180; // tope por ping para evitar inflar el tiempo

function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftDays(date, delta) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

/**
 * Racha de días activos consecutivos terminando hoy (con tolerancia: si hoy
 * todavía no hubo actividad, arranca desde ayer).
 */
function computeStreak(daySet) {
  let cursor = new Date();
  if (!daySet.has(dayKey(cursor))) cursor = shiftDays(cursor, -1);
  let streak = 0;
  while (daySet.has(dayKey(cursor))) {
    streak += 1;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

/** Registra un login del agente (no-op para usuarios sin agenteId, p.ej. admins). */
async function recordLogin(user) {
  try {
    if (!user || !user.agenteId) return null;
    const now = new Date();
    return await AgentEngagement.findOneAndUpdate(
      { agenteId: user.agenteId, date: dayKey(now) },
      {
        $inc: { loginCount: 1 },
        $set: { lastSeenAt: now },
        $setOnInsert: { userId: user._id, firstSeenAt: now },
      },
      { upsert: true, new: true },
    );
  } catch (err) {
    // El tracking nunca debe romper el login
    console.error('[engagement] recordLogin error:', err.message);
    return null;
  }
}

/** Acumula tiempo activo (segundos) para el día en curso. */
async function recordHeartbeat(agenteId, userId, seconds = 60) {
  if (!agenteId) return null;
  const capped = Math.min(Math.max(0, Math.round(Number(seconds) || 0)), MAX_HEARTBEAT_SECONDS);
  const now = new Date();
  try {
    return await AgentEngagement.findOneAndUpdate(
      { agenteId, date: dayKey(now) },
      {
        $inc: { activeSeconds: capped },
        $set: { lastSeenAt: now },
        $setOnInsert: { userId: userId || undefined, firstSeenAt: now },
      },
      { upsert: true, new: true },
    );
  } catch (err) {
    console.error('[engagement] recordHeartbeat error:', err.message);
    return null;
  }
}

function summarizeRows(rows) {
  const summary = {
    logins: 0,
    activeSeconds: 0,
    activeMinutes: 0,
    activeHours: 0,
    activeDays: 0,
    streak: 0,
    lastSeenAt: null,
  };
  const daySet = new Set();
  for (const r of rows) {
    summary.logins += r.loginCount || 0;
    summary.activeSeconds += r.activeSeconds || 0;
    if ((r.loginCount || 0) > 0 || (r.activeSeconds || 0) > 0) daySet.add(r.date);
    if (r.lastSeenAt && (!summary.lastSeenAt || new Date(r.lastSeenAt) > new Date(summary.lastSeenAt))) {
      summary.lastSeenAt = r.lastSeenAt;
    }
  }
  summary.activeDays = daySet.size;
  summary.activeMinutes = Math.round(summary.activeSeconds / 60);
  summary.activeHours = Math.round((summary.activeSeconds / 3600) * 10) / 10;
  summary.streak = computeStreak(daySet);
  return summary;
}

/** Resumen de engagement de un agente en los últimos `days` días. */
async function getEngagementSummary(agenteId, opts = {}) {
  const days = opts.days || 90;
  const sinceKey = dayKey(shiftDays(new Date(), -days));
  const rows = await AgentEngagement.find({ agenteId, date: { $gte: sinceKey } }).lean();
  return summarizeRows(rows);
}

/** Mapa { agenteId -> resumen } para todos los agentes (una sola consulta). */
async function getEngagementMap(opts = {}) {
  const days = opts.days || 90;
  const sinceKey = dayKey(shiftDays(new Date(), -days));
  const rows = await AgentEngagement.find({ date: { $gte: sinceKey } }).lean();
  const byAgent = {};
  for (const r of rows) {
    const id = String(r.agenteId);
    if (!byAgent[id]) byAgent[id] = [];
    byAgent[id].push(r);
  }
  const map = {};
  for (const id of Object.keys(byAgent)) {
    map[id] = summarizeRows(byAgent[id]);
  }
  return map;
}

module.exports = {
  dayKey,
  recordLogin,
  recordHeartbeat,
  getEngagementSummary,
  getEngagementMap,
};
