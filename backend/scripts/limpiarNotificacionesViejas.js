#!/usr/bin/env node
/**
 * Limpieza única del arrastre que dejó el generador de notificaciones viejo.
 *
 * Dos problemas acumulados en la base:
 *
 *  1. **Duplicados.** El dedupe sólo miraba el día actual, así que un mismo
 *     hecho (una consulta sin leer, una tarea vencida, un contrato por vencer)
 *     generaba una notificación nueva cada día. Se conserva la más antigua de
 *     cada grupo (agente + tipo + entidad) y se borran las repeticiones.
 *
 *  2. **Avisos huérfanos.** Las notificaciones de tareas seguían vivas aunque
 *     la tarea estuviera completada, cancelada o borrada. Se retiran.
 *
 * Los resúmenes diarios ('reporte_diario' y las citas 'resumen_hoy:FECHA') ya
 * llevan la fecha en la clave de entidad, así que no se tocan: son una por día
 * a propósito.
 *
 * Usage:  node scripts/limpiarNotificacionesViejas.js [--dry-run]
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const Tarea = require('../models/Tarea');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anabella';
const DRY_RUN = process.argv.includes('--dry-run');

// Estados en los que una tarea ya no requiere acción.
const ESTADOS_TAREA_CERRADA = ['completada', 'cancelada', 'done', 'Close'];

async function limpiarDuplicados() {
  // Agrupamos por agente + tipo + entidad. Sin entidadId no se puede saber si
  // dos avisos son el mismo hecho, así que esos quedan afuera.
  const grupos = await Notification.aggregate([
    { $match: { entidadId: { $nin: [null, ''] }, tipo: { $ne: 'reporte_diario' } } },
    {
      $group: {
        _id: { agenteId: '$agenteId', tipo: '$tipo', entidadId: '$entidadId' },
        ids: { $push: '$_id' },
        primera: { $min: '$createdAt' },
        total: { $sum: 1 },
      },
    },
    { $match: { total: { $gt: 1 } } },
  ]);

  // Las claves con fecha (resumen_hoy:2026-08-15) son una por día a propósito.
  const reales = grupos.filter((g) => !String(g._id.entidadId).includes(':'));

  let aBorrar = [];
  for (const grupo of reales) {
    const docs = await Notification.find({
      agenteId: grupo._id.agenteId,
      tipo: grupo._id.tipo,
      entidadId: grupo._id.entidadId,
    }).sort({ createdAt: 1 }).select('_id').lean();
    // Se conserva la primera: es la que avisó del hecho cuando ocurrió.
    aBorrar = aBorrar.concat(docs.slice(1).map((d) => d._id));
  }

  console.log(`Duplicados: ${reales.length} hechos con repeticiones, ${aBorrar.length} notificaciones sobrantes.`);
  if (!DRY_RUN && aBorrar.length) {
    const res = await Notification.deleteMany({ _id: { $in: aBorrar } });
    console.log(`  → borradas ${res.deletedCount}.`);
  }
  return aBorrar.length;
}

async function limpiarHuerfanas() {
  const avisos = await Notification.find({ tipo: 'tarea', entidadId: { $nin: [null, ''] } })
    .select('_id entidadId')
    .lean();
  if (!avisos.length) {
    console.log('Avisos de tareas: no hay.');
    return 0;
  }

  const ids = [...new Set(avisos.map((n) => String(n.entidadId)))]
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  const vivas = await Tarea.find({
    _id: { $in: ids },
    status: { $nin: ESTADOS_TAREA_CERRADA },
    completed: { $ne: true },
  }).select('_id').lean();

  const abiertas = new Set(vivas.map((t) => String(t._id)));
  // Huérfano = la tarea ya no existe, o existe pero está cerrada.
  const aBorrar = avisos.filter((n) => !abiertas.has(String(n.entidadId))).map((n) => n._id);

  console.log(`Avisos de tareas ya resueltas o borradas: ${aBorrar.length} de ${avisos.length}.`);
  if (!DRY_RUN && aBorrar.length) {
    const res = await Notification.deleteMany({ _id: { $in: aBorrar } });
    console.log(`  → borradas ${res.deletedCount}.`);
  }
  return aBorrar.length;
}

async function main() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log(`Conectado.${DRY_RUN ? ' (dry-run: no se escribe nada)' : ''}\n`);

  const antes = await Notification.countDocuments({});
  console.log(`Notificaciones antes: ${antes}\n`);

  const duplicados = await limpiarDuplicados();
  const huerfanas = await limpiarHuerfanas();

  const despues = DRY_RUN ? antes : await Notification.countDocuments({});
  console.log(`\nNotificaciones después: ${despues}`);
  console.log(DRY_RUN
    ? `Se habrían borrado ~${duplicados + huerfanas}. Corré sin --dry-run para aplicarlo.`
    : 'Listo.');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
