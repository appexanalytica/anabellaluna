const mongoose = require('mongoose');

const DocumentLinkSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  entity_type: String,
  entity_id: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DocumentLink', DocumentLinkSchema);
