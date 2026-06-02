const path = require('path');
const sharp = require('sharp');
const minio = require('../../minio');

const DEFAULT_TILE_SIZE = 512;

function sanitizeSegment(value) {
  return String(value || 'asset')
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120) || 'asset';
}

function objectUrl(objectKey) {
  if (!objectKey) return '';
  return `/public/tours/assets/${encodeURIComponent(objectKey)}`;
}

function resolveBucket() {
  return minio.buckets.web || minio.bucket || minio.buckets.crm || minio.buckets.erp;
}

async function putBuffer(bucket, objectKey, buffer, contentType, cacheControl) {
  await minio.putObject(bucket, objectKey, buffer, buffer.length, {
    'Content-Type': contentType,
    'Cache-Control': cacheControl || 'public, max-age=31536000, immutable',
  });
}

async function processPanoramaUpload({ file, tourId, sceneId }) {
  if (!file || !file.buffer) {
    const error = new Error('panorama file required');
    error.statusCode = 400;
    throw error;
  }

  if (!/^image\/(jpeg|jpg|webp|png)$/i.test(String(file.mimetype || ''))) {
    const error = new Error('Only JPG, PNG or WebP panoramas are supported');
    error.statusCode = 400;
    throw error;
  }

  if (!minio.isConfigured()) {
    const error = new Error('MinIO/S3 storage is not configured');
    error.statusCode = 503;
    throw error;
  }

  await minio.ensureBuckets();

  const bucket = resolveBucket();
  const safeTourId = sanitizeSegment(tourId);
  const safeSceneId = sanitizeSegment(sceneId);
  const ext = String(path.extname(file.originalname || '') || '').toLowerCase() === '.webp' ? 'webp' : 'jpg';
  const basePrefix = `tours/${safeTourId}/${safeSceneId}`;

  const input = sharp(file.buffer, { limitInputPixels: false });
  const meta = await input.metadata();
  const width = Number(meta.width || 0);
  const height = Number(meta.height || 0);

  const optimized = await sharp(file.buffer, { limitInputPixels: false })
    .resize({ width: Math.min(width || 8192, 8192), withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  const preview = await sharp(file.buffer, { limitInputPixels: false })
    .resize({ width: 2048, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  const thumbnail = await sharp(file.buffer, { limitInputPixels: false })
    .resize({ width: 640, height: 360, fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();

  const optimizedMeta = await sharp(optimized, { limitInputPixels: false }).metadata();
  const previewMeta = await sharp(preview, { limitInputPixels: false }).metadata();
  const optimizedWidth = Number(optimizedMeta.width || width || 0);
  const optimizedHeight = Number(optimizedMeta.height || height || 0);
  const previewWidth = Number(previewMeta.width || width || 0);
  const previewHeight = Number(previewMeta.height || height || 0);

  const originalKey = `${basePrefix}/preview.${ext}`;
  const previewKey = `${basePrefix}/preview-2048.jpg`;
  const thumbnailKey = `${basePrefix}/thumb.webp`;
  const tilesPrefix = `${basePrefix}/tiles`;

  await putBuffer(bucket, originalKey, optimized, ext === 'webp' ? 'image/webp' : 'image/jpeg');
  await putBuffer(bucket, previewKey, preview, 'image/jpeg');
  await putBuffer(bucket, thumbnailKey, thumbnail, 'image/webp');

  const tileManifest = {
    type: 'equirectangular',
    source: objectUrl(previewKey),
    fallbackSource: objectUrl(originalKey),
    width: previewWidth,
    height: previewHeight,
    fallbackWidth: optimizedWidth,
    fallbackHeight: optimizedHeight,
    tileSize: DEFAULT_TILE_SIZE,
    multiResolution: false,
    generator: 'sharp-fallback',
    readyForMarzipanoTools: true,
  };

  return {
    bucket,
    originalKey,
    previewKey,
    thumbnailKey,
    tilesPrefix,
    imageUrl: objectUrl(originalKey),
    previewUrl: objectUrl(previewKey),
    thumbnailUrl: objectUrl(thumbnailKey),
    tilesPath: objectUrl(previewKey),
    tileManifest,
    metadata: {
      originalName: file.originalname || '',
      mimetype: file.mimetype || '',
      size: file.size || optimized.length,
      width,
      height,
      previewWidth,
      previewHeight,
      optimizedWidth,
      optimizedHeight,
      processedAt: new Date().toISOString(),
      source: 'virtual_tours_upload',
    },
  };
}

module.exports = {
  processPanoramaUpload,
};
