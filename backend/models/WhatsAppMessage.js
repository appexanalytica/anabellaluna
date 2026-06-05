const mongoose = require('mongoose');

const whatsAppMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WhatsAppConversation',
      required: true,
      index: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WhatsAppContact',
      required: true,
    },
    waMessageId: { type: String, index: true, sparse: true }, // ID de Meta
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'document', 'audio', 'video', 'template', 'interactive', 'sticker'],
      default: 'text',
    },
    content: {
      text: String,
      mediaUrl: String,      // URL interna (MinIO/Cloudinary)
      mediaId: String,       // ID de Meta original
      caption: String,
      filename: String,
      mimeType: String,
      templateName: String,
      templateParams: [mongoose.Schema.Types.Mixed],
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
      default: 'pending',
    },
    statusAt: {
      sent: Date,
      delivered: Date,
      read: Date,
    },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agente', default: null },
    errorDetails: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('WhatsAppMessage', whatsAppMessageSchema);
