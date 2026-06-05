const path = require('path');
const sharp = require('sharp');
const minio = require('../../minio');

const DEFAULT_TILE_SIZE = 512;

const MIME_EXTENSION = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function getFileExt(file) {
  return String(path.extname(file.originalname || '') || '').toLowerCase().replace('.', '');
}

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

function resolveImageExtension(file) {
  const mimetype = String(file.mimetype || '').toLowerCase();
  if (MIME_EXTENSION[mimetype]) return MIME_EXTENSION[mimetype];

  const ext = getFileExt(file);
  if (ext === 'insp') return 'jpg';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return ext === 'jpeg' ? 'jpg' : ext;
  return 'jpg';
}

async function processPanoramaUpload({ file, tourId, sceneId }) {
  if (!file || !file.buffer) {
    const error = new Error('panorama file required');
    error.statusCode = 400;
    throw error;
  }

  if (getFileExt(file) !== 'insp' && !/^image\/(jpeg|jpg|webp|png)$/i.test(String(file.mimetype || ''))) {
    const error = new Error('Only JPG, PNG, WebP or .insp (Insta360) panoramas are supported');
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
  const ext = resolveImageExtension(file);
  const basePrefix = `tours/${safeTourId}/${safeSceneId}`;

  const input = sharp(file.buffer, { limitInputPixels: false });
  const meta = await input.metadata();
  const width = Number(meta.width || 0);
  const height = Number(meta.height || 0);

  const preview = await sharp(file.buffer, { limitInputPixels: false })
    .resize({ width: 2048, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  const thumbnail = await sharp(file.buffer, { limitInputPixels: false })
    .resize({ width: 640, height: 360, fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();

  const previewMeta = await sharp(preview, { limitInputPixels: false }).metadata();
  const previewWidth = Number(previewMeta.width || width || 0);
  const previewHeight = Number(previewMeta.height || height || 0);

  const originalKey = `${basePrefix}/original.${ext}`;
  const previewKey = `${basePrefix}/preview-2048.jpg`;
  const thumbnailKey = `${basePrefix}/thumb.webp`;
  const tilesPrefix = `${basePrefix}/tiles`;
  const originalContentType = MIME_EXTENSION[String(file.mimetype || '').toLowerCase()]
    ? String(file.mimetype || '').toLowerCase().replace('image/jpg', 'image/jpeg')
    : `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  await putBuffer(bucket, originalKey, file.buffer, originalContentType);
  await putBuffer(bucket, previewKey, preview, 'image/jpeg');
  await putBuffer(bucket, thumbnailKey, thumbnail, 'image/webp');

  const tileManifest = {
    type: 'equirectangular',
    source: objectUrl(originalKey),
    fallbackSource: objectUrl(previewKey),
    width,
    height,
    previewWidth,
    previewHeight,
    tileSize: DEFAULT_TILE_SIZE,
    multiResolution: false,
    generator: 'original-preserved',
    readyForMarzipanoTools: true,
    originalPreserved: true,
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
      size: file.size || file.buffer.length,
      width,
      height,
      previewWidth,
      previewHeight,
      originalWidth: width,
      originalHeight: height,
      originalPreserved: true,
      processedAt: new Date().toISOString(),
      source: 'virtual_tours_upload',
    },
  };
}

module.exports = {
  processPanoramaUpload,
};
