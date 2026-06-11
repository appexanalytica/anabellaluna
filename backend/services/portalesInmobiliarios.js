const crypto = require('crypto');
const GlobalConfig = require('../models/GlobalConfig');
const Propiedad = require('../models/Propiedad');

// ── Registro de portales ──────────────────────────────────────────────────────
// Mecanismo de integración según documentación oficial de cada portal:
//  - Zonaprop:   feed XML habilitado por el equipo de integraciones del portal
//                (https://help.zonaprop.com.ar → "¿Qué es una integración y cómo la efectúo?")
//  - Argenprop:  feed XML vía software de gestión registrado ante el portal
//  - Proppit:    feed XML formato Trovit (Lifull Connect) — spec oficial:
//                https://info.proppit.com/en/support/how-to-prepare-an-xml-file-for-proppit
//                Publica también en Properati, Mitula, Nestoria, iCasas y Nuroa.
//  - Inmoclick:  plan "carga desde sistema externo" — el portal consume el feed del CRM
//  - Doomos:     agregador, consume feeds formato Trovit
//  - Regionales: feed XML genérico acordado con el contacto comercial del portal
//
// formato: 'generic' (XML detallado en español) | 'trovit' (spec Trovit/Proppit)

const PORTALES = [
  {
    key: 'zonaprop',
    nombre: 'Zonaprop',
    descripcion: 'Portal líder en Argentina (Grupo QuintoAndar)',
    sitio: 'https://www.zonaprop.com.ar',
    docsUrl: 'https://help.zonaprop.com.ar/s/article/Qu%C3%A9-es-una-integraci%C3%B3n-y-c%C3%B3mo-la-efect%C3%BAo',
    formato: 'generic',
    fase: 1,
    color: '#FF7B00',
    pasos: [
      'Tener cuenta activa de inmobiliaria en Zonaprop',
      'Activar el portal aquí y copiar la URL del feed',
      'Enviar la URL del feed a tu ejecutivo de cuenta de Zonaprop solicitando la integración',
      'El equipo de integraciones de Zonaprop valida el feed y habilita la sincronización automática',
    ],
  },
  {
    key: 'argenprop',
    nombre: 'Argenprop',
    descripcion: 'Portal inmobiliario del Grupo Clarín',
    sitio: 'https://www.argenprop.com',
    docsUrl: 'https://www.argenprop.com/publicar/inmobiliaria',
    formato: 'generic',
    fase: 1,
    color: '#00A650',
    pasos: [
      'Tener cuenta de inmobiliaria activa en Argenprop',
      'Activar el portal aquí y copiar la URL del feed',
      'Solicitar la integración a tu ejecutivo de Argenprop con la URL del feed',
      'Importante: al habilitar la integración, Argenprop da de baja los avisos cargados manualmente — verificá que toda tu cartera esté en el CRM antes',
    ],
  },
  {
    key: 'proppit',
    nombre: 'Proppit',
    descripcion: 'Red Lifull Connect: Properati, Mitula, Nestoria, iCasas y Nuroa',
    sitio: 'https://proppit.com',
    docsUrl: 'https://info.proppit.com/en/support/how-to-prepare-an-xml-file-for-proppit',
    formato: 'trovit',
    fase: 1,
    color: '#5A2EE5',
    pasos: [
      'Crear cuenta en Proppit (proppit.com)',
      'Activar el portal aquí y copiar la URL del feed (formato Trovit, según spec oficial de Proppit)',
      'Cargar la URL del feed en Proppit o enviarla a tu account manager',
      'Las propiedades se replican automáticamente en Properati, Mitula, Nestoria, iCasas y Nuroa',
    ],
  },
  {
    key: 'inmuebles-clarin',
    nombre: 'Inmuebles Clarín',
    descripcion: 'Clasificados inmobiliarios de Clarín',
    sitio: 'https://inmuebles.clarin.com',
    docsUrl: 'https://www.argenprop.com/publicar/inmobiliaria',
    formato: 'generic',
    fase: 1,
    color: '#D32F2F',
    pasos: [
      'Los clasificados de Clarín se gestionan a través de la red Argenprop (mismo grupo)',
      'Activar el portal aquí y copiar la URL del feed',
      'Solicitar al ejecutivo de Argenprop/Clarín la inclusión en los clasificados del diario',
    ],
  },
  {
    key: 'inmoclick',
    nombre: 'Inmoclick',
    descripcion: 'Portal líder en Mendoza y el interior del país',
    sitio: 'https://inmoclick.com',
    docsUrl: 'https://inmoclick.com/elegir-usuario',
    formato: 'generic',
    fase: 1,
    color: '#1565C0',
    pasos: [
      'Contratar en Inmoclick un plan con "carga desde sistema externo"',
      'Activar el portal aquí y copiar la URL del feed',
      'Informar a Inmoclick la URL del feed para que la registren como origen de datos',
    ],
  },
  {
    key: 'doomos',
    nombre: 'Doomos',
    descripcion: 'Agregador inmobiliario con cobertura nacional',
    sitio: 'https://ar.doomos.com',
    docsUrl: 'https://ar.doomos.com',
    formato: 'trovit',
    fase: 1,
    color: '#2E7D32',
    pasos: [
      'Activar el portal aquí y copiar la URL del feed (formato Trovit)',
      'Contactar a Doomos Argentina solicitando el alta de la inmobiliaria con la URL del feed',
      'Doomos indexa el feed periódicamente y publica los avisos en su buscador',
    ],
  },
  {
    key: 'inmuebles-lacapital',
    nombre: 'Inmuebles La Capital',
    descripcion: 'Clasificados del diario La Capital (Rosario)',
    sitio: 'https://inmuebles.lacapital.com.ar',
    docsUrl: 'https://inmuebles.lacapital.com.ar',
    formato: 'generic',
    fase: 2,
    color: '#0277BD',
    pasos: [
      'Tener convenio comercial con clasificados de La Capital',
      'Activar el portal aquí y copiar la URL del feed',
      'Enviar la URL del feed al contacto comercial del diario para habilitar la carga automática',
    ],
  },
  {
    key: 'propia',
    nombre: 'Propia',
    descripcion: 'Portal inmobiliario argentino',
    sitio: 'https://propia.com.ar',
    docsUrl: 'https://propia.com.ar',
    formato: 'generic',
    fase: 2,
    color: '#6A1B9A',
    pasos: [
      'Registrar la inmobiliaria en Propia',
      'Activar el portal aquí y copiar la URL del feed',
      'Solicitar al equipo de Propia la integración automática con la URL del feed',
    ],
  },
  {
    key: 'liderprop',
    nombre: 'Liderprop',
    descripcion: 'Portal inmobiliario regional',
    sitio: 'https://www.liderprop.com',
    docsUrl: 'https://www.liderprop.com',
    formato: 'generic',
    fase: 2,
    color: '#EF6C00',
    pasos: [
      'Registrar la inmobiliaria en Liderprop',
      'Activar el portal aquí y copiar la URL del feed',
      'Enviar la URL del feed al contacto de Liderprop para habilitar la sincronización',
    ],
  },
  {
    key: 'buscadorprop',
    nombre: 'BuscadorProp',
    descripcion: 'Portal exclusivo de publicación inmobiliaria',
    sitio: 'https://www.buscadorprop.com.ar',
    docsUrl: 'https://www.buscadorprop.com.ar',
    formato: 'generic',
    fase: 2,
    color: '#00838F',
    pasos: [
      'Registrar la inmobiliaria en BuscadorProp',
      'Activar el portal aquí y copiar la URL del feed',
      'Solicitar la integración automática enviando la URL del feed',
    ],
  },
  {
    key: 'buscainmueble',
    nombre: 'Buscainmueble',
    descripcion: 'Buscador de propiedades en Argentina',
    sitio: 'https://www.buscainmueble.com',
    docsUrl: 'https://www.buscainmueble.com',
    formato: 'generic',
    fase: 2,
    color: '#C62828',
    pasos: [
      'Registrar la inmobiliaria en Buscainmueble',
      'Activar el portal aquí y copiar la URL del feed',
      'Enviar la URL del feed al equipo comercial para habilitar la carga automática',
    ],
  },
  {
    key: 'terrenosyquintas',
    nombre: 'Terrenos y Quintas',
    descripcion: 'Portal especializado en terrenos y quintas',
    sitio: 'https://www.terrenosyquintas.com.ar',
    docsUrl: 'https://www.terrenosyquintas.com.ar',
    formato: 'generic',
    fase: 2,
    color: '#558B2F',
    pasos: [
      'Registrar la inmobiliaria en Terrenos y Quintas',
      'Activar el portal aquí y copiar la URL del feed',
      'Solicitar la integración enviando la URL del feed al contacto del portal',
    ],
  },
];

function getPortalDef(key) {
  return PORTALES.find((p) => p.key === key) || null;
}

// ── Config por portal (GlobalConfig key: 'portal_<key>') ─────────────────────
// { enabled, feedToken, accountId, accountEmail, contactEmail, contactPhone,
//   inmobiliariaNombre, stats: { lastPulledAt, pullCount } }

function configKey(key) {
  return `portal_${key}`;
}

function newFeedToken() {
  return crypto.randomBytes(16).toString('hex');
}

async function getPortalConfig(key) {
  const raw = await GlobalConfig.getValue(configKey(key), null);
  if (!raw) {
    return {
      enabled: false,
      feedToken: '',
      accountId: '',
      accountEmail: '',
      contactEmail: '',
      contactPhone: '',
      inmobiliariaNombre: '',
      stats: { lastPulledAt: null, pullCount: 0 },
    };
  }
  return {
    enabled: !!raw.enabled,
    feedToken: raw.feedToken || '',
    accountId: raw.accountId || '',
    accountEmail: raw.accountEmail || '',
    contactEmail: raw.contactEmail || '',
    contactPhone: raw.contactPhone || '',
    inmobiliariaNombre: raw.inmobiliariaNombre || '',
    stats: raw.stats || { lastPulledAt: null, pullCount: 0 },
  };
}

async function savePortalConfig(key, patch) {
  const def = getPortalDef(key);
  if (!def) throw new Error(`Portal desconocido: ${key}`);
  const current = await getPortalConfig(key);
  const next = Object.assign({}, current, patch);
  // Garantizar token al activar por primera vez
  if (next.enabled && !next.feedToken) next.feedToken = newFeedToken();
  await GlobalConfig.setValue(configKey(key), next, `Configuración portal ${def.nombre}`);
  return next;
}

async function deletePortalConfig(key) {
  await GlobalConfig.deleteOne({ key: configKey(key) });
}

async function regenerateFeedToken(key) {
  return savePortalConfig(key, { feedToken: newFeedToken() });
}

async function registerPull(key) {
  const current = await getPortalConfig(key);
  const stats = {
    lastPulledAt: new Date().toISOString(),
    pullCount: (current.stats && current.stats.pullCount ? current.stats.pullCount : 0) + 1,
  };
  await savePortalConfig(key, { stats });
}

async function listPortalesWithStatus() {
  const result = [];
  for (const def of PORTALES) {
    const cfg = await getPortalConfig(def.key);
    result.push({
      key: def.key,
      nombre: def.nombre,
      descripcion: def.descripcion,
      sitio: def.sitio,
      docsUrl: def.docsUrl,
      formato: def.formato,
      fase: def.fase,
      color: def.color,
      pasos: def.pasos,
      enabled: cfg.enabled,
      configured: !!cfg.feedToken,
      feedToken: cfg.feedToken,
      stats: cfg.stats,
    });
  }
  return result;
}

// ── Normalización de Propiedad → datos de feed ───────────────────────────────

const SITE_ORIGIN = () => (process.env.SITE_ORIGIN || 'https://anabellaluna.com.ar').replace(/\/$/, '');

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function propImages(prop) {
  const m = prop.metadata || {};
  const raw = Array.isArray(m.imagenes) ? m.imagenes : [];
  return raw
    .map((img) => (typeof img === 'string' ? img : (img.url || img.src || '')))
    .filter(Boolean);
}

function normalizeProp(prop) {
  const m = prop.metadata || {};
  const operacion = String(m.operacion || '').toLowerCase();
  const esAlquiler = operacion.includes('alquiler');
  const slug = prop.slug || String(prop._id);
  return {
    id: String(prop._id),
    referencia: slug,
    url: `${SITE_ORIGIN()}/${esAlquiler ? 'rent' : 'buy'}/${slug}`,
    titulo: String(prop.title || '').trim(),
    descripcion: stripHtml(prop.description),
    tipo: String(m.tipo || 'Propiedad'),
    operacion: esAlquiler ? 'Alquiler' : 'Venta',
    operacionTrovit: esAlquiler ? 'for_rent' : 'for_sale',
    precio: Number(prop.price) || 0,
    moneda: String(prop.moneda || 'ARS').toUpperCase() === 'USD' ? 'USD' : 'ARS',
    direccion: String(prop.address || ''),
    barrio: String(m.barrio || ''),
    ciudad: String(m.ciudad || ''),
    provincia: String(m.provincia || ''),
    lat: m.lat ? Number(m.lat) : null,
    lng: m.lng ? Number(m.lng) : null,
    ambientes: m.ambientes ? Number(m.ambientes) : null,
    dormitorios: m.dormitorios ? Number(m.dormitorios) : null,
    banos: m.banos ? Number(m.banos) : null,
    cocheras: m.cocheras ? Number(m.cocheras) : null,
    superficieTotal: m.superficie ? Number(m.superficie) : null,
    superficieCubierta: m.superficieCubierta ? Number(m.superficieCubierta) : null,
    antiguedad: m.antiguedad ? String(m.antiguedad) : '',
    destacada: !!prop.featured,
    estado: String(prop.status || 'Disponible'),
    fechaAlta: prop.createdAt ? new Date(prop.createdAt).toISOString() : '',
    fechaActualizacion: prop.updatedAt ? new Date(prop.updatedAt).toISOString() : '',
    imagenes: propImages(prop),
  };
}

// ── Builders de XML ───────────────────────────────────────────────────────────

function xmlEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cdata(value) {
  // Cerrar secuencias "]]>" embebidas para mantener el CDATA válido
  return `<![CDATA[${String(value == null ? '' : value).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

function tag(name, value) {
  return `<${name}>${xmlEscape(value)}</${name}>`;
}

function tagCdata(name, value) {
  return `<${name}>${cdata(value)}</${name}>`;
}

// Feed genérico en español: estructura detallada que los portales argentinos
// (Zonaprop, Argenprop, Inmoclick y regionales) consumen al habilitar la
// integración con un software de gestión.
function buildGenericFeedXML(props, cfg) {
  const items = props.map((p) => {
    const lines = [];
    lines.push('  <propiedad>');
    lines.push(`    ${tag('id', p.id)}`);
    lines.push(`    ${tag('referencia', p.referencia)}`);
    lines.push(`    ${tag('url', p.url)}`);
    lines.push(`    ${tagCdata('titulo', p.titulo)}`);
    lines.push(`    ${tagCdata('descripcion', p.descripcion)}`);
    lines.push(`    ${tag('tipo', p.tipo)}`);
    lines.push(`    ${tag('operacion', p.operacion)}`);
    lines.push(`    <precio moneda="${xmlEscape(p.moneda)}">${xmlEscape(p.precio)}</precio>`);
    lines.push(`    ${tagCdata('direccion', p.direccion)}`);
    if (p.barrio) lines.push(`    ${tagCdata('barrio', p.barrio)}`);
    if (p.ciudad) lines.push(`    ${tagCdata('ciudad', p.ciudad)}`);
    if (p.provincia) lines.push(`    ${tagCdata('provincia', p.provincia)}`);
    if (p.lat != null && p.lng != null) {
      lines.push(`    ${tag('latitud', p.lat)}`);
      lines.push(`    ${tag('longitud', p.lng)}`);
    }
    if (p.ambientes != null) lines.push(`    ${tag('ambientes', p.ambientes)}`);
    if (p.dormitorios != null) lines.push(`    ${tag('dormitorios', p.dormitorios)}`);
    if (p.banos != null) lines.push(`    ${tag('banos', p.banos)}`);
    if (p.cocheras != null) lines.push(`    ${tag('cocheras', p.cocheras)}`);
    if (p.superficieTotal != null || p.superficieCubierta != null) {
      const total = p.superficieTotal != null ? ` total="${xmlEscape(p.superficieTotal)}"` : '';
      const cubierta = p.superficieCubierta != null ? ` cubierta="${xmlEscape(p.superficieCubierta)}"` : '';
      lines.push(`    <superficie unidad="m2"${total}${cubierta}/>`);
    }
    if (p.antiguedad) lines.push(`    ${tag('antiguedad', p.antiguedad)}`);
    lines.push(`    ${tag('estado', p.estado)}`);
    lines.push(`    ${tag('destacada', p.destacada ? 'true' : 'false')}`);
    if (p.fechaAlta) lines.push(`    ${tag('fecha_alta', p.fechaAlta)}`);
    if (p.fechaActualizacion) lines.push(`    ${tag('fecha_actualizacion', p.fechaActualizacion)}`);
    if (p.imagenes.length) {
      lines.push('    <imagenes>');
      p.imagenes.forEach((url, i) => {
        lines.push(`      <imagen orden="${i + 1}">${cdata(url)}</imagen>`);
      });
      lines.push('    </imagenes>');
    }
    lines.push('  </propiedad>');
    return lines.join('\n');
  });

  const header = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<propiedades sistema="Anabella Luna CRM" generado="${new Date().toISOString()}" total="${props.length}">`,
    '  <inmobiliaria>',
    `    ${tagCdata('nombre', cfg.inmobiliariaNombre || 'Anabella Luna Propiedades')}`,
    cfg.contactEmail ? `    ${tag('email', cfg.contactEmail)}` : '',
    cfg.contactPhone ? `    ${tag('telefono', cfg.contactPhone)}` : '',
    '  </inmobiliaria>',
  ].filter(Boolean);

  return `${header.join('\n')}\n${items.join('\n')}\n</propiedades>`;
}

// Feed formato Trovit: spec usada por Proppit (Lifull Connect) y Doomos.
// Referencia oficial: https://info.proppit.com/en/support/how-to-prepare-an-xml-file-for-proppit
function buildTrovitFeedXML(props, cfg) {
  const agency = cfg.inmobiliariaNombre || 'Anabella Luna Propiedades';
  const items = props.map((p) => {
    const lines = [];
    lines.push('  <ad>');
    lines.push(`    ${tagCdata('id', p.id)}`);
    lines.push(`    ${tagCdata('url', p.url)}`);
    lines.push(`    ${tagCdata('title', p.titulo)}`);
    lines.push(`    ${tagCdata('type', p.operacionTrovit)}`);
    lines.push(`    ${tagCdata('agency', agency)}`);
    if (cfg.contactEmail) lines.push(`    ${tagCdata('agency_email', cfg.contactEmail)}`);
    if (cfg.contactPhone) lines.push(`    ${tagCdata('agency_phone', cfg.contactPhone)}`);
    lines.push(`    ${tagCdata('content', p.descripcion)}`);
    lines.push(`    ${tagCdata('price', p.precio)}`);
    lines.push(`    ${tagCdata('currency', p.moneda)}`);
    lines.push(`    ${tagCdata('property_type', p.tipo)}`);
    if (p.direccion) lines.push(`    ${tagCdata('address', p.direccion)}`);
    if (p.ciudad) lines.push(`    ${tagCdata('city', p.ciudad)}`);
    if (p.barrio) lines.push(`    ${tagCdata('city_area', p.barrio)}`);
    if (p.provincia) lines.push(`    ${tagCdata('region', p.provincia)}`);
    if (p.lat != null && p.lng != null) {
      lines.push(`    ${tagCdata('latitude', p.lat)}`);
      lines.push(`    ${tagCdata('longitude', p.lng)}`);
    }
    if (p.dormitorios != null) lines.push(`    ${tagCdata('rooms', p.dormitorios)}`);
    if (p.banos != null) lines.push(`    ${tagCdata('bathrooms', p.banos)}`);
    if (p.cocheras != null) lines.push(`    ${tagCdata('parking', p.cocheras)}`);
    if (p.superficieTotal != null) {
      lines.push(`    <floor_area unit="meters">${cdata(p.superficieTotal)}</floor_area>`);
    }
    if (p.fechaActualizacion) lines.push(`    ${tagCdata('date', p.fechaActualizacion)}`);
    if (p.imagenes.length) {
      lines.push('    <pictures>');
      p.imagenes.forEach((url, i) => {
        lines.push('      <picture>');
        lines.push(`        ${tagCdata('picture_url', url)}`);
        lines.push(`        ${tagCdata('picture_title', `Foto ${i + 1}`)}`);
        lines.push('      </picture>');
      });
      lines.push('    </pictures>');
    }
    lines.push('  </ad>');
    return lines.join('\n');
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<trovit>\n${items.join('\n')}\n</trovit>`;
}

// ── Generación del feed por portal ───────────────────────────────────────────

async function buildFeed(key, { limit } = {}) {
  const def = getPortalDef(key);
  if (!def) throw new Error(`Portal desconocido: ${key}`);
  const cfg = await getPortalConfig(key);

  let query = Propiedad.find({ published: true }).sort({ updatedAt: -1 });
  if (limit) query = query.limit(Number(limit));
  const docs = await query.lean();
  const props = docs.map(normalizeProp);

  const xml = def.formato === 'trovit'
    ? buildTrovitFeedXML(props, cfg)
    : buildGenericFeedXML(props, cfg);

  return { xml, count: props.length, formato: def.formato };
}

module.exports = {
  PORTALES,
  getPortalDef,
  getPortalConfig,
  savePortalConfig,
  deletePortalConfig,
  regenerateFeedToken,
  registerPull,
  listPortalesWithStatus,
  buildFeed,
  normalizeProp,
  buildGenericFeedXML,
  buildTrovitFeedXML,
};
