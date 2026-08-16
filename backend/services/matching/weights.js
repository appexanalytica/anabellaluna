/**
 * Pesos del scoring — Lo que hace al motor inmobiliario y no genérico.
 *
 * Un inversor no busca lo mismo que una familia: pondera rentabilidad y estado
 * por encima de la cantidad de dormitorios. Un inquilino mira el costo total
 * (alquiler más expensas) y la zona, porque se muda todos los días a trabajar.
 *
 * Cada perfil suma 100. Si una dimensión no tiene datos para comparar, el
 * scoring la saca y reparte su peso entre las que sí — así una ficha
 * incompleta no arrastra el puntaje para abajo.
 *
 * El admin puede pisar estos valores desde GlobalConfig ('matching_weights').
 */

const GlobalConfig = require('../../models/GlobalConfig');

const PESOS_BASE = {
  comprador: {
    precio:     25,
    ubicacion:  20,
    tipologia:  15,
    superficie: 10,
    semantico:  20,
    senales:    10,
  },
  inversor: {
    precio:       20,
    ubicacion:    20,
    tipologia:    10,
    superficie:   10,
    semantico:    20,
    senales:      10,
    rentabilidad: 10,
  },
  inquilino: {
    precio:     20,
    ubicacion:  25,
    tipologia:  15,
    superficie:  5,
    semantico:  20,
    senales:     5,
    costoTotal: 10,
  },
};

// Un propietario que además compra se puntúa como comprador.
PESOS_BASE.propietario = { ...PESOS_BASE.comprador };

const CACHE_TTL_MS = 60 * 1000;
let _cache = null;
let _cacheAt = 0;

function invalidateCache() {
  _cache = null;
  _cacheAt = 0;
}

/**
 * Pesos vigentes por tipo de cliente, con override del admin si existe.
 */
async function getPesos() {
  const now = Date.now();
  if (_cache && now - _cacheAt < CACHE_TTL_MS) return _cache;

  let override = null;
  try {
    override = await GlobalConfig.getValue('matching_weights', null);
  } catch { /* sin override: se usan los pesos base */ }

  const result = {};
  for (const [tipo, base] of Object.entries(PESOS_BASE)) {
    const custom = override && override[tipo] && typeof override[tipo] === 'object' ? override[tipo] : {};
    const merged = { ...base };
    for (const [dim, valor] of Object.entries(custom)) {
      const n = Number(valor);
      if (Number.isFinite(n) && n >= 0 && dim in merged) merged[dim] = n;
    }
    result[tipo] = merged;
  }

  _cache = result;
  _cacheAt = now;
  return result;
}

function pesosPara(pesos, tipoCliente) {
  return pesos[tipoCliente] || pesos.comprador;
}

// ── Umbrales de resultado ─────────────────────────────────────────────────────

const BANDAS = {
  fuerte:      80,
  buena:       65,
  alternativa: 50,
};

/**
 * Banda del puntaje. Debajo de 50 no se muestra: mostrar de más entrena al
 * agente a ignorar el panel.
 */
function bucket(score) {
  if (score >= BANDAS.fuerte) return 'fuerte';
  if (score >= BANDAS.buena) return 'buena';
  if (score >= BANDAS.alternativa) return 'alternativa';
  return null;
}

module.exports = {
  PESOS_BASE,
  BANDAS,
  getPesos,
  pesosPara,
  bucket,
  invalidateCache,
};
