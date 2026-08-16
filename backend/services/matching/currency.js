/**
 * Cotización del dólar — Fuente única para comparar precios entre monedas.
 *
 * La carga el admin a mano (decisión del negocio: no depende de una API externa
 * que puede cambiar el valor sin aviso y mover los matches de un día para otro).
 *
 * El valor es cuántos pesos vale un dólar. Se guarda en GlobalConfig junto con
 * la fecha y quién la cargó, y vence a los 7 días para que nadie compare
 * propiedades con un dólar de hace un mes sin enterarse.
 *
 * Regla del motor de matching: cada recomendación guarda la cotización que usó,
 * así un match viejo se relee con los mismos números.
 */

const GlobalConfig = require('../../models/GlobalConfig');

const CONFIG_KEY   = 'cotizacion_usd';
const STALE_DAYS   = 7;
const CACHE_TTL_MS = 60 * 1000;

const SUPPORTED = ['ARS', 'USD'];

let _cache   = null;
let _cacheAt = 0;

function invalidateCache() {
  _cache   = null;
  _cacheAt = 0;
}

function _diasDesde(fecha) {
  if (!fecha) return null;
  const ms = Date.now() - new Date(fecha).getTime();
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

/**
 * Estado actual de la cotización.
 *
 * @returns {Promise<{
 *   configurada: boolean, valor: number|null, fecha: Date|null,
 *   edadDias: number|null, vencida: boolean,
 *   actualizadaPor: string, moneda: string
 * }>}
 */
async function getRate() {
  const now = Date.now();
  if (_cache && now - _cacheAt < CACHE_TTL_MS) return _cache;

  const value = await GlobalConfig.getValue(CONFIG_KEY, null);
  const valor = Number(value?.valor);
  const configurada = Number.isFinite(valor) && valor > 0;
  const edadDias = configurada ? _diasDesde(value.fecha) : null;

  const result = {
    configurada,
    valor: configurada ? valor : null,
    fecha: configurada && value.fecha ? new Date(value.fecha) : null,
    edadDias,
    vencida: configurada && edadDias !== null && edadDias > STALE_DAYS,
    actualizadaPor: value?.actualizadaPorNombre || '',
    moneda: 'ARS por USD',
  };

  _cache   = result;
  _cacheAt = now;
  return result;
}

/**
 * Guarda una cotización nueva.
 */
async function setRate(valor, { userId = '', nombre = '' } = {}) {
  const num = Number(valor);
  if (!Number.isFinite(num) || num <= 0) {
    const err = new Error('La cotización tiene que ser un número mayor a cero');
    err.statusCode = 400;
    throw err;
  }

  await GlobalConfig.setValue(
    CONFIG_KEY,
    {
      valor: num,
      fecha: new Date().toISOString(),
      actualizadaPor: String(userId || ''),
      actualizadaPorNombre: String(nombre || ''),
      fuente: 'manual',
    },
    'Cotización del dólar para comparar precios entre monedas',
    userId || null
  );

  invalidateCache();
  return getRate();
}

function normalizeMoneda(moneda) {
  const m = String(moneda || '').trim().toUpperCase();
  if (!m) return 'ARS';
  if (m === 'U$S' || m === 'USD' || m === 'DOLAR' || m === 'DÓLAR' || m === 'US$') return 'USD';
  if (m === '$' || m === 'ARS' || m === 'PESOS' || m === 'PESO') return 'ARS';
  return SUPPORTED.includes(m) ? m : 'ARS';
}

/**
 * Convierte un monto a dólares.
 *
 * Devuelve `monto: null` cuando hace falta la cotización y no está cargada.
 * El motor de matching, en ese caso, compara solo dentro de la misma moneda
 * en vez de inventar una conversión.
 *
 * @param {number} monto
 * @param {string} moneda  'ARS' | 'USD'
 * @param {{valor: number}} [rate]  cotización ya resuelta (evita ir a la DB en loops)
 */
async function toUSD(monto, moneda, rate = null) {
  const num = Number(monto);
  if (!Number.isFinite(num)) return { monto: null, motivo: 'monto_invalido', rate: null };

  const m = normalizeMoneda(moneda);
  if (m === 'USD') return { monto: num, motivo: null, rate: null };

  const cotizacion = rate || await getRate();
  if (!cotizacion.configurada) {
    return { monto: null, motivo: 'sin_cotizacion', rate: null };
  }

  return {
    monto: num / cotizacion.valor,
    motivo: null,
    rate: { valor: cotizacion.valor, fecha: cotizacion.fecha },
  };
}

/**
 * Versión sincrónica: para loops donde la cotización ya se resolvió una vez.
 */
function toUSDSync(monto, moneda, rate) {
  const num = Number(monto);
  if (!Number.isFinite(num)) return null;

  const m = normalizeMoneda(moneda);
  if (m === 'USD') return num;
  if (!rate?.configurada) return null;

  return num / rate.valor;
}

module.exports = {
  getRate,
  setRate,
  toUSD,
  toUSDSync,
  normalizeMoneda,
  invalidateCache,
  CONFIG_KEY,
  STALE_DAYS,
};
