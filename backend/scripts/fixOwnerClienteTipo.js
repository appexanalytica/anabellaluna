#!/usr/bin/env node
/**
 * One-time fix: los clientes creados inline desde el formulario de propiedades
 * se guardaban con metadata vacío (el payload viajaba plano y el schema estricto
 * descartaba los campos CRM), por lo que el CRM los mostraba como "Comprador".
 *
 * Este script marca como "Propietario" a todo cliente que figure como ownerId
 * de alguna propiedad y no tenga metadata.tipoCliente ni metadata.tipo.
 *
 * Usage:  node scripts/fixOwnerClienteTipo.js [--dry-run]
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Cliente = require('../models/Cliente');
const Propiedad = require('../models/Propiedad');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anabella';
const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log(`Connected.${DRY_RUN ? ' (dry-run: no se escribirá nada)' : ''}\n`);

  const ownerIds = await Propiedad.distinct('ownerId', { ownerId: { $nin: [null, ''] } });
  const validIds = ownerIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
  console.log(`Found ${validIds.length} ownerIds referenciados por propiedades.\n`);

  let fixed = 0, alreadyTyped = 0, missing = 0;
  for (const id of validIds) {
    const cliente = await Cliente.findById(id).lean();
    if (!cliente) { missing += 1; continue; }
    const md = cliente.metadata || {};
    if (md.tipoCliente || md.tipo) { alreadyTyped += 1; continue; }
    console.log(`  [fix] ${cliente.nombre} (${id}) -> tipoCliente: Propietario`);
    if (!DRY_RUN) {
      await Cliente.updateOne(
        { _id: id },
        { $set: { 'metadata.tipoCliente': 'Propietario' } },
      );
    }
    fixed += 1;
  }

  console.log(`\nDone. fixed=${fixed}, yaTenianTipo=${alreadyTyped}, clienteInexistente=${missing}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
