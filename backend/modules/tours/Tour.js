const mongoose = require('mongoose');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

const TourSchema = new mongoose.Schema({
  propertyId: { type: String, required: true, index: true },
  organizationId: { type: String, default: '', index: true },
  createdBy: { type: String, required: true, index: true },
  agenteId: { type: String, default: '', index: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true, index: true },
  published: { type: Boolean, default: false, index: true },
  settings: {
    theme: { type: String, default: 'dark' },
    autorotate: { type: Boolean, default: true },
    gyroscope: { type: Boolean, default: true },
    fullscreen: { type: Boolean, default: true },
    showSceneNavigator: { type: Boolean, default: true },
    brandColor: { type: String, default: '#d4af37' },
    initialSceneId: { type: String, default: '' },
  },
  scenes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VirtualTourScene' }],
  metadata: { type: Object, default: {} },
  publishedAt: { type: Date },
}, { timestamps: true });

TourSchema.pre('validate', async function preValidate(next) {
  try {
    if (this.slug) return next();
    const base = slugify(this.title) || `tour-${Date.now()}`;
    let candidate = base;
    for (let i = 1; i <= 1000; i += 1) {
      const existing = await this.constructor.findOne({ slug: candidate, _id: { $ne: this._id } }).lean();
      if (!existing) break;
      candidate = `${base}-${i + 1}`;
    }
    this.slug = candidate;
    return next();
  } catch (err) {
    return next(err);
  }
});

TourSchema.index({ propertyId: 1, published: 1 });
TourSchema.index({ agenteId: 1, updatedAt: -1 });
TourSchema.index({ organizationId: 1, updatedAt: -1 });

module.exports = mongoose.model('VirtualTour', TourSchema);
