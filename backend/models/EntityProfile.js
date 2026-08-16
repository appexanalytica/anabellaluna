const mongoose = require('mongoose');

/**
 * EntityProfile — Capa semántica sobre propiedades y clientes.
 *
 * Ni Propiedad ni Cliente tienen esquema en su `metadata`: el mismo dato puede
 * estar con distinta clave, o solo mencionado en una nota. Este perfil resuelve
 * eso por encima, sin migrar nada:
 *
 *   facts     → hechos normalizados (los calcula normalize.js, sin IA)
 *   narrativa → el texto que se convierte en vector; acá vive lo que los campos
 *               no dicen ("quiere planta baja porque la madre usa silla")
 *   embedding → el vector de esa narrativa
 *
 * Se regenera solo cuando cambia `contentHash`, así una propiedad que nadie
 * tocó no se vuelve a procesar nunca.
 */
const EntityProfileSchema = new mongoose.Schema({
  entityType: { type: String, enum: ['propiedad', 'cliente'], required: true, index: true },
  entityId:   { type: String, required: true, index: true },
  agenteId:   { type: String, default: '', index: true },

  contentHash: { type: String, default: '' },

  narrativa: { type: String, default: '' },
  facts:     { type: Object, default: {} },
  tags:      { type: [String], default: [] },

  // Solo propiedades
  publicoIdeal: { type: [String], default: [] },
  faltantes:    { type: [String], default: [] },

  // Solo clientes
  requisitos: {
    must: { type: Array, default: [] },
    nice: { type: Array, default: [] },
  },
  senales:   { type: Object, default: {} },
  descartes: { type: Array, default: [] },
  presupuestoDeclarado: {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
  },

  embedding:      { type: [Number], default: [] },
  embeddingModel: { type: String, default: '' },

  // Trazabilidad
  generadoPor: { type: String, enum: ['ia', 'plantilla'], default: 'plantilla' },
  model:       { type: String, default: '' },
  version:     { type: Number, default: 1 },
  error:       { type: String, default: '' },
}, {
  timestamps: true,
  collection: 'entity_profiles',
});

EntityProfileSchema.index({ entityType: 1, entityId: 1 }, { unique: true });
EntityProfileSchema.index({ entityType: 1, agenteId: 1 });

module.exports = mongoose.model('EntityProfile', EntityProfileSchema);
