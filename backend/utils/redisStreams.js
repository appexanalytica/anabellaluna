/**
 * Redis Streams — publisher de eventos de negocio.
 *
 * Permite que el AI Gateway Python consuma eventos en tiempo real.
 * Si Redis no está disponible, los eventos se loguean localmente
 * sin interrumpir la operación (degradación elegante).
 *
 * Stream: 'events:business'
 * Formato: CloudEvents-inspired
 */

const { randomUUID } = require('crypto');
const redis = require('../redis');

// ── Constantes ─────────────────────────────────────────────────────────────────

const STREAM_KEY = 'events:business';
const MAX_STREAM_LENGTH = 10000; // MAXLEN aproximado para evitar crecimiento infinito

// ── Publisher principal ────────────────────────────────────────────────────────

/**
 * Publica un evento tipado al Redis Stream.
 * Fire-and-forget — nunca bloquea el request actual.
 *
 * @param {string} eventType  Ej: 'client.created', 'property.updated'
 * @param {object} payload    Datos del evento (sin datos sensibles)
 * @param {object} [meta]     Metadata extra: correlation_id, user_id, agent_id
 */
async function publishEvent(eventType, payload, meta = {}) {
  const event = {
    event_id: randomUUID(),
    event_type: eventType,
    timestamp: new Date().toISOString(),
    service_origin: 'backend',
    correlation_id: meta.correlation_id || randomUUID(),
    user_id: meta.user_id || '',
    agent_id: meta.agent_id || '',
    payload: JSON.stringify(payload),
  };

  if (!redis.isAvailable()) {
    // Fallback: log local para no perder el evento silenciosamente
    console.log(`[Events] ${eventType} | no Redis — logged locally | ${JSON.stringify(payload).slice(0, 120)}`);
    return null;
  }

  try {
    const client = redis.getClient();
    const id = await client.xAdd(
      STREAM_KEY,
      '*',
      event,
      { MAXLEN: { strategy: '~', threshold: MAX_STREAM_LENGTH } }
    );
    return id;
  } catch (err) {
    // No interrumpir el request si el stream falla
    console.error(`[Events] Failed to publish ${eventType}:`, err.message);
    return null;
  }
}

/**
 * Versión async-safe para usar dentro de handlers sin await.
 * Garantiza que nunca rompe el flujo si Redis falla.
 */
function publishEventAsync(eventType, payload, meta = {}) {
  setImmediate(() => {
    publishEvent(eventType, payload, meta).catch(() => {});
  });
}

// ── Helpers para extraer metadata del request ──────────────────────────────────

/**
 * Extrae correlation_id, user_id y agent_id del objeto req de Express.
 */
function metaFromRequest(req) {
  return {
    correlation_id: req.correlationId || req.headers?.['x-correlation-id'] || randomUUID(),
    user_id: req.user?.sub || req.user?._id || req.user?.id || '',
    agent_id: req.user?.agenteId || '',
  };
}

// ── Catálogo de tipos de eventos (referencia) ──────────────────────────────────
//
// CRM:
//   client.created          client.updated           client.stage_changed
//   client.deleted          client.assigned
//
// Propiedades:
//   property.created        property.updated         property.published
//   property.unpublished    property.price_changed   property.deleted
//
// Operaciones:
//   deal.created            deal.updated             lead.converted
//   lead.lost               payment.completed        payment.failed
//
// Agenda:
//   visit.scheduled         visit.updated            visit.cancelled
//   visit.completed
//
// Tareas:
//   task.created            task.updated             task.completed
//   task.overdue            task.assigned
//
// Mensajería:
//   message.received        conversation.created
//   whatsapp.message_received   whatsapp.session_created
//
// ──────────────────────────────────────────────────────────────────────────────

module.exports = { publishEvent, publishEventAsync, metaFromRequest };
