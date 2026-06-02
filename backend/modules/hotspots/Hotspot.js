const mongoose = require('mongoose');

const HotspotSchema = new mongoose.Schema({
  sceneId: { type: mongoose.Schema.Types.ObjectId, ref: 'VirtualTourScene', required: true, index: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'VirtualTour', required: true, index: true },
  type: {
    type: String,
    enum: ['navigation', 'info', 'multimedia', 'cta', 'custom'],
    default: 'navigation',
    index: true,
  },
  yaw: { type: Number, required: true },
  pitch: { type: Number, required: true },
  targetSceneId: { type: String, default: '' },
  label: { type: String, default: '' },
  payload: { type: Object, default: {} },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

HotspotSchema.index({ sceneId: 1, createdAt: 1 });
HotspotSchema.index({ tourId: 1, type: 1 });

module.exports = mongoose.model('VirtualTourHotspot', HotspotSchema);
