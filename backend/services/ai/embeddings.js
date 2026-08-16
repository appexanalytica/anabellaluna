/**
 * Embeddings — Vectores semánticos via API de OpenAI.
 *
 * Base del motor de recomendaciones: convierte el perfil de una propiedad o de
 * un cliente en un vector, para después medir cuánto se parecen entre sí.
 *
 * Modelo: text-embedding-3-small (1536 dims). Es el más barato de OpenAI
 * (USD 0,02 por millón de tokens) y alcanza de sobra para matching inmobiliario.
 *
 * Los vectores de OpenAI vienen normalizados (norma = 1), así que el coseno es
 * el producto punto. Igual se calcula la norma para no depender de eso.
 */

const crypto = require('crypto');
const { getProviderConfig, logUsage, OPENAI_BASE_URL } = require('./providerAbstraction');

const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS    = 1536;

// La API acepta arrays; se mandan de a tandas para no pasarse de tokens.
const BATCH_SIZE = 96;
// El modelo corta en 8191 tokens. 20k caracteres es un techo holgado y seguro.
const MAX_CHARS  = 20000;

const MAX_RETRIES = 2;

function getEmbeddingModel() {
  return process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL;
}

/**
 * Hash del texto fuente. Sirve para no volver a pedir el embedding de algo
 * que no cambió: se guarda junto al vector y se compara antes de regenerar.
 */
function contentHash(text) {
  return crypto.createHash('sha1').update(String(text || ''), 'utf8').digest('hex');
}

function _truncate(text) {
  const clean = String(text || '').trim();
  return clean.length > MAX_CHARS ? clean.slice(0, MAX_CHARS) : clean;
}

async function _sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Llama a /v1/embeddings con una tanda de textos.
 * Reintenta ante 429 y 5xx, que son los errores transitorios de la API.
 */
async function _callEmbeddings(inputs, { model, userId, agenteId }) {
  const config = await getProviderConfig();
  const apiKey = config.openai.apiKey;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada. Agregala al .env del servidor o cargala en Configuración > IA.');
  }

  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
  if (process.env.OPENAI_ORG_ID) headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;

  const body = JSON.stringify({ model, input: inputs });

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const startedAt = Date.now();
    try {
      const response = await fetch(`${OPENAI_BASE_URL}/embeddings`, { method: 'POST', headers, body });

      if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        const err = new Error(`OpenAI embeddings error ${response.status}: ${text}`);
        err.status = response.status;
        throw err;
      }

      const data = await response.json();
      if (!Array.isArray(data.data) || data.data.length !== inputs.length) {
        throw new Error(`OpenAI embeddings devolvió ${data.data?.length || 0} vectores para ${inputs.length} textos`);
      }

      logUsage({
        model,
        userId,
        agenteId,
        tokens: data.usage,
        latencyMs: Date.now() - startedAt,
        success: true,
        requestType: 'embedding',
      }).catch(() => {});

      // El orden no está garantizado: se reordena por index.
      return data.data
        .slice()
        .sort((a, b) => a.index - b.index)
        .map((d) => d.embedding);

    } catch (err) {
      lastError = err;
      const retriable = !err.status || err.status === 429 || err.status >= 500;
      if (!retriable || attempt === MAX_RETRIES) break;
      await _sleep(500 * (attempt + 1));
    }
  }

  logUsage({
    model,
    userId,
    agenteId,
    tokens: null,
    latencyMs: 0,
    success: false,
    errorCode: lastError?.message,
    requestType: 'embedding',
  }).catch(() => {});

  throw lastError;
}

/**
 * Genera el embedding de un texto.
 */
async function embed(text, { userId, agenteId } = {}) {
  const input = _truncate(text);
  if (!input) throw new Error('embed: texto vacío');

  const [vector] = await _callEmbeddings([input], {
    model: getEmbeddingModel(),
    userId,
    agenteId,
  });
  return vector;
}

/**
 * Genera embeddings para muchos textos, en tandas.
 * Devuelve los vectores en el mismo orden que los textos recibidos.
 */
async function embedBatch(texts, { userId, agenteId } = {}) {
  const list = (Array.isArray(texts) ? texts : []).map(_truncate);
  if (list.length === 0) return [];
  if (list.some((t) => !t)) throw new Error('embedBatch: hay textos vacíos en el lote');

  const model = getEmbeddingModel();
  const out = [];

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const chunk = list.slice(i, i + BATCH_SIZE);
    const vectors = await _callEmbeddings(chunk, { model, userId, agenteId });
    out.push(...vectors);
  }

  return out;
}

// ── Similitud ─────────────────────────────────────────────────────────────────

/**
 * Similitud coseno entre dos vectores. Devuelve entre -1 y 1;
 * en la práctica, con embeddings de texto, entre 0 y 1.
 */
function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Ordena candidatos por similitud contra un vector de referencia.
 * Fuerza bruta a propósito: con una cartera de cientos o miles de propiedades
 * resuelve en milisegundos y evita sumar una base vectorial a la infraestructura.
 *
 * @param {number[]} queryVector
 * @param {Array<{ id: string, embedding: number[] }>} candidates
 * @param {{ limit?: number, minScore?: number }} opts
 */
function rankBySimilarity(queryVector, candidates, { limit = 50, minScore = 0 } = {}) {
  if (!Array.isArray(queryVector) || queryVector.length === 0) return [];

  return (candidates || [])
    .map((c) => ({ ...c, similarity: cosineSimilarity(queryVector, c.embedding) }))
    .filter((c) => c.similarity >= minScore)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

module.exports = {
  embed,
  embedBatch,
  cosineSimilarity,
  rankBySimilarity,
  contentHash,
  getEmbeddingModel,
  EMBEDDING_DIMENSIONS,
  DEFAULT_EMBEDDING_MODEL,
};
