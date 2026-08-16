/**
 * Profile Service — Genera el perfil semántico de propiedades y clientes.
 *
 * Dos capas, y el orden importa:
 *   1. `facts` los calcula normalize.js, sin IA. Son los números con los que
 *      después puntúa el motor.
 *   2. La IA escribe la narrativa y extrae lo que está en texto libre
 *      (requisitos excluyentes, descartes, urgencia). No calcula nada.
 *
 * Si la IA no está disponible, se arma una narrativa por plantilla con los
 * mismos datos y se sigue adelante: el motor nunca depende de que OpenAI conteste.
 */

const Propiedad = require('../../models/Propiedad');
const Cliente = require('../../models/Cliente');
const ClientInteraction = require('../../models/ClientInteraction');
const EntityProfile = require('../../models/EntityProfile');

const { chatCompletion } = require('../ai/providerAbstraction');
const { embed, contentHash, getEmbeddingModel } = require('../ai/embeddings');
const currency = require('./currency');
const normalize = require('./normalize');

const PROFILE_VERSION = 1;
const MAX_INTERACCIONES = 15;

// ── Texto fuente ──────────────────────────────────────────────────────────────

function linea(label, value) {
  if (value === null || value === undefined || value === '' ) return null;
  if (Array.isArray(value)) {
    if (!value.length) return null;
    return `${label}: ${value.join(', ')}`;
  }
  return `${label}: ${value}`;
}

function propertySourceText(prop, facts) {
  return [
    linea('Título', facts.titulo),
    linea('Operación', facts.operacion),
    linea('Tipo', facts.tipo),
    linea('Precio', facts.precio ? `${facts.precio} ${facts.moneda}` : null),
    linea('Expensas', facts.expensas),
    linea('Dirección', facts.direccion),
    linea('Barrio', facts.barrio),
    linea('Ciudad', facts.ciudad),
    linea('Provincia', facts.provincia),
    linea('Ambientes', facts.ambientes),
    linea('Dormitorios', facts.dormitorios),
    linea('Baños', facts.banos),
    linea('Cocheras', facts.cocheras),
    linea('Superficie cubierta m2', facts.m2Cubierta),
    linea('Superficie total m2', facts.m2Total),
    linea('Antigüedad', facts.antiguedad),
    linea('Año de construcción', facts.anioConstruccion),
    linea('Estado', facts.estado),
    linea('Disponible desde', facts.disponibleDesde),
    linea('Amenities', facts.amenities),
    linea('Descripción publicada', facts.descripcion),
    linea('Notas internas del agente', facts.notasInternas),
  ].filter(Boolean).join('\n');
}

function clientSourceText(cliente, facts, interacciones) {
  const historial = (interacciones || []).map((i) => {
    const fecha = i.createdAt ? new Date(i.createdAt).toISOString().slice(0, 10) : '';
    const partes = [
      `[${fecha}] ${i.tipo}`,
      i.nivelInteres ? `interés ${i.nivelInteres}` : '',
      i.descripcion || '',
      i.preferencias?.detalle || '',
      i.opcionPago?.tipo ? `pago ${i.opcionPago.tipo} ${i.opcionPago.detalle || ''}` : '',
    ].filter(Boolean);
    return `- ${partes.join(' · ')}`;
  });

  return [
    linea('Nombre', facts.nombre),
    linea('Tipo de cliente', facts.tipoCliente),
    linea('Etapa', facts.estado),
    linea('Busca para', facts.operacion),
    linea('Presupuesto declarado', facts.presupuesto ? `${facts.presupuesto} ${facts.moneda}` : null),
    linea('Zonas de interés', facts.zonas),
    linea('Ciudad', facts.ciudad),
    linea('Tipo de propiedad buscada', facts.tipoPropiedad),
    linea('Ambientes', facts.ambientes),
    linea('Dormitorios', facts.dormitorios),
    linea('Baños', facts.banos),
    linea('Superficie cubierta buscada', facts.m2Cubierta),
    linea('Características pedidas', facts.caracteristicas),
    linea('Expensas máximas', facts.expensasMaximas),
    linea('Tiene mascotas', facts.mascotas === null ? null : (facts.mascotas ? 'sí' : 'no')),
    linea('Necesita amoblado', facts.amoblado === null ? null : (facts.amoblado ? 'sí' : 'no')),
    linea('Fecha de mudanza', facts.fechaMudanza),
    linea('Garantía', facts.garantia),
    linea('Objetivo de inversión', facts.objetivoInversion),
    linea('Rentabilidad esperada', facts.rentabilidadEsperada),
    linea('Origen del lead', facts.origen),
    linea('Notas del agente', facts.notas),
    historial.length ? `Historial de interacciones:\n${historial.join('\n')}` : null,
  ].filter(Boolean).join('\n');
}

// ── Prompts ───────────────────────────────────────────────────────────────────

const REGLA_ANTIINVENTO =
  'Regla absoluta: no afirmes nada que no esté en los datos. Si un dato no está, omitilo. ' +
  'No inventes precios, medidas, ubicaciones ni condiciones. No uses lenguaje de folleto publicitario.';

const PROMPT_PROPIEDAD = `Sos un analista de una inmobiliaria argentina. Recibís los datos de una propiedad y devolvés un JSON.

${REGLA_ANTIINVENTO}

Devolvé exactamente este JSON:
{
  "narrativa": "150 a 250 palabras describiendo la propiedad en español rioplatense neutro, integrando TODOS los datos disponibles. Escribí como se la describirías a un colega que la va a mostrar, no como un aviso. Incluí lo bueno y lo que puede ser un obstáculo.",
  "tags": ["etiquetas conceptuales, 4 a 8, en minúscula: familiar, a estrenar, para refaccionar, apto profesional, renta asegurada, primera vivienda, etc."],
  "publicoIdeal": ["2 a 4 perfiles de comprador o inquilino a los que le sirve, en una frase corta cada uno"],
  "faltantes": ["datos importantes que NO están cargados y hacen falta para venderla: sin m2, sin barrio, sin descripción, etc. Lista vacía si está completa."]
}`;

const PROMPT_CLIENTE = `Sos un analista de una inmobiliaria argentina. Recibís la ficha y el historial de un cliente y devolvés un JSON.

${REGLA_ANTIINVENTO}

Devolvé exactamente este JSON:
{
  "narrativa": "150 a 250 palabras contando qué busca este cliente y por qué, en español rioplatense neutro, como se lo contarías a un colega que lo va a atender. Integrá la ficha, las notas y el historial.",
  "requisitos": {
    "must": [{"campo": "nombre corto", "texto": "condición excluyente en una frase"}],
    "nice": [{"campo": "nombre corto", "texto": "algo deseable pero no excluyente"}]
  },
  "tags": ["4 a 8 etiquetas conceptuales en minúscula"],
  "senales": {
    "urgencia": "alta | media | baja",
    "formaDePago": "contado | crédito | permuta | financiado | desconocido",
    "motivacion": "una frase corta, o cadena vacía si no surge de los datos"
  },
  "presupuestoDeclarado": {"min": null, "max": null},
  "descartes": [{"que": "qué propiedad o característica rechazó", "motivo": "por qué"}]
}

Sobre "presupuestoDeclarado": completalo SOLO si el cliente dijo un rango explícito en las notas o el historial ("hasta 90 mil", "entre 80 y 100"). Usá números sin puntos, en la misma moneda de la ficha. Si no lo dijo, dejá los dos en null.
Sobre "must" vs "nice": el presupuesto y la operación son siempre excluyentes. Una cochera o un balcón casi nunca lo son, salvo que el cliente lo haya dicho explícitamente.`;

// ── Fallback sin IA ───────────────────────────────────────────────────────────

function narrativaPlantillaPropiedad(facts) {
  const partes = [
    facts.tipo ? `${facts.tipo} en ${facts.operacion || 'venta'}` : 'Propiedad',
    facts.barrio || facts.ciudad ? `en ${[facts.barrio, facts.ciudad].filter(Boolean).join(', ')}` : '',
    facts.precio ? `a ${facts.precio} ${facts.moneda}` : '',
    facts.ambientes ? `${facts.ambientes} ambientes` : '',
    facts.dormitorios ? `${facts.dormitorios} dormitorios` : '',
    facts.banos ? `${facts.banos} baños` : '',
    facts.cocheras ? `${facts.cocheras} cocheras` : '',
    facts.m2Cubierta ? `${facts.m2Cubierta} m2 cubiertos` : '',
    facts.amenities.length ? `Amenities: ${facts.amenities.join(', ')}` : '',
    facts.descripcion || '',
  ].filter(Boolean);

  return partes.join('. ');
}

function narrativaPlantillaCliente(facts) {
  const partes = [
    `${facts.nombre || 'Cliente'} (${facts.tipoCliente})`,
    `busca ${facts.tipoPropiedad || 'propiedad'} en ${facts.operacion}`,
    facts.zonas.length ? `en ${facts.zonas.join(', ')}` : '',
    facts.presupuesto ? `con presupuesto de ${facts.presupuesto} ${facts.moneda}` : '',
    facts.ambientes ? `${facts.ambientes} ambientes` : '',
    facts.dormitorios ? `${facts.dormitorios} dormitorios` : '',
    facts.caracteristicas.length ? `Pide: ${facts.caracteristicas.join(', ')}` : '',
    facts.notas || '',
  ].filter(Boolean);

  return partes.join('. ');
}

/** Datos que faltan y dejan a la propiedad fuera del matching. */
function faltantesPropiedad(facts) {
  const out = [];
  if (!facts.precio) out.push('sin precio');
  if (!facts.operacion) out.push('sin tipo de operación (venta o alquiler)');
  if (!facts.tipo) out.push('sin tipo de propiedad');
  if (!facts.barrio && !facts.ciudad) out.push('sin barrio ni ciudad');
  if (!facts.m2Cubierta && !facts.m2Total) out.push('sin superficie');
  if (!facts.dormitorios && !facts.ambientes) out.push('sin ambientes ni dormitorios');
  if (!facts.descripcion) out.push('sin descripción');
  return out;
}

// ── Generación ────────────────────────────────────────────────────────────────

function safeJsonParse(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch { /* sigue abajo */ }

  // A veces el modelo envuelve el JSON en un bloque de código.
  const match = String(text).match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

async function enriquecerConIA(entityType, sourceText) {
  const prompt = entityType === 'propiedad' ? PROMPT_PROPIEDAD : PROMPT_CLIENTE;

  const result = await chatCompletion({
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: sourceText },
    ],
    maxTokens: 1200,
    responseFormat: { type: 'json_object' },
    userId: 'system',
  });

  const content = result?.choices?.[0]?.message?.content || '';
  const parsed  = safeJsonParse(content);
  if (!parsed || !parsed.narrativa) throw new Error('La IA no devolvió una narrativa válida');

  return { parsed, model: result.choices[0]?.model || '' };
}

/** Texto que efectivamente se convierte en vector. */
function textoParaEmbedding(entityType, narrativa, extra) {
  const bloques = [narrativa];

  if (extra.tags?.length) bloques.push(`Etiquetas: ${extra.tags.join(', ')}`);

  if (entityType === 'propiedad' && extra.publicoIdeal?.length) {
    bloques.push(`Público ideal: ${extra.publicoIdeal.join('. ')}`);
  }

  if (entityType === 'cliente') {
    const must = (extra.requisitos?.must || []).map((r) => r.texto).filter(Boolean);
    const nice = (extra.requisitos?.nice || []).map((r) => r.texto).filter(Boolean);
    if (must.length) bloques.push(`Excluyente: ${must.join('. ')}`);
    if (nice.length) bloques.push(`Deseable: ${nice.join('. ')}`);
  }

  return bloques.join('\n');
}

/**
 * Genera (o regenera) el perfil de una entidad y lo guarda.
 *
 * @param {'propiedad'|'cliente'} entityType
 * @param {string} entityId
 * @param {{ force?: boolean, conIA?: boolean }} opts
 */
async function generateProfile(entityType, entityId, { force = false, conIA = true } = {}) {
  const rate = await currency.getRate();

  let doc;
  let facts;
  let sourceText;

  if (entityType === 'propiedad') {
    doc = await Propiedad.findById(entityId).lean();
    if (!doc) throw new Error(`Propiedad ${entityId} no encontrada`);
    facts = normalize.propertyFacts(doc, rate);
    sourceText = propertySourceText(doc, facts);
  } else {
    doc = await Cliente.findById(entityId).lean();
    if (!doc) throw new Error(`Cliente ${entityId} no encontrado`);
    facts = normalize.clientFacts(doc, rate);
    const interacciones = await ClientInteraction.find({ clienteId: entityId })
      .sort({ createdAt: -1 })
      .limit(MAX_INTERACCIONES)
      .lean();
    sourceText = clientSourceText(doc, facts, interacciones);
  }

  const hash = contentHash(`${PROFILE_VERSION}|${sourceText}`);
  const existing = await EntityProfile.findOne({ entityType, entityId }).lean();

  if (!force && existing && existing.contentHash === hash && existing.embedding?.length) {
    return { profile: existing, regenerado: false };
  }

  // 1. Capa IA (opcional): narrativa y extracción de texto libre.
  let enriquecido = null;
  let generadoPor = 'plantilla';
  let model = '';
  let error = '';

  if (conIA) {
    try {
      const { parsed, model: usedModel } = await enriquecerConIA(entityType, sourceText);
      enriquecido = parsed;
      generadoPor = 'ia';
      model = usedModel;
    } catch (err) {
      error = err.message;
      console.warn(`[matching] Perfil ${entityType}/${entityId} sin IA: ${err.message}`);
    }
  }

  // 2. Fallback determinista: el motor no depende de que la IA conteste.
  const narrativa = enriquecido?.narrativa
    || (entityType === 'propiedad' ? narrativaPlantillaPropiedad(facts) : narrativaPlantillaCliente(facts));

  const tags = Array.isArray(enriquecido?.tags) ? enriquecido.tags.slice(0, 10) : [];

  const extra = {
    tags,
    publicoIdeal: Array.isArray(enriquecido?.publicoIdeal) ? enriquecido.publicoIdeal.slice(0, 5) : [],
    faltantes: Array.isArray(enriquecido?.faltantes) && enriquecido.faltantes.length
      ? enriquecido.faltantes.slice(0, 8)
      : (entityType === 'propiedad' ? faltantesPropiedad(facts) : []),
    requisitos: {
      must: Array.isArray(enriquecido?.requisitos?.must) ? enriquecido.requisitos.must.slice(0, 10) : [],
      nice: Array.isArray(enriquecido?.requisitos?.nice) ? enriquecido.requisitos.nice.slice(0, 10) : [],
    },
    senales: enriquecido?.senales && typeof enriquecido.senales === 'object' ? enriquecido.senales : {},
    descartes: Array.isArray(enriquecido?.descartes) ? enriquecido.descartes.slice(0, 10) : [],
  };

  // 3. Rango de presupuesto declarado: si el cliente lo dijo, le gana al derivado.
  let presupuestoDeclarado = { min: null, max: null };
  if (entityType === 'cliente') {
    const declarado = enriquecido?.presupuestoDeclarado || {};
    const min = normalize.toNumber(declarado.min);
    const max = normalize.toNumber(declarado.max);
    if (Number.isFinite(max) && max > 0) {
      // Viene en la moneda de la ficha; se lleva a dólares como todo lo demás.
      const minUSD = Number.isFinite(min) && min > 0 ? currencyToUSD(min, facts.moneda, rate) : null;
      const maxUSD = currencyToUSD(max, facts.moneda, rate);
      if (Number.isFinite(maxUSD)) {
        presupuestoDeclarado = { min: minUSD, max: maxUSD };
        facts = normalize.aplicarRangoDeclarado(facts, { min: minUSD, max: maxUSD });
      }
    }
  }

  // 4. Vector.
  let embedding = [];
  let embeddingModel = '';
  try {
    embedding = await embed(textoParaEmbedding(entityType, narrativa, extra), { userId: 'system' });
    embeddingModel = getEmbeddingModel();
  } catch (err) {
    error = error ? `${error} | embedding: ${err.message}` : `embedding: ${err.message}`;
    console.warn(`[matching] Sin embedding para ${entityType}/${entityId}: ${err.message}`);
  }

  const update = {
    entityType,
    entityId: String(entityId),
    agenteId: String(facts.agenteId || ''),
    contentHash: hash,
    narrativa,
    facts,
    tags,
    publicoIdeal: extra.publicoIdeal,
    faltantes: extra.faltantes,
    requisitos: extra.requisitos,
    senales: extra.senales,
    descartes: extra.descartes,
    presupuestoDeclarado,
    embedding,
    embeddingModel,
    generadoPor,
    model,
    version: PROFILE_VERSION,
    error,
  };

  const profile = await EntityProfile.findOneAndUpdate(
    { entityType, entityId: String(entityId) },
    { $set: update },
    { upsert: true, new: true }
  ).lean();

  return { profile, regenerado: true };
}

function currencyToUSD(monto, moneda, rate) {
  const usd = currency.toUSDSync(monto, moneda, rate);
  return Number.isFinite(usd) ? usd : null;
}

/**
 * Devuelve el perfil, generándolo si falta o si la entidad cambió.
 * Nunca lanza: si algo falla, devuelve null y el motor sigue con los facts.
 */
async function ensureProfile(entityType, entityId, opts = {}) {
  try {
    const { profile } = await generateProfile(entityType, entityId, opts);
    return profile;
  } catch (err) {
    console.warn(`[matching] ensureProfile ${entityType}/${entityId}: ${err.message}`);
    return null;
  }
}

/**
 * Carga inicial: recorre la cartera y genera los perfiles que falten.
 * Secuencial a propósito — no tiene apuro y así no golpea la API en paralelo.
 */
async function backfill({ entityType, limit = 500, force = false, conIA = true, onProgress } = {}) {
  const tipos = entityType ? [entityType] : ['propiedad', 'cliente'];
  const resumen = { procesados: 0, regenerados: 0, saltados: 0, errores: 0 };

  for (const tipo of tipos) {
    const Model = tipo === 'propiedad' ? Propiedad : Cliente;
    const docs = await Model.find({}).select('_id').sort({ updatedAt: -1 }).limit(limit).lean();

    for (const d of docs) {
      resumen.procesados += 1;
      try {
        const { regenerado } = await generateProfile(tipo, String(d._id), { force, conIA });
        if (regenerado) resumen.regenerados += 1;
        else resumen.saltados += 1;
      } catch (err) {
        resumen.errores += 1;
        console.warn(`[matching] backfill ${tipo}/${d._id}: ${err.message}`);
      }
      if (onProgress) onProgress(resumen);
    }
  }

  return resumen;
}

/** Marca un perfil como vencido para que se regenere en el próximo uso. */
async function invalidateProfile(entityType, entityId) {
  await EntityProfile.updateOne(
    { entityType, entityId: String(entityId) },
    { $set: { contentHash: '' } }
  );
}

module.exports = {
  generateProfile,
  ensureProfile,
  backfill,
  invalidateProfile,
  propertySourceText,
  clientSourceText,
  faltantesPropiedad,
  PROFILE_VERSION,
};
