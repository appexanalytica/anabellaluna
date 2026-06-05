const mongoose = require('mongoose');

const whatsAppTemplateSchema = new mongoose.Schema(
  {
    metaTemplateId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    language: { type: String, default: 'es' },
    category: {
      type: String,
      enum: ['MARKETING', 'UTILITY', 'AUTHENTICATION'],
      default: 'UTILITY',
    },
    status: {
      type: String,
      enum: ['APPROVED', 'PENDING', 'REJECTED'],
      default: 'PENDING',
    },
    components: [mongoose.Schema.Types.Mixed], // header, body, footer, buttons de Meta
    syncedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WhatsAppTemplate', whatsAppTemplateSchema);
