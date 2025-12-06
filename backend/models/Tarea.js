const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    status: { type: String, enum: ['Open', 'InProgress', 'Testing', 'Close'], default: 'Open', index: true },
    priority: { type: String, enum: ['Alta', 'Media', 'Baja'], default: 'Media' },
    tags: [{ type: String }],
    agente: { type: String, default: '' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    // relaciones opcionales
    clienteId: { type: String },
    propiedadId: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tarea', TareaSchema);
