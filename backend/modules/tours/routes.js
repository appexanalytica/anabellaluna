const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const { authenticateToken, requireCRMUser, agentScopeId, getUserId } = require('../../auth');
const minio = require('../../minio');
const Propiedad = require('../../models/Propiedad');
const Agente = require('../../models/Agente');
const Tour = require('./Tour');
const Scene = require('../scenes/Scene');
const Hotspot = require('../hotspots/Hotspot');
const { processPanoramaUpload } = require('../uploads/panoramaProcessor');

const crmRouter = express.Router();
const publicRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 220 * 1024 * 1024 } });

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ''));
}

function normalizeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function buildScopeFilter(req, base = {}) {
  const scopeId = agentScopeId(req);
  if (scopeId) return { ...base, agenteId: scopeId };
  return base;
}

async function assertTourAccess(req, tourId) {
  const filter = buildScopeFilter(req, { _id: tourId });
  const tour = await Tour.findOne(filter);
  if (!tour) {
    const error = new Error('Tour not found');
    error.statusCode = 404;
    throw error;
  }
  return tour;
}

async function buildTourMetadata(req, prop, agenteId, extra = {}) {
  let agent = null;
  if (agenteId && isObjectId(agenteId)) agent = await Agente.findById(agenteId).lean();
  return {
    source: 'virtual_tours',
    propertyId: String(prop._id),
    propertyTitle: prop.title || '',
    propertySlug: prop.slug || '',
    agenteId: agenteId || '',
    agenteNombre: agent ? (agent.nombre || '') : '',
    organizationId: extra.organizationId || prop.metadata?.inmobiliariaId || prop.metadata?.organizationId || '',
    organizationName: extra.organizationName || prop.metadata?.inmobiliariaNombre || prop.metadata?.organizationName || '',
    createdByUserId: getUserId(req) || '',
    createdByRole: req.user?.role || '',
    updatedAt: new Date().toISOString(),
    ...extra,
  };
}

async function serializeTour(tourDoc) {
  const tour = typeof tourDoc.toObject === 'function' ? tourDoc.toObject() : tourDoc;
  const scenes = await Scene.find({ tourId: tour._id }).sort({ order: 1, createdAt: 1 }).lean();
  const sceneIds = scenes.map((scene) => scene._id);
  const hotspots = await Hotspot.find({ sceneId: { $in: sceneIds } }).sort({ createdAt: 1 }).lean();
  const hotspotsByScene = hotspots.reduce((acc, hotspot) => {
    const key = String(hotspot.sceneId);
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      id: String(hotspot._id),
      type: hotspot.type,
      yaw: hotspot.yaw,
      pitch: hotspot.pitch,
      targetSceneId: hotspot.targetSceneId || '',
      label: hotspot.label || '',
      payload: hotspot.payload || {},
      metadata: hotspot.metadata || {},
    });
    return acc;
  }, {});

  return {
    id: String(tour._id),
    propertyId: tour.propertyId || '',
    organizationId: tour.organizationId || '',
    createdBy: tour.createdBy || '',
    agenteId: tour.agenteId || '',
    title: tour.title || '',
    slug: tour.slug || '',
    published: !!tour.published,
    settings: tour.settings || {},
    metadata: tour.metadata || {},
    createdAt: tour.createdAt,
    updatedAt: tour.updatedAt,
    publishedAt: tour.publishedAt,
    scenes: scenes.map((scene) => ({
      id: String(scene._id),
      title: scene.title || '',
      description: scene.description || '',
      imageUrl: scene.imageUrl || '',
      thumbnailUrl: scene.thumbnailUrl || '',
      previewUrl: scene.previewUrl || '',
      tilesPath: scene.tilesPath || '',
      tileManifest: scene.tileManifest || null,
      order: scene.order || 0,
      isInitial: !!scene.isInitial,
      initialView: scene.initialView || { yaw: 0, pitch: 0, fov: Math.PI / 2 },
      hotspots: hotspotsByScene[String(scene._id)] || [],
      metadata: scene.metadata || {},
    })),
  };
}

crmRouter.use(authenticateToken, requireCRMUser);

crmRouter.get('/', async (req, res) => {
  try {
    const { propertyId, q } = req.query;
    const filter = buildScopeFilter(req);
    if (propertyId) filter.propertyId = String(propertyId);
    if (q) filter.title = { $regex: String(q), $options: 'i' };
    const items = await Tour.find(filter).sort({ updatedAt: -1 }).limit(200).lean();
    return res.json({ items });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

crmRouter.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.propertyId) return res.status(400).json({ error: 'propertyId required' });
    if (!body.title) return res.status(400).json({ error: 'title required' });

    const prop = await Propiedad.findById(body.propertyId).lean();
    if (!prop) return res.status(404).json({ error: 'Property not found' });

    const scopeId = agentScopeId(req);
    if (scopeId && String(prop.agentId || '') !== scopeId) return res.status(403).json({ error: 'forbidden' });

    const agenteId = scopeId || String(body.agenteId || prop.agentId || '');
    const organizationId = String(body.organizationId || prop.metadata?.inmobiliariaId || prop.metadata?.organizationId || '');
    const metadata = await buildTourMetadata(req, prop, agenteId, {
      organizationId,
      organizationName: String(body.organizationName || prop.metadata?.inmobiliariaNombre || prop.metadata?.organizationName || ''),
      createdAt: new Date().toISOString(),
    });

    const tour = await Tour.create({
      propertyId: String(prop._id),
      organizationId,
      createdBy: getUserId(req) || '',
      agenteId,
      title: String(body.title || '').trim(),
      published: false,
      settings: body.settings || {},
      metadata,
    });

    return res.status(201).json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.get('/:id', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.id);
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
});

crmRouter.put('/:id', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.id);
    const body = req.body || {};
    if (body.title != null) tour.title = String(body.title || '').trim();
    if (body.settings && typeof body.settings === 'object') tour.settings = { ...(tour.settings || {}), ...body.settings };
    if (body.metadata && typeof body.metadata === 'object') {
      tour.metadata = { ...(tour.metadata || {}), ...body.metadata, updatedAt: new Date().toISOString(), source: 'virtual_tours' };
    }
    await tour.save();
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.delete('/:id', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.id);
    const scenes = await Scene.find({ tourId: tour._id }).select('_id').lean();
    await Hotspot.deleteMany({ tourId: tour._id });
    await Scene.deleteMany({ _id: { $in: scenes.map((scene) => scene._id) } });
    await Tour.deleteOne({ _id: tour._id });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
});

crmRouter.patch('/:id/publish', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.id);
    const sceneCount = await Scene.countDocuments({ tourId: tour._id });
    if (!sceneCount) return res.status(400).json({ error: 'At least one scene is required before publishing' });
    const published = req.body?.published != null ? !!req.body.published : true;
    tour.published = published;
    tour.publishedAt = published ? new Date() : null;
    tour.metadata = { ...(tour.metadata || {}), publishedAt: tour.publishedAt, updatedAt: new Date().toISOString(), source: 'virtual_tours' };
    await tour.save();
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.post('/:id/scenes/upload', upload.single('panorama'), async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.id);
    const sceneId = new mongoose.Types.ObjectId();
    const processed = await processPanoramaUpload({ file: req.file, tourId: tour._id, sceneId });
    const count = await Scene.countDocuments({ tourId: tour._id });
    const isInitial = String(req.body?.isInitial || '').toLowerCase() === 'true' || count === 0;

    if (isInitial) await Scene.updateMany({ tourId: tour._id }, { $set: { isInitial: false } });

    const scene = await Scene.create({
      _id: sceneId,
      tourId: tour._id,
      title: String(req.body?.title || req.file?.originalname || `Escena ${count + 1}`).trim(),
      description: String(req.body?.description || ''),
      imageUrl: processed.imageUrl,
      thumbnailUrl: processed.thumbnailUrl,
      previewUrl: processed.previewUrl,
      tilesPath: processed.tilesPath,
      tileManifest: processed.tileManifest,
      order: count,
      isInitial,
      initialView: {
        yaw: normalizeNumber(req.body?.yaw, 0),
        pitch: normalizeNumber(req.body?.pitch, 0),
        fov: normalizeNumber(req.body?.fov, Math.PI / 2),
      },
      storage: {
        bucket: processed.bucket,
        originalKey: processed.originalKey,
        previewKey: processed.previewKey,
        thumbnailKey: processed.thumbnailKey,
        tilesPrefix: processed.tilesPrefix,
      },
      metadata: {
        ...processed.metadata,
        tourId: String(tour._id),
        propertyId: tour.propertyId || '',
        agenteId: tour.agenteId || '',
        organizationId: tour.organizationId || '',
      },
    });

    tour.scenes = [...(tour.scenes || []), scene._id];
    if (isInitial) tour.settings = { ...(tour.settings || {}), initialSceneId: String(scene._id) };
    tour.metadata = { ...(tour.metadata || {}), updatedAt: new Date().toISOString(), source: 'virtual_tours' };
    await tour.save();

    return res.status(201).json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.put('/:tourId/scenes/:sceneId', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.tourId);
    const scene = await Scene.findOne({ _id: req.params.sceneId, tourId: tour._id });
    if (!scene) return res.status(404).json({ error: 'Scene not found' });
    const body = req.body || {};
    if (body.title != null) scene.title = String(body.title || '').trim();
    if (body.description != null) scene.description = String(body.description || '');
    if (body.initialView) scene.initialView = { ...(scene.initialView || {}), ...body.initialView };
    if (body.isInitial === true) {
      await Scene.updateMany({ tourId: tour._id, _id: { $ne: scene._id } }, { $set: { isInitial: false } });
      scene.isInitial = true;
      tour.settings = { ...(tour.settings || {}), initialSceneId: String(scene._id) };
      await tour.save();
    }
    scene.metadata = { ...(scene.metadata || {}), updatedAt: new Date().toISOString(), source: 'virtual_tours' };
    await scene.save();
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.patch('/:tourId/scenes/reorder', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.tourId);
    const sceneIds = Array.isArray(req.body?.sceneIds) ? req.body.sceneIds : [];
    await Promise.all(sceneIds.map((sceneId, index) => Scene.updateOne({ _id: sceneId, tourId: tour._id }, { $set: { order: index } })));
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.delete('/:tourId/scenes/:sceneId', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.tourId);
    await Hotspot.deleteMany({ sceneId: req.params.sceneId, tourId: tour._id });
    await Scene.deleteOne({ _id: req.params.sceneId, tourId: tour._id });
    tour.scenes = (tour.scenes || []).filter((id) => String(id) !== String(req.params.sceneId));
    await tour.save();
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
});

crmRouter.post('/:tourId/scenes/:sceneId/hotspots', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.tourId);
    const scene = await Scene.findOne({ _id: req.params.sceneId, tourId: tour._id });
    if (!scene) return res.status(404).json({ error: 'Scene not found' });
    const body = req.body || {};
    const hotspot = await Hotspot.create({
      sceneId: scene._id,
      tourId: tour._id,
      type: body.type || 'navigation',
      yaw: normalizeNumber(body.yaw, 0),
      pitch: normalizeNumber(body.pitch, 0),
      targetSceneId: body.targetSceneId ? String(body.targetSceneId) : '',
      label: String(body.label || ''),
      payload: body.payload || {},
      metadata: {
        source: 'virtual_tours',
        tourId: String(tour._id),
        sceneId: String(scene._id),
        propertyId: tour.propertyId || '',
        agenteId: tour.agenteId || '',
        organizationId: tour.organizationId || '',
        createdAt: new Date().toISOString(),
      },
    });
    scene.hotspots = [...(scene.hotspots || []), hotspot._id];
    await scene.save();
    return res.status(201).json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.put('/:tourId/hotspots/:hotspotId', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.tourId);
    const hotspot = await Hotspot.findOne({ _id: req.params.hotspotId, tourId: tour._id });
    if (!hotspot) return res.status(404).json({ error: 'Hotspot not found' });
    const body = req.body || {};
    ['type', 'targetSceneId', 'label'].forEach((field) => {
      if (body[field] != null) hotspot[field] = String(body[field]);
    });
    if (body.yaw != null) hotspot.yaw = normalizeNumber(body.yaw, hotspot.yaw);
    if (body.pitch != null) hotspot.pitch = normalizeNumber(body.pitch, hotspot.pitch);
    if (body.payload && typeof body.payload === 'object') hotspot.payload = body.payload;
    hotspot.metadata = { ...(hotspot.metadata || {}), updatedAt: new Date().toISOString(), source: 'virtual_tours' };
    await hotspot.save();
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
});

crmRouter.delete('/:tourId/hotspots/:hotspotId', async (req, res) => {
  try {
    const tour = await assertTourAccess(req, req.params.tourId);
    const hotspot = await Hotspot.findOneAndDelete({ _id: req.params.hotspotId, tourId: tour._id });
    if (hotspot) await Scene.updateOne({ _id: hotspot.sceneId }, { $pull: { hotspots: hotspot._id } });
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
});

publicRouter.get('/property/:propertyId', async (req, res) => {
  try {
    const tour = await Tour.findOne({ propertyId: String(req.params.propertyId), published: true }).sort({ publishedAt: -1, updatedAt: -1 });
    if (!tour) return res.status(404).json({ error: 'Not found' });
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

publicRouter.get('/assets/:objectKey', async (req, res) => {
  try {
    const objectKey = String(req.params.objectKey || '');
    if (!objectKey.startsWith('tours/')) return res.status(403).json({ error: 'forbidden' });
    const bucket = minio.buckets.web || minio.bucket || minio.buckets.crm || minio.buckets.erp;
    const stat = await minio.statObject(bucket, objectKey);
    const contentType = (stat.metaData && (stat.metaData['content-type'] || stat.metaData['Content-Type'])) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    if (stat.size) res.setHeader('Content-Length', String(stat.size));
    const stream = await minio.getObject(bucket, objectKey);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return stream.pipe(res);
  } catch (err) {
    return res.status(404).json({ error: 'Not found' });
  }
});

publicRouter.get('/:slug', async (req, res) => {
  try {
    const value = String(req.params.slug || '').trim();
    const filter = isObjectId(value) ? { _id: value, published: true } : { slug: value, published: true };
    const tour = await Tour.findOne(filter);
    if (!tour) return res.status(404).json({ error: 'Not found' });
    return res.json(await serializeTour(tour));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = {
  crmRouter,
  publicRouter,
  serializeTour,
};
