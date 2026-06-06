const mongoose = require('mongoose');

const whatsAppConversationSchema = new mongoose.Schema(
  {
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WhatsAppContact',
      required: true,
      index: true,
    },
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      default: null,
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agente',
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'pending'],
      default: 'open',
      index: true,
    },
    windowExpiresAt: { type: Date }, // ventana 24h de Meta
    unreadCount: { type: Number, default: 0 },
    lastMessage: {
      type: new mongoose.Schema({
        content: String,
        type: String,
        direction: String, // 'inbound' | 'outbound'
        timestamp: Date,
      }, { _id: false }),
      default: null,
    },
    labels: [String],
    // Sesión de Evolution API por la que llegó/se envía esta conversación
    sessionName: {
      type: String,
      default: '',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WhatsAppConversation', whatsAppConversationSchema);
