/**
 * Carga inicial del motor de recomendaciones.
 *
 * Genera el perfil semántico de todas las propiedades y clientes: la narrativa,
 * los hechos normalizados y el vector. Solo procesa lo que cambió, así que se
 * puede volver a correr cuantas veces haga falta.
 *
 * Uso:
 *   node backend/scripts/matching-backfill.js
 *   node backend/scripts/matching-backfill.js --tipo=propiedad --limit=200
 *   node backend/scripts/matching-backfill.js --sin-ia      (solo plantilla y vector)
 *   node backend/scripts/matching-backfill.js --force       (regenera todo)
 *   node backend/scripts/matching-backfill.js --diagnostico (no escribe nada)
 */

require('dotenv').config();
const mongoose = require('mongoose');

const args = process.argv.slice(2);
const flag = (nombre) => args.includes(`--${nombre}`);
const valor = (nombre, def) => {
  const encontrado = args.find((a) => a.startsWith(`--${nombre}=`));
  return encontrado ? encontrado.split('=')[1] : def;
};

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/anabella';
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`Conectado a ${uri.replace(/\/\/[^@]*@/, '//***@')}`);

  const Propiedad = require('../models/Propiedad');
  const Cliente = require('../models/Cliente');
  const currency = require('../services/matching/currency');
  const normalize = require('../services/matching/normalize');
  const profileService = require('../services/matching/profileService');

  const rate = await currency.getRate();
  console.log(rate.configurada
    ? `Cotización: $${rate.valor} por USD (${rate.edadDias} días)`
    : 'Sin cotización cargada — las propiedades en pesos no se comparan con presupuestos en dólares');

  // ── Diagnóstico: qué tan lista está la cartera ───────────────────────────
  if (flag('diagnostico')) {
    const props = await Propiedad.find({ published: true }).lean();
    const clis = await Cliente.find({}).lean();

    const faltantes = {};
    for (const p of props) {
      for (const f of profileService.faltantesPropiedad(normalize.propertyFacts(p, rate))) {
        faltantes[f] = (faltantes[f] || 0) + 1;
      }
    }

    const sinPresupuesto = clis.filter((c) => !normalize.clientFacts(c, rate).presupuestoUSD).length;
    const sinZona = clis.filter((c) => !normalize.clientFacts(c, rate).zonas.length).length;

    console.log(`\nPropiedades publicadas: ${props.length}`);
    console.log('Datos que faltan y las dejan fuera del matching:');
    Object.entries(faltantes).sort((a, b) => b[1] - a[1])
      .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

    console.log(`\nClientes: ${clis.length}`);
    console.log(`  ${String(sinPresupuesto).padStart(4)}  sin presupuesto cargado`);
    console.log(`  ${String(sinZona).padStart(4)}  sin zona de interés`);

    await mongoose.disconnect();
    return;
  }

  // ── Backfill ─────────────────────────────────────────────────────────────
  const tipo = valor('tipo');
  const limit = parseInt(valor('limit', '1000'), 10);
  const conIA = !flag('sin-ia');
  const force = flag('force');

  console.log(`\nGenerando perfiles${tipo ? ` de ${tipo}` : ''} (límite ${limit}, ${conIA ? 'con' : 'sin'} IA${force ? ', forzado' : ''})...`);

  let ultimo = 0;
  const resumen = await profileService.backfill({
    entityType: tipo,
    limit,
    conIA,
    force,
    onProgress: (r) => {
      if (r.procesados - ultimo >= 25) {
        ultimo = r.procesados;
        console.log(`  ${r.procesados} procesados · ${r.regenerados} generados · ${r.saltados} sin cambios · ${r.errores} errores`);
      }
    },
  });

  console.log('\nListo:', JSON.stringify(resumen));
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Falló el backfill:', err.message);
  process.exit(1);
});
