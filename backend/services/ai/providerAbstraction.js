/**
 * Provider Abstraction — OpenAI (único provider activo).
 *
 * Toda la IA del sistema (chat, tools, embeddings) va directo a la API de OpenAI
 * en https://api.openai.com/v1 — sin intermediarios.
 *
 * Config: env OPENAI_API_KEY (requerido) + OPENAI_MODEL (opcional).
 * Override adicional desde GlobalConfig key: 'ai_provider_config'.
 *
 * La API key también puede cargarse desde el panel de admin (se guarda cifrada
 * en GlobalConfig). Precedencia: env > DB.
 */

const crypto = require('crypto');
const GlobalConfig = require('../../models/GlobalConfig');
const AIProvider   = require('../../models/AIProvider');
const AIUsageLog   = require('../../models/AIUsageLog');
const { eventBus } = require('../../utils/eventBus');

const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL   = 'gpt-4o-mini';
const PROVIDER_NAME   = 'openai';

const CACHE_TTL_MS = 60 * 1000;
let _credCache   = null;
let _credCacheAt = 0;

// ── Encryption ────────────────────────────────────────────────────────────────

function _getEncKey() {
  const key = process.env.AI_ENCRYPTION_KEY;
  if (!key || key.length < 32) return null;
  return Buffer.from(key.padEnd(64, '0').substring(0, 64), 'hex');
}

function encrypt(text) {
  const key = _getEncKey();
  if (!key) throw new Error('AI_ENCRYPTION_KEY not configured');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let enc = cipher.update(text, 'utf8', 'hex');
  enc += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc}`;
}

function decrypt(text) {
  const key = _getEncKey();
  if (!key) throw new Error('AI_ENCRYPTION_KEY not configured');
  const [ivHex, tagHex, enc] = text.split(':');
  const iv  = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  let dec = decipher.update(enc, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

// ── Config ────────────────────────────────────────────────────────────────────

/**
 * Normaliza el nombre del modelo.
 * Config vieja guardaba nombres con prefijo de ruteo ('openai/gpt-4o-mini');
 * la API de OpenAI los rechaza. Se limpia el prefijo y se descarta cualquier
 * modelo de otro proveedor que hubiera quedado guardado.
 */
function _normalizeModel(model) {
  const raw = String(model || '').trim();
  if (!raw) return DEFAULT_MODEL;
  const clean = raw.startsWith('openai/') ? raw.slice('openai/'.length) : raw;
  if (clean.includes('/')) return DEFAULT_MODEL; // modelo de otro proveedor
  return clean;
}

async function getProviderConfig() {
  const now = Date.now();
  if (_credCache && now - _credCacheAt < CACHE_TTL_MS) return _credCache;

  const config = await GlobalConfig.getValue('ai_provider_config', null);
  const dbAI   = (config && config.openai) ? config.openai : {};
  // Config previa al cambio de proveedor: se reaprovechan los ajustes, no la key.
  const legacy = (config && config.openrouter) ? config.openrouter : {};

  // API key: env > DB
  let apiKey = process.env.OPENAI_API_KEY || '';
  if (!apiKey && dbAI.apiKeyEncrypted) {
    try { apiKey = decrypt(dbAI.apiKeyEncrypted); } catch { apiKey = ''; }
  }

  const result = {
    defaultProvider: PROVIDER_NAME,
    openai: {
      enabled:     true,
      apiKey,
      model:       _normalizeModel(process.env.OPENAI_MODEL || dbAI.model || legacy.model),
      maxTokens:   dbAI.maxTokens   || legacy.maxTokens   || 4096,
      temperature: dbAI.temperature ?? legacy.temperature ?? 0.3,
    },
  };

  _credCache   = result;
  _credCacheAt = now;
  return result;
}

function invalidateCache() {
  _credCache   = null;
  _credCacheAt = 0;
}

// ── Chat Completion ───────────────────────────────────────────────────────────

async function chatCompletion({
  messages,
  tools,
  stream = false,
  userId,
  agenteId,
  conversationId,
  maxTokens,
  toolChoice,
  model,
  responseFormat,
}) {
  const config = await getProviderConfig();
  const cfg    = {
    ...config.openai,
    maxTokens: maxTokens || config.openai.maxTokens,
    model:     model ? _normalizeModel(model) : config.openai.model,
  };

  if (!cfg.apiKey) {
    throw new Error('OPENAI_API_KEY no configurada. Agregala al .env del servidor o cargala en Configuración > IA.');
  }

  const startedAt = Date.now();
  try {
    const result    = await _callOpenAI(cfg, { messages, tools, stream, toolChoice, responseFormat });
    const latencyMs = Date.now() - startedAt;

    logUsage({ model: cfg.model, userId, agenteId,
      conversationId, tokens: result.usage, latencyMs, success: true }).catch(() => {});

    await AIProvider.findOneAndUpdate(
      { name: PROVIDER_NAME },
      { $set: { consecutiveErrors: 0, lastHealthCheck: new Date(), healthStatus: 'healthy', isEnabled: true },
        $inc: { totalRequests: 1, totalTokensUsed: result.usage?.total_tokens || 0 } },
      { upsert: true }
    );

    return { ...result, provider: PROVIDER_NAME };

  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    console.error('[AI] OpenAI failed:', err.message);

    await AIProvider.findOneAndUpdate(
      { name: PROVIDER_NAME },
      { $inc: { consecutiveErrors: 1, totalErrors: 1 },
        $set: { lastHealthCheck: new Date(), healthStatus: 'degraded', lastError: err.message } },
      { upsert: true }
    );

    logUsage({ model: cfg.model, userId, agenteId,
      conversationId, tokens: null, latencyMs, success: false, errorCode: err.message }).catch(() => {});

    eventBus.emit('ai.provider.failed', { provider: PROVIDER_NAME, error: err.message, userId });
    throw err;
  }
}

async function _callOpenAI(cfg, { messages, tools, stream, toolChoice, responseFormat }) {
  const model = cfg.model || DEFAULT_MODEL;

  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${cfg.apiKey}`,
  };
  if (process.env.OPENAI_ORG_ID) headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;

  const body = JSON.stringify({
    model,
    messages,
    temperature: cfg.temperature ?? 0.3,
    max_tokens:  cfg.maxTokens  || 4096,
    ...(tools && tools.length > 0 ? { tools, tool_choice: toolChoice || 'auto' } : {}),
    ...(responseFormat ? { response_format: responseFormat } : {}),
    ...(stream ? { stream: true } : {}),
  });

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST', headers, body,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error(`OpenAI returned empty response: ${JSON.stringify(data)}`);
  }

  return {
    choices: data.choices,
    usage:   data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  };
}

// ── Usage logging ─────────────────────────────────────────────────────────────

/**
 * Registra un llamado a la API. Compartido con el servicio de embeddings.
 */
async function logUsage({ model, userId, agenteId, conversationId, tokens, latencyMs, success, errorCode, requestType }) {
  try {
    await AIUsageLog.create({
      provider: PROVIDER_NAME,
      model,
      userId:   userId || 'system',
      agenteId,
      conversationId,
      promptTokens:     tokens?.prompt_tokens     || 0,
      completionTokens: tokens?.completion_tokens || 0,
      totalTokens:      tokens?.total_tokens      || 0,
      costUSD: estimateCost(model, tokens),
      latencyMs,
      success,
      errorCode,
      requestType: requestType || 'chat',
    });
  } catch (err) {
    console.error('[AI] Usage log failed:', err.message);
  }
}

// Precios OpenAI en USD por 1M de tokens (input / output).
const PRICING = {
  'gpt-4o-mini':            { in: 0.15,  out: 0.60 },
  'gpt-4o':                 { in: 2.50,  out: 10.00 },
  'text-embedding-3-small': { in: 0.02,  out: 0 },
  'text-embedding-3-large': { in: 0.13,  out: 0 },
};

function estimateCost(model, tokens) {
  if (!tokens) return 0;
  const key   = Object.keys(PRICING).find((m) => String(model || '').startsWith(m));
  const price = key ? PRICING[key] : PRICING['gpt-4o-mini'];
  const input  = tokens.prompt_tokens || tokens.total_tokens || 0;
  const output = tokens.completion_tokens || 0;
  return (input * price.in + output * price.out) / 1_000_000;
}

module.exports = {
  chatCompletion,
  getProviderConfig,
  invalidateCache,
  encrypt,
  decrypt,
  logUsage,
  estimateCost,
  OPENAI_BASE_URL,
  DEFAULT_MODEL,
  PROVIDER_NAME,
};
