const mongoose = require('mongoose');

/**
 * MatchRecommendation — Un cruce concreto entre un cliente y una propiedad.
 *
 * Guarda el puntaje con su desglose, la explicación redactada y qué hizo el
 * agente con ella. Ese último dato es el que después permite medir lo único
 * que importa: cuántos matches terminaron en visita y cuántos en operación.
 *
 * Sigue el patrón de MarketingRecommendation (status + expiresAt con TTL).
 */
const MatchRecommendationSchema = new mongoose.Schema({
  clienteId:   { type: String, required: true, index: true },
  propiedadId: { type: String, required: true, index: true },

  // El agente dueño del cliente: es quien acciona.
  colocadorId: { type: String, default: '', index: true },
  // El agente que captó la propiedad. Distinto del anterior = match cruzado.
  captadorId:  { type: String, default: '' },

  direction: {
    type: String,
    enum: ['cliente_a_propiedad', 'propiedad_a_cliente'],
    default: 'cliente_a_propiedad',
  },

  score:     { type: Number, required: true, index: true },
  bucket:    { type: String, enum: ['fuerte', 'buena', 'alternativa'], required: true },
  cobertura: { type: Number, default: 0 },
  breakdown: { type: Object, default: {} },

  // Cotización usada al calcular: sin esto, un match viejo cambia de números
  // solos cuando el admin actualiza el dólar.
  fxRate: {
    valor: { type: Number, default: null },
    fecha: { type: Date,   default: null },
  },

  // Explicación
  titulo:          { type: String, default: '' },
  porQue:          { type: [String], default: [] },
  objeciones:      { type: [String], default: [] },
  accionSugerida:  { type: String, default: '' },
  mensajeWhatsapp: { type: String, default: '' },
  explicadoPor:    { type: String, enum: ['ia', 'plantilla'], default: 'plantilla' },
  model:           { type: String, default: '' },

  // Huella de los datos con los que se calculó: si cambia, se recalcula.
  huella: { type: String, default: '', index: true },

  status: {
    type: String,
    enum: ['pending', 'viewed', 'sent', 'visita_agendada', 'descartado', 'convertido'],
    default: 'pending',
    index: true,
  },
  motivoDescarte: { type: String, default: '' },
  viewedAt:   { type: Date },
  sentAt:     { type: Date },
  resolvedAt: { type: Date },
  resolvedBy: { type: String, default: '' },

  // Se limpian solas: un match sin accionar deja de ser noticia.
  expiresAt: { type: Date, index: true },
}, {
  timestamps: true,
  collection: 'match_recommendations',
});

MatchRecommendationSchema.index({ clienteId: 1, propiedadId: 1 }, { unique: true });
MatchRecommendationSchema.index({ colocadorId: 1, status: 1, score: -1 });
MatchRecommendationSchema.index({ status: 1, bucket: 1, createdAt: -1 });
MatchRecommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('MatchRecommendation', MatchRecommendationSchema);
