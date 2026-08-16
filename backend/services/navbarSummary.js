/**
 * Fuente única de los contadores de la navbar (admin y agentes).
 *
 * Regla: la navbar sólo muestra eventos accionables sin leer, y cada evento
 * pertenece a un único grupo. Lo que ya cuenta en Consultas, Tareas o Citas
 * no vuelve a contar en Alertas.
 */

const Tarea = require('../models/Tarea');
const Cita = require('../models/Cita');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const ContactMessage = require('../models/ContactMessage');
const Propiedad = require('../models/Propiedad');

const ADMIN_AGENT_ID = '__admin__';

// Una tarea deja de ser accionable cuando se cierra. 'done' y 'Close' son
// valores legado; los reales son los de STATUSES en la pantalla de Tareas.
const ESTADOS_TAREA_CERRADA = ['completada', 'cancelada', 'done', 'Close'];

// El enum del modelo es 'Cancelada'; hubo queries históricas en minúscula.
const ESTADOS_CITA_CANCELADA = ['Cancelada', 'cancelada'];

// Tipos de consulta que llegan del sitio público.
const TIPOS_CONSULTA_WEB = ['enquiry', 'visit_scheduled'];

// Estos tipos ya tienen su propio badge (Consultas, Tareas, Citas), así que no
// suman en Alertas. 'reporte_diario' es un informe, no algo accionable.
const TIPOS_EXCLUIDOS_DE_ALERTAS = ['consulta_web', 'tarea', 'cita', 'reporte_diario'];

function limitesDelDia(now) {
  const inicio = new Date(now);
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date(now);
  fin.setHours(23, 59, 59, 999);
  return { inicio, fin };
}

/** Condición de tarea abierta, en un objeto combinable con $and. */
function tareaAbierta() {
  return {
    status: { $nin: ESTADOS_TAREA_CERRADA },
    kanbanColumn: { $nin: ESTADOS_TAREA_CERRADA },
    completed: { $ne: true },
  };
}

/** Condición de cita vigente (no cancelada). */
function citaVigente() {
  return { estado: { $nin: ESTADOS_CITA_CANCELADA } };
}

/**
 * Las notificaciones programadas a futuro todavía no son visibles.
 * Se devuelve dentro de $and para no pisar otros $or del filtro.
 */
function notificacionVisible(now) {
  return {
    $or: [
      { fechaProgramada: null },
      { fechaProgramada: { $exists: false } },
      { fechaProgramada: { $lte: now } },
    ],
  };
}

function conScope(scopeId, campo = 'agenteId') {
  return scopeId ? { [campo]: scopeId } : {};
}

/** Combina condiciones en un único filtro, descartando las vacías. */
function combinar(...condiciones) {
  const partes = condiciones.filter((c) => c && Object.keys(c).length > 0);
  if (partes.length === 0) return {};
  if (partes.length === 1) return partes[0];
  return { $and: partes };
}

/**
 * @param {object}  opts
 * @param {?string} opts.scopeId          Id del agente, o null para ver todo (admin).
 * @param {?string} opts.notifOwnerId     Dueño de las notificaciones ('__admin__' o el agenteId).
 * @param {boolean} opts.incluirContacto  Sumar el formulario de contacto del sitio (sólo admin).
 * @param {boolean} opts.incluirProximaCita Devolver la próxima cita para el chip de agentes.
 * @param {Date}    [opts.now]
 */
async function buildNavbarSummary({
  scopeId = null,
  notifOwnerId = null,
  incluirContacto = false,
  incluirProximaCita = false,
  now = new Date(),
} = {}) {
  const { inicio: hoyInicio, fin: hoyFin } = limitesDelDia(now);
  const en24Horas = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const scopeTarea = conScope(scopeId);
  const scopeCita = conScope(scopeId);
  const scopeActividad = conScope(scopeId);
  const scopePropiedad = conScope(scopeId, 'agentId');
  const scopeNotif = conScope(notifOwnerId);

  const [
    tareasVencidas,
    tareasHoy,
    citasHoy,
    citasProximas24h,
    consultasPropiedades,
    contactosNoLeidos,
    alertasNoLeidas,
    alertasUrgentes,
    propiedadesTotal,
    propiedadesDisponibles,
    proximaCitaDoc,
  ] = await Promise.all([
    // Tareas abiertas con vencimiento anterior a hoy
    Tarea.countDocuments(combinar(scopeTarea, tareaAbierta(), { dueDate: { $lt: hoyInicio } })),
    // Tareas abiertas que vencen hoy
    Tarea.countDocuments(combinar(scopeTarea, tareaAbierta(), { dueDate: { $gte: hoyInicio, $lte: hoyFin } })),
    // Citas vigentes de hoy que todavía no pasaron
    Cita.countDocuments(combinar(scopeCita, citaVigente(), { fecha: { $gte: now, $lte: hoyFin } })),
    // Citas vigentes en las próximas 24 h (incluye las de hoy)
    Cita.countDocuments(combinar(scopeCita, citaVigente(), { fecha: { $gte: now, $lte: en24Horas } })),
    // Consultas de propiedad y solicitudes de visita sin leer
    Activity.countDocuments(combinar(scopeActividad, {
      type: { $in: TIPOS_CONSULTA_WEB },
      'metadata.read': { $ne: true },
    })),
    // Formulario de contacto del sitio: no tiene agente asignado, es sólo del admin
    incluirContacto ? ContactMessage.countDocuments({ leido: { $ne: true } }) : Promise.resolve(0),
    // Alertas: lo que no tiene badge propio en otro lado
    Notification.countDocuments(combinar(scopeNotif, notificacionVisible(now), {
      leida: false,
      tipo: { $nin: TIPOS_EXCLUIDOS_DE_ALERTAS },
    })),
    Notification.countDocuments(combinar(scopeNotif, notificacionVisible(now), {
      leida: false,
      prioridad: 'urgente',
      tipo: { $nin: TIPOS_EXCLUIDOS_DE_ALERTAS },
    })),
    Propiedad.countDocuments(scopePropiedad),
    Propiedad.countDocuments({ ...scopePropiedad, status: 'Disponible' }),
    incluirProximaCita
      ? Cita.findOne(combinar(scopeCita, citaVigente(), { fecha: { $gte: now } }))
        .sort({ fecha: 1 })
        .select('_id titulo tipo fecha ubicacion')
        .lean()
      : Promise.resolve(null),
  ]);

  const consultasNoLeidas = consultasPropiedades + contactosNoLeidos;

  return {
    consultas: {
      noLeidas: consultasNoLeidas,
      propiedades: consultasPropiedades,
      contacto: contactosNoLeidos,
    },
    tareas: {
      vencidas: tareasVencidas,
      hoy: tareasHoy,
      total: tareasVencidas + tareasHoy,
    },
    citas: {
      hoy: citasHoy,
      proximas24h: citasProximas24h,
      total: citasProximas24h,
    },
    alertas: {
      noLeidas: alertasNoLeidas,
      urgentes: alertasUrgentes,
    },
    proximaCita: proximaCitaDoc
      ? {
        id: String(proximaCitaDoc._id),
        titulo: proximaCitaDoc.titulo || proximaCitaDoc.tipo || 'Cita',
        fecha: proximaCitaDoc.fecha,
        ubicacion: proximaCitaDoc.ubicacion || '',
      }
      : null,
    // Propiedades salió de la navbar; se deja el dato porque los paneles y el
    // dashboard lo consumen, pero sin badge.
    propiedades: {
      total: propiedadesTotal,
      disponibles: propiedadesDisponibles,
    },
    updatedAt: now.toISOString(),

    // ── Compatibilidad con el bundle anterior durante el deploy ──
    // Se puede borrar una release después de publicar la navbar nueva.
    mensajes: {
      consultasNoLeidas,
      contactosNoLeidos,
      propiedadesNoLeidas: consultasPropiedades,
      total: consultasNoLeidas,
    },
    notificaciones: { noLeidas: alertasNoLeidas },
  };
}

module.exports = {
  buildNavbarSummary,
  ADMIN_AGENT_ID,
  ESTADOS_TAREA_CERRADA,
  ESTADOS_CITA_CANCELADA,
  TIPOS_CONSULTA_WEB,
  TIPOS_EXCLUIDOS_DE_ALERTAS,
  tareaAbierta,
  citaVigente,
  notificacionVisible,
  limitesDelDia,
  combinar,
};
