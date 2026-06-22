const mongoose = require('mongoose');

/**
 * AgentEngagement – uso de la plataforma por agente, agregado por día.
 *
 * Un documento por agente y por día (clave única { agenteId, date }).
 * Alimenta las métricas de "tiempo en la app", "cantidad de logins",
 * "días activos" y la racha (streak) del centro de mando de Agentes.
 *
 *   loginCount    – cantidad de inicios de sesión ese día
 *   activeSeconds – segundos activos acumulados vía heartbeat
 *   firstSeenAt   – primer evento del día
 *   lastSeenAt    – último evento del día (último heartbeat/login)
 */
const AgentEngagementSchema = new mongoose.Schema({
  agenteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agente', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // 'YYYY-MM-DD' según la hora del servidor
  date: { type: String, required: true },
  loginCount: { type: Number, default: 0 },
  activeSeconds: { type: Number, default: 0 },
  firstSeenAt: { type: Date },
  lastSeenAt: { type: Date },
}, { timestamps: true });

AgentEngagementSchema.index({ agenteId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AgentEngagement', AgentEngagementSchema);
