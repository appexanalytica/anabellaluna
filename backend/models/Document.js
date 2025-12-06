const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  categoria: { type: String, default: 'Sin clasificar' },
  tamano: Number,
  fecha: { type: Date, default: Date.now },
  relacionado: String,
  accesos: { type: Number, default: 0 },
  url: String,
  cloudinary_id: String,
  versions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Version' }],
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }
});

module.exports = mongoose.model('Document', DocumentSchema);
