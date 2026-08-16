/**
 * Normalizador — Traduce los objetos libres `metadata` a hechos comparables.
 *
 * Propiedad.metadata y Cliente.metadata son objetos sin esquema: el mismo dato
 * puede estar con distinta clave, con acento o sin acento, como número o como
 * texto ("120 m2", "USD 90.000"). El motor de matching no puede trabajar así.
 *
 * Este módulo es determinista y no usa IA: es la base sobre la que corre el
 * scoring. El perfil semántico (profileService) enriquece esto, no lo reemplaza.
 */

const { normalizeMoneda, toUSDSync } = require('./currency');

// ── Helpers de texto ──────────────────────────────────────────────────────────

/** Minúsculas sin acentos, para comparar claves y valores. */
function slug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Busca una clave en metadata probando variantes: con acento, sin acento,
 * camelCase o todo junto. Devuelve el primer valor no vacío.
 */
function pick(obj, ...keys) {
  if (!obj || typeof obj !== 'object') return undefined;

  const index = {};
  for (const k of Object.keys(obj)) index[slug(k)] = obj[k];

  for (const key of keys) {
    const direct = obj[key];
    if (direct !== undefined && direct !== null && direct !== '') return direct;

    const bySlug = index[slug(key)];
    if (bySlug !== undefined && bySlug !== null && bySlug !== '') return bySlug;
  }
  return undefined;
}

/**
 * Convierte a número tolerando formato argentino y unidades pegadas:
 * "1.200.000,50" → 1200000.5 · "120 m2" → 120 · "USD 90.000" → 90000
 */
function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value === null || value === undefined) return null;

  let s = String(value).trim().toLowerCase();
  if (!s) return null;

  // Las unidades se sacan antes de leer el número: en "120 m2" el 2 del m2 no
  // es parte de la cifra.
  s = s
    .replace(/m\s*[²2³3]/g, ' ')
    .replace(/\b(mts?|metros?|hect[aá]reas?|has?)\b/g, ' ');

  // Se toma el primer token numérico, así "USD 90.000" no arrastra la moneda.
  const match = s.match(/-?\d[\d.,]*/);
  if (!match) return null;
  s = match[0];

  const lastComma = s.lastIndexOf(',');
  const lastDot   = s.lastIndexOf('.');

  if (lastComma > -1 && lastDot > -1) {
    // El separador decimal es el que aparece último.
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (lastComma > -1) {
    // Una sola coma: decimal si deja 1 o 2 dígitos, si no es separador de miles.
    s = (s.length - lastComma - 1) <= 2 ? s.replace(',', '.') : s.replace(/,/g, '');
  } else if (lastDot > -1) {
    const decimals = s.length - lastDot - 1;
    if (decimals === 3 && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** true / false / null (no declarado) a partir de sí, no, 1, 0, etc. */
function toBool(value) {
  if (value === true || value === false) return value;
  if (value === null || value === undefined || value === '') return null;
  const s = slug(value);
  if (['si', 'sí', 'true', '1', 'yes', 'permitido', 'acepta'].includes(s)) return true;
  if (['no', 'false', '0', 'prohibido', 'no permitido'].includes(s)) return false;
  return null;
}

/** Convierte un valor suelto o una lista en array de strings limpios. */
function toList(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v || '').trim()).filter(Boolean);
  }
  if (value === null || value === undefined || value === '') return [];

  return String(value)
    .split(/[,;/|]| y (?=[A-ZÁÉÍÓÚa-záéíóú])/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Zonas de interés: acepta el array nuevo o el texto único viejo.
 * La primera es la principal.
 */
function normalizeZonas(metadata) {
  const arr = pick(metadata, 'zonasInteres', 'zonasInteres');
  if (Array.isArray(arr) && arr.length) return toList(arr);

  const single = pick(metadata, 'zonaInteres', 'zona', 'zonasInteres');
  return toList(single);
}

// ── Operación y tipo ──────────────────────────────────────────────────────────

/** 'venta' | 'alquiler' — lo único que no puede cruzarse jamás. */
function normalizeOperacion(value) {
  const s = slug(value);
  if (!s) return null;
  if (s.includes('alquil') || s.includes('renta') || s.includes('rent')) return 'alquiler';
  if (s.includes('vent') || s.includes('vend') || s.includes('sale') || s.includes('compra')) return 'venta';
  return null;
}

/** Tipo de propiedad reducido a familias comparables. */
function normalizeTipo(value) {
  const s = slug(value);
  if (!s) return null;
  if (s.includes('departamento') || s.includes('depto') || s.includes('apartament')) return 'departamento';
  if (s.includes('casa') || s.includes('chalet') || s.includes('vivienda')) return 'casa';
  if (s.includes('ph')) return 'ph';
  if (s.includes('lote') || s.includes('terreno') || s.includes('fraccion')) return 'lote';
  if (s.includes('local') || s.includes('comercial')) return 'local';
  if (s.includes('oficina')) return 'oficina';
  if (s.includes('galpon') || s.includes('deposito')) return 'galpon';
  if (s.includes('campo') || s.includes('quinta') || s.includes('chacra')) return 'campo';
  if (s.includes('cochera')) return 'cochera';
  return s;
}

/** Tipo de cliente: define qué pesos usa el scoring. */
function normalizeTipoCliente(value) {
  const s = slug(value);
  if (s.includes('invers')) return 'inversor';
  if (s.includes('inquilin') || s.includes('alquil')) return 'inquilino';
  if (s.includes('propietar') || s.includes('vendedor')) return 'propietario';
  return 'comprador';
}

// ── Propiedad ─────────────────────────────────────────────────────────────────

/**
 * Hechos comparables de una propiedad.
 *
 * @param {object} prop  documento de Propiedad (lean)
 * @param {object} rate  cotización ya resuelta (currency.getRate())
 */
function propertyFacts(prop, rate = null) {
  const md = (prop && prop.metadata) || {};

  const precio  = toNumber(prop?.price) ?? toNumber(pick(md, 'precio', 'precioOferta'));
  const moneda  = normalizeMoneda(prop?.moneda || pick(md, 'moneda'));
  const operacion = normalizeOperacion(pick(md, 'operacion', 'tipoOperacion'));

  const m2Cubierta = toNumber(pick(md, 'm2Cubiertos', 'superficieCubierta', 'supCubierta'));
  const m2Total    = toNumber(pick(md, 'm2Totales', 'superficieTotal', 'supTotal', 'superficie'));

  const amenities = toList(pick(md, 'amenities', 'caracteristicas', 'servicios'));

  return {
    id: String(prop?._id || prop?.id || ''),
    titulo: prop?.title || pick(md, 'titulo') || '',
    slug: prop?.slug || '',
    agenteId: String(prop?.agentId || pick(md, 'agenteId') || ''),

    operacion,
    tipo: normalizeTipo(pick(md, 'tipo', 'categoria', 'tipoEstructura')),

    precio,
    moneda,
    precioUSD: toUSDSync(precio, moneda, rate),

    // Ubicación
    barrio:    pick(md, 'barrio') || '',
    ciudad:    pick(md, 'ciudad') || '',
    provincia: pick(md, 'provincia') || '',
    direccion: prop?.address || pick(md, 'direccion', 'calle') || '',
    lat: toNumber(pick(md, 'lat')),
    lng: toNumber(pick(md, 'lng')),

    // Tipología
    ambientes:   toNumber(pick(md, 'ambientes')),
    dormitorios: toNumber(pick(md, 'dormitorios')),
    banos:       toNumber(pick(md, 'baños', 'banos')),
    cocheras:    toNumber(pick(md, 'cocheras')),

    // Superficie
    m2Cubierta,
    m2Total: m2Total ?? m2Cubierta,

    // Estado y disponibilidad
    estado: prop?.status || pick(md, 'estado') || 'Disponible',
    publicada: prop?.published !== false,
    antiguedad: toNumber(pick(md, 'antiguedad')),
    anioConstruccion: toNumber(pick(md, 'anioConstruccion')),
    disponibleDesde: pick(md, 'disponibleDesde') || null,

    // Costos y condiciones del alquiler
    expensas: toNumber(pick(md, 'expensas', 'expensasMensuales')),
    amoblado: toBool(pick(md, 'amoblado')),
    mascotas: toBool(pick(md, 'mascotas', 'aceptaMascotas', 'petFriendly')),

    amenities,
    descripcion: prop?.description || pick(md, 'descripcion') || '',
    notasInternas: pick(md, 'comentariosInternos') || '',

    exclusiva: !!prop?.exclusiva,
    destacada: !!prop?.featured,
    creada: prop?.createdAt || null,
  };
}

// ── Cliente ───────────────────────────────────────────────────────────────────

/**
 * Requerimientos comparables de un cliente.
 *
 * El presupuesto viene como un número único. El rango se deriva: la gente mira
 * bastante por debajo de su tope y se estira un poco por arriba. Si el perfil
 * semántico encontró un rango declarado en las notas, ese pisa al derivado.
 */
const PRESUPUESTO_MIN_FACTOR  = 0.75;
const PRESUPUESTO_MAX_FACTOR  = 1.15;
const PRESUPUESTO_CORTE_DURO  = 1.20;

function clientFacts(cliente, rate = null) {
  const md = (cliente && cliente.metadata) || {};

  const tipoCliente = normalizeTipoCliente(pick(md, 'tipoCliente', 'tipo'));
  const presupuesto = toNumber(pick(md, 'presupuesto'));
  const moneda      = normalizeMoneda(pick(md, 'moneda') || 'USD');
  const presupuestoUSD = toUSDSync(presupuesto, moneda, rate);

  const operacion = tipoCliente === 'inquilino' ? 'alquiler' : 'venta';

  return {
    id: String(cliente?._id || cliente?.id || ''),
    nombre: cliente?.nombre || '',
    agenteId: String(cliente?.agenteId || ''),

    tipoCliente,
    estado: pick(md, 'estado') || 'Lead',
    operacion,

    presupuesto,
    moneda,
    presupuestoUSD,
    ...derivarRangoPresupuesto(presupuestoUSD),

    zonas: normalizeZonas(md),
    ciudad:    pick(md, 'ciudad') || '',
    provincia: pick(md, 'provincia') || '',

    tipoPropiedad: normalizeTipo(pick(md, 'tipoPropiedad')),
    ambientes:   toNumber(pick(md, 'ambientes')),
    dormitorios: toNumber(pick(md, 'dormitorios')),
    banos:       toNumber(pick(md, 'baños', 'banos')),

    m2Cubierta: toNumber(pick(md, 'superficieCubierta')),
    m2Total:    toNumber(pick(md, 'superficieTotal')),

    caracteristicas: toList(pick(md, 'caracteristicas')),

    // Condiciones del alquiler
    expensasMaximas: toNumber(pick(md, 'expensasMaximas')),
    mascotas: toBool(pick(md, 'mascotas')),
    amoblado: toBool(pick(md, 'amoblado')),
    fechaMudanza: pick(md, 'fechaMudanza') || null,
    garantia: pick(md, 'garantia') || '',

    // Inversor
    objetivoInversion: pick(md, 'objetivoInversion') || '',
    rentabilidadEsperada: toNumber(pick(md, 'rentabilidadEsperada')),
    estadoPreferidoInversion: pick(md, 'estadoPreferidoInversion') || '',

    scoring: toNumber(pick(md, 'scoring')) ?? 50,
    origen: pick(md, 'origen') || '',
    notas: cliente?.notas || pick(md, 'notas') || '',
  };
}

/**
 * Rango efectivo de búsqueda a partir del presupuesto declarado.
 */
function derivarRangoPresupuesto(presupuestoUSD) {
  if (!Number.isFinite(presupuestoUSD) || presupuestoUSD <= 0) {
    return {
      presupuestoRefUSD: null,
      presupuestoMinUSD: null,
      presupuestoMaxUSD: null,
      presupuestoCorteUSD: null,
      presupuestoOrigen: 'sin_dato',
    };
  }
  return {
    // La referencia es el número que dijo el cliente: arriba de eso ya se estira.
    presupuestoRefUSD:  presupuestoUSD,
    presupuestoMinUSD:  presupuestoUSD * PRESUPUESTO_MIN_FACTOR,
    presupuestoMaxUSD:  presupuestoUSD * PRESUPUESTO_MAX_FACTOR,
    presupuestoCorteUSD: presupuestoUSD * PRESUPUESTO_CORTE_DURO,
    presupuestoOrigen: 'derivado',
  };
}

/**
 * Aplica el rango que el perfil semántico haya extraído de las notas.
 * Un rango dicho por el cliente le gana a uno derivado con una fórmula.
 */
function aplicarRangoDeclarado(facts, rangoDeclarado) {
  const min = toNumber(rangoDeclarado?.min);
  const max = toNumber(rangoDeclarado?.max);
  if (!Number.isFinite(max) || max <= 0) return facts;

  return {
    ...facts,
    // Con un rango dicho por el cliente, el techo del rango es la referencia.
    presupuestoRefUSD: max,
    presupuestoMinUSD: Number.isFinite(min) && min > 0 ? min : max * PRESUPUESTO_MIN_FACTOR,
    presupuestoMaxUSD: max,
    presupuestoCorteUSD: max * (PRESUPUESTO_CORTE_DURO / PRESUPUESTO_MAX_FACTOR),
    presupuestoOrigen: 'declarado',
  };
}

module.exports = {
  slug,
  pick,
  toNumber,
  toBool,
  toList,
  normalizeZonas,
  normalizeOperacion,
  normalizeTipo,
  normalizeTipoCliente,
  propertyFacts,
  clientFacts,
  derivarRangoPresupuesto,
  aplicarRangoDeclarado,
  PRESUPUESTO_CORTE_DURO,
};
