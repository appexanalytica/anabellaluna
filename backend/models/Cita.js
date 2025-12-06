const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  clienteId: { type: String },
  agenteId: { type: String },
  propiedadId: { type: String },
  notas: { type: String, default: '' },
  estado: { type: String, enum: ['Programada', 'Completada', 'Cancelada'], default: 'Programada' }
}, { timestamps: true });

module.exports = mongoose.model('Cita', CitaSchema);
