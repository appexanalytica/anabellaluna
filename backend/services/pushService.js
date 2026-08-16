const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

// Configure VAPID
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@anabellaluna.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

/**
 * Send push notification to a specific user
 * @param {string} userId
 * @param {{ title: string, body: string, url?: string, icon?: string }} payload
 * @returns {Promise<{ sent: number, failed: number }>}
 */
async function sendNotification(userId, payload) {
  const subs = await PushSubscription.find({ userId });
  let sent = 0;
  let failed = 0;

  // `type`, `entityId` y `tag` los usa el service worker para agrupar y para
  // saber a dónde navegar al tocar la notificación.
  const notificationPayload = JSON.stringify({
    title: payload.title || 'Anabella Luna',
    body: payload.body || '',
    url: payload.url || '/',
    icon: payload.icon || '/icons/icon-192.png',
    type: payload.type || 'general',
    entityId: payload.entityId || null,
    tag: payload.tag || payload.type || 'anabella-erp',
  });

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        notificationPayload
      );
      sent++;
    } catch (err) {
      failed++;
      // Remove invalid subscriptions (410 Gone or 404)
      if (err.statusCode === 410 || err.statusCode === 404) {
        await PushSubscription.deleteOne({ _id: sub._id });
      }
    }
  }

  return { sent, failed };
}

/**
 * Send push notification to all users with a given role
 * @param {string} role - 'admin' | 'agent' | 'user'
 * @param {{ title: string, body: string, url?: string, icon?: string }} payload
 */
async function sendToRole(role, payload) {
  const subs = await PushSubscription.find({ role });
  const notificationPayload = JSON.stringify({
    title: payload.title || 'Anabella Luna',
    body: payload.body || '',
    url: payload.url || '/',
    icon: payload.icon || '/icons/icon-192.png',
  });

  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          notificationPayload
        );
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await PushSubscription.deleteOne({ _id: sub._id });
        }
        throw err;
      }
    })
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  return { sent, failed };
}

// ─────────────────────────────────────────────────────────────────────────────
// Puente entre las notificaciones del ERP y el push del navegador
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_AGENT_ID = '__admin__';

// Sólo se empuja lo que justifica interrumpir a alguien. El resto queda en la
// campana. 'reporte_diario' es informativo y nunca se envía.
const PRIORIDADES_PUSH = ['alta', 'urgente'];
const TIPOS_SIN_PUSH = ['reporte_diario'];

/**
 * Envía por push una notificación recién creada del ERP.
 *
 * Es best-effort: si no hay claves VAPID configuradas, si el destinatario no
 * tiene dispositivos suscriptos o si el envío falla, la notificación igual
 * queda guardada en la campana. Nunca lanza.
 *
 * @param {object} notificacion Documento de Notification ya creado.
 * @returns {Promise<{ sent: number, failed: number }>}
 */
async function notificarPush(notificacion) {
  const vacio = { sent: 0, failed: 0 };
  try {
    if (!notificacion) return vacio;
    if (!vapidPublicKey || !vapidPrivateKey) return vacio; // push no configurado
    if (TIPOS_SIN_PUSH.includes(notificacion.tipo)) return vacio;
    if (!PRIORIDADES_PUSH.includes(notificacion.prioridad)) return vacio;

    const esAdmin = String(notificacion.agenteId) === ADMIN_AGENT_ID;
    const accionUrl = notificacion.accionUrl || '/';

    const payload = {
      title: notificacion.titulo || 'Anabella Luna',
      body: notificacion.mensaje || '',
      type: notificacion.tipo || 'general',
      entityId: notificacion.entidadId || null,
      // Una notificación por hecho: el tag evita que se apilen repetidas.
      tag: `${notificacion.tipo}:${notificacion.entidadId || notificacion._id}`,
    };

    if (esAdmin) {
      // El panel de admin sirve las rutas en la raíz.
      return await sendToRole('admin', { ...payload, url: accionUrl });
    }

    // Los agentes viven bajo /crm en su propia app.
    const url = accionUrl.startsWith('/crm') ? accionUrl : `/crm${accionUrl}`;

    // Las suscripciones se guardan con el _id del User, mientras que las
    // notificaciones se indexan por agenteId: hay que traducir.
    const User = require('../models/User');
    const usuarios = await User.find({ agenteId: notificacion.agenteId }).select('_id').lean();
    if (!usuarios.length) return vacio;

    const resultados = await Promise.all(
      usuarios.map((u) => sendNotification(String(u._id), { ...payload, url }))
    );
    return resultados.reduce(
      (acc, r) => ({ sent: acc.sent + r.sent, failed: acc.failed + r.failed }),
      vacio
    );
  } catch (err) {
    console.error('[Push] Error enviando notificación del ERP:', err.message);
    return vacio;
  }
}

module.exports = { sendNotification, sendToRole, notificarPush };
