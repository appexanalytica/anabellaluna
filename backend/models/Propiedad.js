const mongoose = require('mongoose');

const PropiedadSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  price: { type: Number, default: 0 },
  moneda: { type: String, default: 'ARS' },
  ownerId: { type: String }, // cliente id
  agentId: { type: String },
  status: { type: String, enum: ['Disponible', 'Reservada', 'Vendida'], default: 'Disponible' },
  metadata: { type: Object, default: {} },
  createdBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Propiedad', PropiedadSchema);
