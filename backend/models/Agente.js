const mongoose = require('mongoose');

const AgenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, default: '' },
  telefono: { type: String, default: '' },
  cargo: { type: String, default: 'Agente Inmobiliario' },
  bio: { type: String, default: '' },
  direccion: { type: String, default: '' },
  especialidad: { type: String, default: '' },
  avatar: { type: String, default: '' },
  redesSociales: {
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  role: { type: String, default: 'agent' },
  // Controla si el agente aparece en el sitio web público (listado y detalle).
  visibleEnSitio: { type: Boolean, default: true },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Agente', AgenteSchema);
