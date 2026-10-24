const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Propiedad = require('./models/Propiedad');
const Cliente = require('./models/Cliente');
const Agente = require('./models/Agente');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return console.error('MONGODB_URI not set');
  await mongoose.connect(uri);
  console.log('Connected to DB, seeding...');
  const resetDemo = process.argv.includes('--reset-demo');

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const admin = await User.findOneAndUpdate(
    { username: adminUsername },
    { $set: { password_hash: adminHash, role: 'admin' } },
    { upsert: true, new: true }
  ).exec();
  console.log('Admin user ensured:', { id: admin._id.toString(), username: admin.username, role: admin.role });

  // Usuario agente para trabajar en local: el panel de agentes necesita un login
  // con rol 'agent', que hasta ahora el seed no creaba (el "Agente Demo" de
  // --reset-demo es una ficha de agente, no una cuenta). Solo con --dev-users,
  // para no crear cuentas por accidente en un entorno real.
  if (process.argv.includes('--dev-users')) {
    if (process.env.NODE_ENV === 'production') {
      console.error('--dev-users no corre con NODE_ENV=production');
      process.exit(1);
    }
    const agenteUsername = process.env.DEV_AGENT_USERNAME || 'agente';
    const agentePassword = process.env.DEV_AGENT_PASSWORD || 'agente123';
    const ficha = await Agente.findOneAndUpdate(
      { email: 'agente.dev@example.com' },
      { $set: { nombre: 'Agente Desarrollo' } },
      { upsert: true, new: true }
    ).exec();
    const agenteHash = await bcrypt.hash(agentePassword, 10);
    const cuenta = await User.findOneAndUpdate(
      { username: agenteUsername },
      { $set: { password_hash: agenteHash, role: 'agent', agenteId: ficha._id, nombre: 'Agente Desarrollo' } },
      { upsert: true, new: true }
    ).exec();
    console.log('Dev agent user ensured:', { username: cuenta.username, role: cuenta.role, agenteId: String(ficha._id) });
  }

  if (resetDemo) {
    await Propiedad.deleteMany({});
    await Cliente.deleteMany({});
    await Agente.deleteMany({});

    const cliente = await Cliente.create({ nombre: 'Cliente Demo', email: 'cli@example.com' });
    const agente = await Agente.create({ nombre: 'Agente Demo', email: 'agent@example.com' });
    await Propiedad.create({ title: 'Depto Demo', description: 'Demo', price: 100000, ownerId: cliente._id, agentId: agente._id });
    console.log('Demo data reset complete');
  }

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
