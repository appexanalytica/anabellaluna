/**
 * Match Service — Orquesta el cruce entre la cartera y los clientes.
 *
 * Dos direcciones, y las dos importan:
 *   clienteAPropiedades  → qué le puedo mostrar a este cliente
 *   propiedadAClientes   → a quién le sirve esta captación nueva
 *
 * La segunda es la que más plata genera: entra una propiedad y el sistema
 * avisa que hay tres clientes esperando eso desde hace semanas.
 *
 * Visibilidad (decisión del negocio): un agente ve propiedades de TODA la
 * cartera para sus clientes, con el captador a la vista, pero solo ve SUS
 * clientes. Se comparte la propiedad, no los datos del propietario.
 */

const Propiedad = require('../../models/Propiedad');
const Cliente = require('../../models/Cliente');
const ClientInteraction = require('../../models/ClientInteraction');
const EntityProfile = require('../../models/EntityProfile');
const MatchRecommendation = require('../../models/MatchRecommendation');

const { contentHash } = require('../ai/embeddings');
const explainService = require('./explainService');
const currency = require('./currency');
const normalize = require('./normalize');
const scoring = require('./scoringEngine');
const { getPesos, pesosPara } = require('./weights');
const profileService = require('./profileService');

const MAX_CANDIDATOS = 3000;
const CACHE_TTL_MS = 5 * 60 * 1000;

const CAMPOS_PROPIEDAD =
  '_id title slug address description price moneda status published metadata agentId exclusiva featured createdAt';
const CAMPOS_CLIENTE = '_id nombre email telefono agenteId notas metadata createdAt';

// ── Caché de vectores ─────────────────────────────────────────────────────────
// Los embeddings son 1536 números por entidad. Traerlos de la base en cada
// consulta es caro al pedo: cambian solo cuando se regenera un perfil.

const _vectores = {
  propiedad: { at: 0, map: new Map() },
  cliente:   { at: 0, map: new Map() },
};

async function vectoresDe(entityType) {
  const cache = _vectores[entityType];
  if (cache.map.size && Date.now() - cache.at < CACHE_TTL_MS) return cache.map;

  const perfiles = await EntityProfile
    .find({ entityType, 'embedding.0': { $exists: true } })
    .select('entityId embedding')
    .lean();

  const map = new Map();
  for (const p of perfiles) map.set(String(p.entityId), p.embedding);

  cache.map = map;
  cache.at = Date.now();
  return map;
}

/** Invalida la caché cuando se regenera un perfil. */
function invalidarVectores(entityType) {
  if (entityType && _vectores[entityType]) {
    _vectores[entityType] = { at: 0, map: new Map() };
    return;
  }
  _vectores.propiedad = { at: 0, map: new Map() };
  _vectores.cliente   = { at: 0, map: new Map() };
}

// ── Contexto de scoring ───────────────────────────────────────────────────────

/**
 * Qué zonas y tipologías ya miró este cliente.
 * Lo que visitó pesa más que lo que declaró en la ficha.
 */
async function historialCliente(clienteId, rate) {
  const interacciones = await ClientInteraction
    .find({ clienteId, propiedadId: { $ne: null } })
    .select('propiedadId tipo nivelInteres')
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  if (!interacciones.length) return null;

  const ids = [...new Set(interacciones.map((i) => String(i.propiedadId)).filter(Boolean))];
  if (!ids.length) return null;

  const props = await Propiedad.find({ _id: { $in: ids } }).select(CAMPOS_PROPIEDAD).lean();

  const barrios = new Set();
  const tipos = new Set();
  const vistas = new Set();

  for (const p of props) {
    const f = normalize.propertyFacts(p, rate);
    if (f.barrio) barrios.add(normalize.slug(f.barrio));
    if (f.tipo) tipos.add(f.tipo);
    vistas.add(String(p._id));
  }

  return {
    barrios: [...barrios],
    tipos: [...tipos],
    yaVistas: vistas,
  };
}

/** Mediana de precio por m2 por zona, calculada sobre la propia cartera. */
function medianasPrecioM2(factsList) {
  const porZona = {};

  for (const f of factsList) {
    const m2 = f.m2Cubierta || f.m2Total;
    if (!m2 || !f.precioUSD) continue;
    const zona = normalize.slug(f.barrio) || normalize.slug(f.ciudad);
    if (!zona) continue;
    (porZona[zona] = porZona[zona] || []).push(f.precioUSD / m2);
  }

  const out = {};
  for (const [zona, valores] of Object.entries(porZona)) {
    if (valores.length < 3) continue; // con menos de 3 no hay mediana que valga
    valores.sort((a, b) => a - b);
    const mid = Math.floor(valores.length / 2);
    out[zona] = valores.length % 2 ? valores[mid] : (valores[mid - 1] + valores[mid]) / 2;
  }
  return out;
}

// ── Dirección 1: cliente → propiedades ────────────────────────────────────────

/**
 * Propiedades sugeridas para un cliente.
 *
 * @param {string} clienteId
 * @param {{limit?: number, minScore?: number, incluirVetadas?: boolean}} opts
 */
async function clienteAPropiedades(clienteId, { limit = 10, minScore = 50, incluirVetadas = false } = {}) {
  const rate = await currency.getRate();
  const pesos = await getPesos();

  const cliente = await Cliente.findById(clienteId).select(CAMPOS_CLIENTE).lean();
  if (!cliente) throw Object.assign(new Error('Cliente no encontrado'), { statusCode: 404 });

  let cliFacts = normalize.clientFacts(cliente, rate);

  // El perfil del cliente se genera al vuelo si falta: es un solo llamado.
  const perfilCliente = await profileService.ensureProfile('cliente', clienteId);
  if (perfilCliente?.presupuestoDeclarado?.max) {
    cliFacts = normalize.aplicarRangoDeclarado(cliFacts, perfilCliente.presupuestoDeclarado);
  }

  // El tipo de operación vive en metadata, que no tiene índice: se filtra en el
  // veto. Acá se acota por lo que sí está indexado.
  const filtro = { published: true, status: 'Disponible' };

  const propiedades = await Propiedad.find(filtro).select(CAMPOS_PROPIEDAD).limit(MAX_CANDIDATOS).lean();
  const vectores = await vectoresDe('propiedad');
  const historial = await historialCliente(clienteId, rate);

  const factsList = propiedades.map((p) => normalize.propertyFacts(p, rate));
  const medianas = medianasPrecioM2(factsList);

  const embCli = perfilCliente?.embedding || [];
  const pesosCliente = pesosPara(pesos, cliFacts.tipoCliente);

  const resultados = [];

  for (let i = 0; i < propiedades.length; i += 1) {
    const propFacts = factsList[i];

    const evaluacion = scoring.evaluar(propFacts, cliFacts, pesosCliente, {
      embProp: vectores.get(propFacts.id) || [],
      embCli,
      historialCliente: historial,
      medianaPrecioM2: medianas,
    });

    if (evaluacion.veto) {
      if (incluirVetadas) {
        resultados.push({ propiedad: propFacts, ...evaluacion });
      }
      continue;
    }

    if (evaluacion.score < minScore) continue;

    resultados.push({
      propiedad: propFacts,
      cliente: cliFacts,
      ...evaluacion,
      yaVista: historial?.yaVistas?.has(propFacts.id) || false,
    });
  }

  resultados.sort((a, b) => b.score - a.score);

  return {
    cliente: cliFacts,
    perfil: resumenPerfil(perfilCliente),
    cotizacion: { configurada: rate.configurada, valor: rate.valor, fecha: rate.fecha, vencida: rate.vencida },
    evaluadas: propiedades.length,
    matches: resultados.slice(0, limit),
  };
}

// ── Dirección 2: propiedad → clientes ─────────────────────────────────────────

/**
 * Clientes a los que les puede servir una propiedad.
 *
 * @param {string} propiedadId
 * @param {{limit?: number, minScore?: number, agenteId?: string}} opts
 *        agenteId acota a la cartera de clientes de ese agente (vacío = admin).
 */
async function propiedadAClientes(propiedadId, { limit = 10, minScore = 50, agenteId = '' } = {}) {
  const rate = await currency.getRate();
  const pesos = await getPesos();

  const propiedad = await Propiedad.findById(propiedadId).select(CAMPOS_PROPIEDAD).lean();
  if (!propiedad) throw Object.assign(new Error('Propiedad no encontrada'), { statusCode: 404 });

  const propFacts = normalize.propertyFacts(propiedad, rate);
  const perfilProp = await profileService.ensureProfile('propiedad', propiedadId);
  const embProp = perfilProp?.embedding || [];

  const filtro = {};
  if (agenteId) filtro.agenteId = String(agenteId);

  const clientes = await Cliente.find(filtro).select(CAMPOS_CLIENTE).limit(MAX_CANDIDATOS).lean();
  const vectores = await vectoresDe('cliente');

  // La mediana se calcula sobre la cartera, no sobre este único inmueble.
  const cartera = await Propiedad.find({ published: true, status: 'Disponible' })
    .select('price moneda metadata')
    .limit(MAX_CANDIDATOS)
    .lean();
  const medianas = medianasPrecioM2(cartera.map((p) => normalize.propertyFacts(p, rate)));

  const resultados = [];

  for (const cliente of clientes) {
    const cliFacts = normalize.clientFacts(cliente, rate);

    // Un propietario está vendiendo, no comprando. Solo entra si además
    // cargó un presupuesto, que es la señal de que también busca.
    if (cliFacts.tipoCliente === 'propietario' && !cliFacts.presupuestoUSD) continue;

    const evaluacion = scoring.evaluar(propFacts, cliFacts, pesosPara(pesos, cliFacts.tipoCliente), {
      embProp,
      embCli: vectores.get(cliFacts.id) || [],
      medianaPrecioM2: medianas,
    });

    if (evaluacion.veto || evaluacion.score < minScore) continue;

    resultados.push({ cliente: cliFacts, propiedad: propFacts, ...evaluacion });
  }

  resultados.sort((a, b) => b.score - a.score);

  return {
    propiedad: propFacts,
    perfil: resumenPerfil(perfilProp),
    cotizacion: { configurada: rate.configurada, valor: rate.valor, fecha: rate.fecha, vencida: rate.vencida },
    evaluados: clientes.length,
    matches: resultados.slice(0, limit),
  };
}

// ── Persistencia y explicación ────────────────────────────────────────────────

/**
 * Huella del match: si esto no cambió, la explicación guardada sigue valiendo
 * y no hace falta volver a pagarle a la API por reescribir lo mismo.
 */
function huellaDeMatch(match) {
  const dims = Object.entries(match.breakdown || {})
    .filter(([, d]) => d.aplica)
    .map(([k, d]) => `${k}:${d.score}`)
    .sort()
    .join(',');

  return contentHash([
    match.score,
    match.propiedad.precioUSD,
    match.cliente.presupuestoRefUSD,
    dims,
  ].join('|'));
}

/**
 * Guarda el match y le agrega la explicación redactada.
 * Reusa la explicación previa mientras la huella no cambie.
 */
async function persistirMatch(match, direction, { explicar = true, rate } = {}) {
  const { propiedad, cliente } = match;
  const huella = huellaDeMatch(match);

  const existente = await MatchRecommendation
    .findOne({ clienteId: cliente.id, propiedadId: propiedad.id })
    .lean();

  // Lo que el agente descartó no se vuelve a ofrecer: es el error que más
  // credibilidad quema.
  if (existente?.status === 'descartado') return null;

  const vigente = existente && existente.huella === huella && existente.titulo;

  const explicacion = vigente
    ? {
      titulo: existente.titulo,
      porQue: existente.porQue,
      objeciones: existente.objeciones,
      accionSugerida: existente.accionSugerida,
      mensajeWhatsapp: existente.mensajeWhatsapp,
      explicadoPor: existente.explicadoPor,
      model: existente.model,
    }
    : (explicar
      ? await explainService.explicar(propiedad, cliente, match)
      : explainService.explicacionPlantilla(propiedad, cliente, match));

  const doc = {
    clienteId: cliente.id,
    propiedadId: propiedad.id,
    colocadorId: cliente.agenteId || '',
    captadorId: propiedad.agenteId || '',
    direction,
    score: match.score,
    bucket: match.bucket,
    cobertura: match.cobertura,
    breakdown: match.breakdown,
    fxRate: rate?.configurada ? { valor: rate.valor, fecha: rate.fecha } : { valor: null, fecha: null },
    ...explicacion,
    huella,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  // El estado lo maneja el agente: no se pisa al recalcular.
  const guardado = await MatchRecommendation.findOneAndUpdate(
    { clienteId: cliente.id, propiedadId: propiedad.id },
    { $set: doc, $setOnInsert: { status: 'pending' } },
    { upsert: true, new: true }
  ).lean();

  return guardado;
}

/**
 * Persiste y explica los primeros `topK` de una lista de matches.
 * Solo se redactan los de arriba: explicar 40 propiedades que nadie va a
 * mirar es tirar plata.
 */
async function explicarMatches(matches, direction, { topK = 5, explicar = true, rate } = {}) {
  const salida = [];

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    if (i >= topK) {
      salida.push({ ...match, recomendacion: null });
      continue;
    }

    try {
      const guardado = await persistirMatch(match, direction, { explicar, rate });
      if (!guardado) continue; // descartado por el agente
      salida.push({ ...match, recomendacion: recomendacionPublica(guardado) });
    } catch (err) {
      console.warn(`[matching] No se pudo persistir el match: ${err.message}`);
      salida.push({ ...match, recomendacion: null });
    }
  }

  return salida;
}

/** Forma en la que la interfaz consume una recomendación guardada. */
function recomendacionPublica(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    titulo: doc.titulo,
    porQue: doc.porQue || [],
    objeciones: doc.objeciones || [],
    accionSugerida: doc.accionSugerida || '',
    mensajeWhatsapp: doc.mensajeWhatsapp || '',
    explicadoPor: doc.explicadoPor,
    status: doc.status,
    creada: doc.createdAt,
  };
}

/** Lo del perfil que le sirve a la interfaz (sin el vector, que pesa). */
function resumenPerfil(perfil) {
  if (!perfil) return null;
  return {
    narrativa: perfil.narrativa || '',
    tags: perfil.tags || [],
    publicoIdeal: perfil.publicoIdeal || [],
    faltantes: perfil.faltantes || [],
    requisitos: perfil.requisitos || { must: [], nice: [] },
    senales: perfil.senales || {},
    descartes: perfil.descartes || [],
    generadoPor: perfil.generadoPor || 'plantilla',
    actualizado: perfil.updatedAt || null,
  };
}

module.exports = {
  clienteAPropiedades,
  propiedadAClientes,
  explicarMatches,
  persistirMatch,
  recomendacionPublica,
  historialCliente,
  medianasPrecioM2,
  invalidarVectores,
  vectoresDe,
};
