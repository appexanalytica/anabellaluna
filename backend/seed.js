const mongoose = require('mongoose');
require('dotenv').config();
const Propiedad = require('./models/Propiedad');
const Cliente = require('./models/Cliente');
const Agente = require('./models/Agente');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return console.error('MONGODB_URI not set');
  await mongoose.connect(uri);
  console.log('Connected to DB, seeding...');
  await Propiedad.deleteMany({});
  await Cliente.deleteMany({});
  await Agente.deleteMany({});

  const cliente = await Cliente.create({ nombre: 'Cliente Demo', email: 'cli@example.com' });
  const agente = await Agente.create({ nombre: 'Agente Demo', email: 'agent@example.com' });
  await Propiedad.create({ title: 'Depto Demo', description: 'Demo', price: 100000, ownerId: cliente._id, agentId: agente._id });

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
