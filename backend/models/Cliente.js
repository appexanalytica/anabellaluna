const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, default: '' },
  telefono: { type: String, default: '' },
  direccion: { type: String, default: '' },
  notas: { type: String, default: '' },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Cliente', ClienteSchema);
