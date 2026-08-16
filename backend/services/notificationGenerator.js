/**
 * Generación de notificaciones a partir de hechos reales del negocio.
 *
 * Única implementación: antes vivía duplicada en `routes/adminNotifications.js`
 * y en `services/automationScheduler.js`, y las dos copias ya habían divergido
 * (distinto título, distinta `accionUrl`, distinto criterio de dedupe).
 *
 * Reglas:
 *  - Dedupe **permanente** por (agente, tipo, entidad). Un hecho notifica una vez.
 *    Los resúmenes que sí deben repetirse llevan la fecha en la clave de entidad.
 *  - Toda `accionUrl` tiene que existir en la tabla de rutas de la app que la abre.
 *    Admin navega tal cual; agentes le antepone `/crm`.
 */

const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const Operacion = require('../models/Operacion');
const Cliente = require('../models/Cliente');
const Propiedad = require('../models/Propiedad');
const Cita = require('../models/Cita');
const Tarea = require('../models/Tarea');
const Agente = require('../models/Agente');
const { ADMIN_AGENT_ID, tareaAbierta, citaVigente, combinar } = require('./navbarSummary');
const { notificarPush } = require('./pushService');

const HORAS_24 = 24 * 60 * 60 * 1000;
const HORAS_48 = 48 * 60 * 60 * 1000;
const DIAS_30 = 30 * 24 * 60 * 60 * 1000;

function inicioDelDia(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Clave de fecha (YYYY-MM-DD) para los resúmenes diarios. */
function claveDelDia(now = new Date()) {
  return inicioDelDia(now).toISOString().slice(0, 10);
}

/** ¿Ya existe una notificación para este hecho? Dedupe permanente. */
async function yaNotificado(agenteId, tipo, entidadId) {
  const filter = { agenteId, tipo };
  if (entidadId) filter.entidadId = String(entidadId);
  return Notification.exists(filter);
}

/**
 * Crea la notificación y dispara el push si amerita.
 * El push es best-effort: si falla o no hay claves VAPID, la notificación
 * igual queda guardada.
 */
async function crearNotificacion(data) {
  const creada = await Notification.create(data);
  notificarPush(creada).catch(() => {});
  return creada;
}

/**
 * Retira las notificaciones de un hecho que ya se resolvió.
 *
 * Una tarea completada o cancelada no tiene por qué seguir avisando: sin esto,
 * el aviso quedaba en la campana hasta que alguien borrara la tarea. Se borran
 * en vez de marcarse leídas para que, si la tarea se reabre, el generador
 * pueda volver a avisar (el dedupe es permanente por entidad).
 *
 * @param {string} tipo      Tipo de notificación ('tarea', 'cita', …).
 * @param {string} entidadId Id de la entidad resuelta.
 * @returns {Promise<number>} Cuántas se retiraron.
 */
async function retirarNotificaciones(tipo, entidadId) {
  if (!tipo || !entidadId) return 0;
  try {
    // Sin filtrar por agente: el mismo hecho pudo avisarle al agente y al admin.
    const res = await Notification.deleteMany({ tipo, entidadId: String(entidadId) });
    return res.deletedCount || 0;
  } catch (err) {
    console.error('[Notificaciones] Error retirando avisos de', tipo, entidadId, err.message);
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────────────────────

async function generateAdminNotifications({ now = new Date() } = {}) {
  const creadas = [];
  const todayStart = inicioDelDia(now);
  const hoyClave = claveDelDia(now);
  const nuevo = (tipo, entidadId) => yaNotificado(ADMIN_AGENT_ID, tipo, entidadId).then((e) => !e);

  // 1. Consultas del sitio sin leer (últimas 48 h)
  const consultas = await Activity.find({
    type: { $in: ['enquiry', 'visit_scheduled'] },
    'metadata.read': { $ne: true },
    createdAt: { $gte: new Date(now.getTime() - HORAS_48) },
  }).sort({ createdAt: -1 }).limit(10).lean();

  for (const inq of consultas) {
    if (!(await nuevo('consulta_web', inq._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: ADMIN_AGENT_ID,
      tipo: 'consulta_web',
      titulo: inq.type === 'visit_scheduled' ? 'Nueva solicitud de visita' : 'Nueva consulta web',
      mensaje: `${inq.metadata?.clientName || 'Visitante'} - ${inq.notes || inq.metadata?.propertyTitle || 'Sin detalle'}`,
      prioridad: 'alta',
      // El id es de una Activity: abrirlo como cliente no encuentra nada.
      entidadTipo: 'consulta',
      entidadId: String(inq._id),
      entidadNombre: inq.metadata?.clientName || '',
      accionUrl: `/consultas?id=${inq._id}&origen=activity`,
    }));
  }

  // 2. Operaciones nuevas (últimas 24 h)
  const operaciones = await Operacion.find({
    createdAt: { $gte: new Date(now.getTime() - HORAS_24) },
  }).sort({ createdAt: -1 }).limit(10).lean();

  for (const op of operaciones) {
    if (!(await nuevo('operacion_nueva', op._id))) continue;
    const agente = op.agenteId ? await Agente.findById(op.agenteId).lean() : null;
    creadas.push(await crearNotificacion({
      agenteId: ADMIN_AGENT_ID,
      tipo: 'operacion_nueva',
      titulo: `Nueva operación: ${op.tipo || 'Operación'}`,
      mensaje: `${op.titulo || op.propiedad || 'Sin título'} - ${agente?.nombre || 'Sin agente'} - $${(op.monto || 0).toLocaleString()}`,
      prioridad: 'alta',
      entidadTipo: 'operacion',
      entidadId: String(op._id),
      entidadNombre: op.titulo || op.propiedad || '',
      accionUrl: '/operaciones',
    }));
  }

  // 3. Contratos por vencer en los próximos 30 días
  const porVencer = await Cliente.find({
    'metadata.fechaVencimientoContrato': { $gte: now, $lte: new Date(now.getTime() + DIAS_30) },
  }).lean();

  for (const cli of porVencer) {
    if (!(await nuevo('contrato_vencimiento', cli._id))) continue;
    const fecha = new Date(cli.metadata.fechaVencimientoContrato);
    const dias = Math.ceil((fecha - now) / (24 * 60 * 60 * 1000));
    creadas.push(await crearNotificacion({
      agenteId: ADMIN_AGENT_ID,
      tipo: 'contrato_vencimiento',
      titulo: `Contrato por vencer en ${dias} días`,
      mensaje: `${cli.nombre || 'Cliente'} - Vence el ${fecha.toLocaleDateString('es-AR')}`,
      prioridad: dias <= 7 ? 'urgente' : dias <= 15 ? 'alta' : 'media',
      entidadTipo: 'cliente',
      entidadId: String(cli._id),
      entidadNombre: cli.nombre || '',
      accionUrl: `/clientes?id=${cli._id}`,
    }));
  }

  // 4. Propiedades que cambiaron de estado en las últimas 24 h
  const propiedades = await Propiedad.find({
    status: { $in: ['Reservada', 'Vendida', 'Alquilada'] },
    updatedAt: { $gte: new Date(now.getTime() - HORAS_24) },
  }).lean();

  for (const prop of propiedades) {
    if (!(await nuevo('propiedad_estado', prop._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: ADMIN_AGENT_ID,
      tipo: 'propiedad_estado',
      titulo: `Propiedad ${prop.status}`,
      mensaje: `${prop.title || 'Propiedad'} - ${prop.address || ''}`,
      prioridad: 'media',
      entidadTipo: 'propiedad',
      entidadId: String(prop._id),
      entidadNombre: prop.title || '',
      accionUrl: `/propiedades?id=${prop._id}`,
    }));
  }

  // 5. Tareas vencidas
  // El modelo usa `dueDate`; el viejo filtro por `fechaVencimiento` (campo
  // inexistente) hacía que esto no devolviera nunca nada.
  const vencidas = await Tarea.find(combinar(tareaAbierta(), { dueDate: { $lt: todayStart } }))
    .limit(5)
    .lean();

  for (const t of vencidas) {
    if (!(await nuevo('tarea', t._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: ADMIN_AGENT_ID,
      tipo: 'tarea',
      titulo: 'Tarea vencida',
      mensaje: `${t.title || 'Sin título'} - Venció el ${new Date(t.dueDate).toLocaleDateString('es-AR')}`,
      prioridad: 'alta',
      entidadTipo: 'tarea',
      entidadId: String(t._id),
      entidadNombre: t.title || '',
      accionUrl: '/citas',
    }));
  }

  // 6. Resumen de citas de hoy — una vez por día
  const citasHoy = await Cita.countDocuments(combinar(citaVigente(), {
    fecha: { $gte: todayStart, $lt: new Date(todayStart.getTime() + HORAS_24) },
  }));
  if (citasHoy > 0 && await nuevo('cita', `resumen_hoy:${hoyClave}`)) {
    creadas.push(await crearNotificacion({
      agenteId: ADMIN_AGENT_ID,
      tipo: 'cita',
      titulo: `${citasHoy} cita${citasHoy > 1 ? 's' : ''} programada${citasHoy > 1 ? 's' : ''} hoy`,
      mensaje: `Hay ${citasHoy} cita${citasHoy > 1 ? 's' : ''} agendada${citasHoy > 1 ? 's' : ''} para hoy`,
      prioridad: 'media',
      entidadTipo: 'cita',
      entidadId: `resumen_hoy:${hoyClave}`,
      accionUrl: '/citas',
    }));
  }

  // 7. Resumen del día — una vez por día, informativo (no cuenta en el badge)
  if (await nuevo('reporte_diario', `daily:${hoyClave}`)) {
    const [totalClientes, totalProps, totalOps, opsDelMes] = await Promise.all([
      Cliente.countDocuments({}),
      Propiedad.countDocuments({}),
      Operacion.countDocuments({}),
      Operacion.countDocuments({ createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } }),
    ]);
    creadas.push(await crearNotificacion({
      agenteId: ADMIN_AGENT_ID,
      tipo: 'reporte_diario',
      titulo: 'Resumen del día',
      mensaje: `Clientes: ${totalClientes} | Propiedades: ${totalProps} | Operaciones mes: ${opsDelMes} | Total ops: ${totalOps}`,
      prioridad: 'baja',
      entidadId: `daily:${hoyClave}`,
      accionUrl: '/',
    }));
  }

  return creadas;
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENTES
// ─────────────────────────────────────────────────────────────────────────────

async function generateAgentNotifications(scopeId, { now = new Date() } = {}) {
  if (!scopeId) return [];

  const creadas = [];
  const todayStart = inicioDelDia(now);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  const hoyClave = claveDelDia(now);
  const nuevo = (tipo, entidadId) => yaNotificado(scopeId, tipo, entidadId).then((e) => !e);
  const delAgente = { agenteId: scopeId };

  // 1. Citas de hoy — una vez por día
  const citasHoy = await Cita.find(combinar(delAgente, citaVigente(), {
    fecha: { $gte: todayStart, $lt: todayEnd },
  })).lean();

  if (citasHoy.length > 0 && await nuevo('cita', `resumen_hoy:${hoyClave}`)) {
    creadas.push(await crearNotificacion({
      agenteId: scopeId,
      tipo: 'cita',
      titulo: `${citasHoy.length} cita${citasHoy.length > 1 ? 's' : ''} hoy`,
      mensaje: citasHoy
        .map((c) => `${c.titulo || c.tipo || 'Cita'} - ${new Date(c.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`)
        .join(' | '),
      prioridad: 'alta',
      entidadTipo: 'cita',
      entidadId: `resumen_hoy:${hoyClave}`,
      accionUrl: '/citas',
    }));
  }

  // 2. Tareas vencidas
  // El $or anterior era siempre verdadero (status 'completada' !== 'Close'),
  // así que las tareas ya cerradas seguían avisando de vencimiento.
  const vencidas = await Tarea.find(combinar(delAgente, tareaAbierta(), { dueDate: { $lt: todayStart } }))
    .limit(5)
    .lean();

  for (const t of vencidas) {
    if (!(await nuevo('tarea', t._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: scopeId,
      tipo: 'tarea',
      titulo: 'Tarea vencida',
      mensaje: `${t.title || 'Sin título'} - Venció el ${new Date(t.dueDate).toLocaleDateString('es-AR')}`,
      prioridad: 'alta',
      entidadTipo: 'tarea',
      entidadId: String(t._id),
      entidadNombre: t.title || '',
      accionUrl: '/citas',
    }));
  }

  // 3. Tareas que vencen hoy
  const deHoy = await Tarea.find(combinar(delAgente, tareaAbierta(), {
    dueDate: { $gte: todayStart, $lt: todayEnd },
  })).lean();

  for (const t of deHoy) {
    if (!(await nuevo('tarea', t._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: scopeId,
      tipo: 'tarea',
      titulo: 'Tarea para hoy',
      mensaje: t.title || 'Sin título',
      prioridad: 'media',
      entidadTipo: 'tarea',
      entidadId: String(t._id),
      entidadNombre: t.title || '',
      accionUrl: '/citas',
    }));
  }

  // 4. Consultas del sitio asignadas al agente (últimas 48 h, sin leer)
  const consultas = await Activity.find({
    ...delAgente,
    type: { $in: ['enquiry', 'visit_scheduled'] },
    'metadata.read': { $ne: true },
    createdAt: { $gte: new Date(now.getTime() - HORAS_48) },
  }).sort({ createdAt: -1 }).limit(10).lean();

  for (const inq of consultas) {
    if (!(await nuevo('consulta_web', inq._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: scopeId,
      tipo: 'consulta_web',
      titulo: inq.type === 'visit_scheduled' ? 'Nueva solicitud de visita' : 'Nueva consulta web',
      mensaje: `${inq.metadata?.clientName || 'Visitante'} - ${inq.notes || inq.metadata?.propertyTitle || 'Sin detalle'}`,
      prioridad: 'alta',
      entidadTipo: 'consulta',
      entidadId: String(inq._id),
      entidadNombre: inq.metadata?.clientName || '',
      accionUrl: `/consultas?id=${inq._id}`,
    }));
  }

  // 5. Propiedades propias que cambiaron de estado
  const propiedades = await Propiedad.find({
    agentId: scopeId,
    status: { $in: ['Reservada', 'Vendida', 'Alquilada'] },
    updatedAt: { $gte: new Date(now.getTime() - HORAS_24) },
  }).lean();

  for (const prop of propiedades) {
    if (!(await nuevo('propiedad_estado', prop._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: scopeId,
      tipo: 'propiedad_estado',
      titulo: `Propiedad ${prop.status}`,
      mensaje: `${prop.title || 'Propiedad'} - ${prop.address || ''}`,
      prioridad: 'media',
      entidadTipo: 'propiedad',
      entidadId: String(prop._id),
      entidadNombre: prop.title || '',
      accionUrl: `/propiedades?id=${prop._id}`,
    }));
  }

  // 6. Contratos de clientes propios por vencer
  const porVencer = await Cliente.find({
    ...delAgente,
    'metadata.fechaVencimientoContrato': { $gte: now, $lte: new Date(now.getTime() + DIAS_30) },
  }).lean();

  for (const cli of porVencer) {
    if (!(await nuevo('contrato_vencimiento', cli._id))) continue;
    const fecha = new Date(cli.metadata.fechaVencimientoContrato);
    const dias = Math.ceil((fecha - now) / (24 * 60 * 60 * 1000));
    creadas.push(await crearNotificacion({
      agenteId: scopeId,
      tipo: 'contrato_vencimiento',
      titulo: `Contrato por vencer en ${dias} días`,
      mensaje: `${cli.nombre || 'Cliente'} - Vence el ${fecha.toLocaleDateString('es-AR')}`,
      prioridad: dias <= 7 ? 'urgente' : dias <= 15 ? 'alta' : 'media',
      entidadTipo: 'cliente',
      entidadId: String(cli._id),
      entidadNombre: cli.nombre || '',
      accionUrl: `/clientes?id=${cli._id}`,
    }));
  }

  // 7. Operaciones propias de las últimas 24 h
  const operaciones = await Operacion.find({
    ...delAgente,
    createdAt: { $gte: new Date(now.getTime() - HORAS_24) },
  }).sort({ createdAt: -1 }).limit(5).lean();

  for (const op of operaciones) {
    if (!(await nuevo('operacion_nueva', op._id))) continue;
    creadas.push(await crearNotificacion({
      agenteId: scopeId,
      tipo: 'operacion_nueva',
      titulo: `Nueva operación: ${op.tipo || 'Operación'}`,
      mensaje: `${op.titulo || op.propiedad || 'Sin título'} - $${(op.monto || 0).toLocaleString()}`,
      prioridad: 'alta',
      entidadTipo: 'operacion',
      entidadId: String(op._id),
      entidadNombre: op.titulo || '',
      // La ruta es /crm/operaciones; '/ventas' no existe y caía en el login.
      accionUrl: '/operaciones',
    }));
  }

  return creadas;
}

module.exports = {
  generateAdminNotifications,
  generateAgentNotifications,
  crearNotificacion,
  retirarNotificaciones,
  yaNotificado,
  claveDelDia,
};
