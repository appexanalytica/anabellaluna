const mongoose = require('mongoose');

const whatsAppSessionSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agente',
      default: null,
      index: true,
    },
    provider: {
      type: String,
      default: 'evolution',
    },
    phone: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['CREATED', 'WAITING_QR', 'CONNECTED', 'DISCONNECTED', 'BLOCKED', 'ERROR'],
      default: 'CREATED',
      index: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    qrCodeBase64: {
      type: String,
      default: '',
    },
    lastSeen: {
      type: Date,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WhatsAppSession', whatsAppSessionSchema);
