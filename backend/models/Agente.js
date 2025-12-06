const mongoose = require('mongoose');

const AgenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, default: '' },
  telefono: { type: String, default: '' },
  role: { type: String, default: 'agent' },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Agente', AgenteSchema);
