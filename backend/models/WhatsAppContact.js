const mongoose = require('mongoose');

const whatsAppContactSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true }, // sin +, con código de país
    displayName: { type: String, default: '' },
    profilePicUrl: { type: String, default: '' },
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', default: null },
    isBlocked: { type: Boolean, default: false },
    firstContactAt: { type: Date, default: Date.now },
    lastContactAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WhatsAppContact', whatsAppContactSchema);
