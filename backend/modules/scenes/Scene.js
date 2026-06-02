const mongoose = require('mongoose');

const SceneSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'VirtualTour', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  previewUrl: { type: String, default: '' },
  tilesPath: { type: String, default: '' },
  tileManifest: { type: Object, default: null },
  order: { type: Number, default: 0, index: true },
  isInitial: { type: Boolean, default: false },
  initialView: {
    yaw: { type: Number, default: 0 },
    pitch: { type: Number, default: 0 },
    fov: { type: Number, default: Math.PI / 2 },
  },
  hotspots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VirtualTourHotspot' }],
  storage: {
    bucket: { type: String, default: '' },
    originalKey: { type: String, default: '' },
    previewKey: { type: String, default: '' },
    thumbnailKey: { type: String, default: '' },
    tilesPrefix: { type: String, default: '' },
  },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

SceneSchema.index({ tourId: 1, order: 1 });
SceneSchema.index({ tourId: 1, isInitial: 1 });

module.exports = mongoose.model('VirtualTourScene', SceneSchema);
