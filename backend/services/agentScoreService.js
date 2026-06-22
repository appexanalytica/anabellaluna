/**
 * agentScoreService.js – Puntaje de desempeño compuesto por agente (0-100).
 *
 * Combina 7 categorías, cada una normalizada a 0-100 y ponderada según la
 * configuración (RewardConfig.scoring). Devuelve el score global + el desglose
 * por categoría para mostrarlo en el centro de mando de Agentes.
 *
 *   captacion    – propiedades exclusivas captadas (trimestral) vs meta
 *   ventas       – facturación/comisiones (trimestral) vs meta
 *   actividad    – citas + clientes cargados + interacciones (mensual) vs metas
 *   calidad      – completitud de carga de las propiedades (fotos, video, tour, mapa…)
 *   engagement   – uso de la app (logins, tiempo activo, días activos)
 *   conversion   – tasa de conversión + velocidad de cierre
 *   fidelizacion – seniority de fidelización + badge pre-listing
 *
 * Funciones puras (sin dependencia de Express ni de la request).
 */

// ── Defaults (espejo de RewardConfig.scoring para docs viejos sin la sección) ──
const DEFAULTS = {
  weights: { captacion: 20, ventas: 25, actividad: 15, calidad: 15, engagement: 10, conversion: 10, fidelizacion: 5 },
  activityTargets: { citasMensual: 10, clientesMensual: 8, interaccionesMensual: 30 },
  engagementTargets: { diasActivos: 40, logins: 40, horasActivas: 40 },
  quality: {
    fotosObjetivo: 6,
    weights: { fotos: 30, descripcion: 15, video: 15, tour: 15, geo: 15, direccion: 10 },
  },
  conversion: { diasCierreObjetivo: 60 },
};

const SENIORITY_SCORE = { none: 0, junior: 50, semi_senior: 75, senior: 100 };

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clamp01to100(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function ratioScore(value, target) {
  const t = num(target);
  if (t <= 0) return 0;
  return Math.max(0, Math.min(100, (num(value) / t) * 100));
}

/** Mezcla la config recibida con los defaults para tolerar campos faltantes. */
function resolveScoringConfig(cfg) {
  const s = (cfg && cfg.scoring) || {};
  return {
    weights: { ...DEFAULTS.weights, ...(s.weights || {}) },
    activityTargets: { ...DEFAULTS.activityTargets, ...(s.activityTargets || {}) },
    engagementTargets: { ...DEFAULTS.engagementTargets, ...(s.engagementTargets || {}) },
    quality: {
      fotosObjetivo: num(s.quality && s.quality.fotosObjetivo, DEFAULTS.quality.fotosObjetivo),
      weights: { ...DEFAULTS.quality.weights, ...((s.quality && s.quality.weights) || {}) },
    },
    conversion: { ...DEFAULTS.conversion, ...(s.conversion || {}) },
  };
}

// ── Completitud de una propiedad (0-100) ──────────────────────────────────────
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico', 'heic']);
function isImageDoc(doc) {
  if (!doc) return false;
  if (doc.mimetype && doc.mimetype.startsWith('image/')) return true;
  const ext = String(doc.nombre || '').split('.').pop().toLowerCase();
  return IMAGE_EXTS.has(ext);
}

/**
 * Completitud de carga de una propiedad.
 * ctx: { imageCount, hasTour }   qcfg: scoring.quality
 * Devuelve { score, parts } donde parts marca cada elemento presente.
 */
function propertyCompleteness(prop, ctx = {}, qcfg = DEFAULTS.quality) {
  const meta = (prop && prop.metadata) || {};
  const w = qcfg.weights || DEFAULTS.quality.weights;
  const fotosObjetivo = num(qcfg.fotosObjetivo, DEFAULTS.quality.fotosObjetivo) || 6;

  const fotos = num(ctx.imageCount != null ? ctx.imageCount : meta.fotos);
  const fotosScore = Math.min(1, fotos / fotosObjetivo);

  const descLen = String((prop && prop.description) || meta.descripcion || '').trim().length;
  const descScore = descLen >= 120 ? 1 : descLen >= 40 ? 0.5 : 0;

  const videoUrls = Array.isArray(meta.videoUrls)
    ? meta.videoUrls
    : (meta.videoUrl ? [meta.videoUrl] : []);
  const videoScore = videoUrls.filter(Boolean).length > 0 ? 1 : 0;

  const hasTourMeta = Boolean(meta.tourUrl || meta.recorridoVirtual || meta.matterportUrl || meta.tour360);
  const tourScore = (ctx.hasTour || hasTourMeta) ? 1 : 0;

  const lat = meta.lat != null ? meta.lat : (prop && prop.lat);
  const lng = meta.lng != null ? meta.lng : (prop && prop.lng);
  const geoScore = (lat != null && lat !== '' && lng != null && lng !== '') ? 1 : 0;

  const addr = String((prop && prop.address) || meta.direccion || '').trim();
  const dirScore = addr.length > 0 ? 1 : 0;

  const totalW = num(w.fotos) + num(w.descripcion) + num(w.video) + num(w.tour) + num(w.geo) + num(w.direccion);
  const sum = fotosScore * num(w.fotos)
    + descScore * num(w.descripcion)
    + videoScore * num(w.video)
    + tourScore * num(w.tour)
    + geoScore * num(w.geo)
    + dirScore * num(w.direccion);

  return {
    score: totalW > 0 ? clamp01to100((sum / totalW) * 100) : 0,
    parts: {
      fotos: Math.round(fotosScore * 100),
      descripcion: Math.round(descScore * 100),
      video: videoScore * 100,
      tour: tourScore * 100,
      geo: geoScore * 100,
      direccion: dirScore * 100,
    },
  };
}

/** Completitud promedio de un conjunto de propiedades ya resuelto (array de score 0-100). */
function averageCompleteness(scores) {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  return Math.round(scores.reduce((s, v) => s + num(v), 0) / scores.length);
}

// ── Score compuesto ───────────────────────────────────────────────────────────
/**
 * input: {
 *   capturesQuarterly, captureTargetQuarterly,
 *   revenueQuarterly, revenueTargetQuarterly,
 *   citasMes, clientesMes, interaccionesMes,
 *   formCompleteness,                       // 0-100
 *   engagement: { logins, activeDays, activeHours },
 *   tasaConversion,                         // 0-100
 *   diasPromCierre,
 *   seniority,                              // 'none'|'junior'|'semi_senior'|'senior'
 *   preListingActive,                       // bool
 * }
 */
function computeScore(input = {}, cfg = {}) {
  const sc = resolveScoringConfig(cfg);

  // 1) Captación
  const captacion = ratioScore(input.capturesQuarterly, input.captureTargetQuarterly);

  // 2) Ventas / facturación
  const ventas = ratioScore(input.revenueQuarterly, input.revenueTargetQuarterly);

  // 3) Actividad (promedio de 3 metas mensuales)
  const at = sc.activityTargets;
  const actividad = clamp01to100((
    ratioScore(input.citasMes, at.citasMensual)
    + ratioScore(input.clientesMes, at.clientesMensual)
    + ratioScore(input.interaccionesMes, at.interaccionesMensual)
  ) / 3);

  // 4) Calidad de carga
  const calidad = clamp01to100(num(input.formCompleteness));

  // 5) Engagement (promedio de 3 metas del período)
  const et = sc.engagementTargets;
  const eng = input.engagement || {};
  const engagement = clamp01to100((
    ratioScore(eng.activeDays, et.diasActivos)
    + ratioScore(eng.logins, et.logins)
    + ratioScore(eng.activeHours, et.horasActivas)
  ) / 3);

  // 6) Conversión & velocidad de cierre
  const objDias = num(sc.conversion.diasCierreObjetivo, 60) || 60;
  const dias = num(input.diasPromCierre);
  const speedScore = dias <= 0 ? 0 : Math.max(0, Math.min(100, (objDias / Math.max(dias, objDias)) * 100));
  const conversion = clamp01to100((clamp01to100(num(input.tasaConversion)) + speedScore) / 2);

  // 7) Fidelización & pre-listing
  const senScore = SENIORITY_SCORE[input.seniority] != null ? SENIORITY_SCORE[input.seniority] : 0;
  const preScore = input.preListingActive ? 100 : 0;
  const fidelizacion = clamp01to100((senScore + preScore) / 2);

  const breakdown = { captacion, ventas, actividad, calidad, engagement, conversion, fidelizacion };

  // Ponderación normalizada (tolera que los pesos no sumen 100)
  const w = sc.weights;
  const totalW = Object.values(w).reduce((s, v) => s + num(v), 0) || 1;
  const score = clamp01to100(
    Object.keys(breakdown).reduce((s, k) => s + breakdown[k] * num(w[k]), 0) / totalW,
  );

  return { score, breakdown, weights: w };
}

module.exports = {
  DEFAULTS,
  resolveScoringConfig,
  isImageDoc,
  propertyCompleteness,
  averageCompleteness,
  computeScore,
};
