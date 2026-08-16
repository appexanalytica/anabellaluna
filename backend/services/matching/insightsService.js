/**
 * Insights — Lo que el motor le dice al admin sobre el negocio, no sobre un match.
 *
 *   coberturaDeCartera    → ¿lo que captamos responde a lo que nos piden?
 *   demandaInsatisfecha   → ¿qué nos están pidiendo que no tenemos? (guía de captación)
 *   propiedadesHuerfanas  → ¿qué publicamos que no le sirve a nadie?
 *   oportunidadesSinAccion→ ¿qué match fuerte se está enfriando sin que nadie llame?
 *
 * El barrido completo corre el scoring determinista sobre toda la cartera. No
 * usa la parte semántica a propósito: para una estadística no vale la pena
 * multiplicar vectores de 1536 dimensiones por cada par, y las dimensiones
 * duras alcanzan para saber si hay match o no.
 */

const Propiedad = require('../../models/Propiedad');
const Cliente = require('../../models/Cliente');
const MatchRecommendation = require('../../models/MatchRecommendation');

const currency = require('./currency');
const normalize = require('./normalize');
const scoring = require('./scoringEngine');
const { medianasPrecioM2 } = require('./matchService');
const { getPesos, pesosPara } = require('./weights');

const CACHE_TTL_MS = 10 * 60 * 1000;
const UMBRAL_COBERTURA = 70;
const MAX_ENTIDADES = 3000;

let _barrido = null;
let _barridoAt = 0;

function invalidarBarrido() {
  _barrido = null;
  _barridoAt = 0;
}

/**
 * Cruza toda la cartera contra todos los clientes y resume el resultado.
 * Se cachea diez minutos: es una foto del negocio, no un dato de tiempo real.
 */
async function barridoCompleto({ force = false } = {}) {
  if (!force && _barrido && Date.now() - _barridoAt < CACHE_TTL_MS) return _barrido;

  const rate = await currency.getRate();
  const pesos = await getPesos();

  const [propiedades, clientes] = await Promise.all([
    Propiedad.find({ published: true, status: 'Disponible' })
      .select('_id title slug address description price moneda status published metadata agentId exclusiva featured createdAt')
      .limit(MAX_ENTIDADES).lean(),
    Cliente.find({}).select('_id nombre agenteId notas metadata createdAt').limit(MAX_ENTIDADES).lean(),
  ]);

  const propFacts = propiedades.map((p) => normalize.propertyFacts(p, rate));
  const medianas = medianasPrecioM2(propFacts);

  const porCliente = [];
  const matchesPorPropiedad = new Map();

  for (const c of clientes) {
    const cliFacts = normalize.clientFacts(c, rate);

    // Los propietarios que no cargaron presupuesto no están buscando.
    if (cliFacts.tipoCliente === 'propietario' && !cliFacts.presupuestoUSD) continue;

    const pesosCliente = pesosPara(pesos, cliFacts.tipoCliente);
    let mejor = 0;
    let cuantos = 0;

    for (const pf of propFacts) {
      const ev = scoring.evaluar(pf, cliFacts, pesosCliente, { medianaPrecioM2: medianas });
      if (ev.veto) continue;
      if (ev.score >= UMBRAL_COBERTURA) {
        cuantos += 1;
        matchesPorPropiedad.set(pf.id, (matchesPorPropiedad.get(pf.id) || 0) + 1);
      }
      if (ev.score > mejor) mejor = ev.score;
    }

    porCliente.push({
      id: cliFacts.id,
      nombre: cliFacts.nombre,
      agenteId: cliFacts.agenteId,
      tipoCliente: cliFacts.tipoCliente,
      operacion: cliFacts.operacion,
      zonas: cliFacts.zonas,
      tipoPropiedad: cliFacts.tipoPropiedad,
      dormitorios: cliFacts.dormitorios,
      presupuestoUSD: cliFacts.presupuestoUSD,
      mejorScore: mejor,
      matches: cuantos,
    });
  }

  _barrido = {
    calculadoAt: new Date(),
    cotizacion: { configurada: rate.configurada, valor: rate.valor, vencida: rate.vencida },
    totalPropiedades: propFacts.length,
    totalClientes: porCliente.length,
    porCliente,
    matchesPorPropiedad,
    propFacts,
  };
  _barridoAt = Date.now();

  return _barrido;
}

// ── Cobertura de cartera ──────────────────────────────────────────────────────

/**
 * Qué porcentaje de los clientes tiene al menos una propiedad para mostrarle.
 * Si es bajo, el problema es la captación, no el motor.
 */
async function coberturaDeCartera() {
  const b = await barridoCompleto();

  const conMatch = b.porCliente.filter((c) => c.matches > 0);
  const sinNada  = b.porCliente.filter((c) => c.mejorScore < 50);

  const porAgente = {};
  for (const c of b.porCliente) {
    const key = c.agenteId || 'sin_asignar';
    porAgente[key] = porAgente[key] || { agenteId: key, clientes: 0, conMatch: 0 };
    porAgente[key].clientes += 1;
    if (c.matches > 0) porAgente[key].conMatch += 1;
  }

  return {
    calculadoAt: b.calculadoAt,
    cotizacion: b.cotizacion,
    totalClientes: b.totalClientes,
    totalPropiedades: b.totalPropiedades,
    clientesConMatch: conMatch.length,
    coberturaPorcentaje: b.totalClientes ? Math.round((conMatch.length / b.totalClientes) * 100) : 0,
    clientesSinNadaQueMostrar: sinNada.length,
    porAgente: Object.values(porAgente).map((a) => ({
      ...a,
      coberturaPorcentaje: a.clientes ? Math.round((a.conMatch / a.clientes) * 100) : 0,
    })).sort((x, y) => y.clientes - x.clientes),
  };
}

// ── Demanda insatisfecha ──────────────────────────────────────────────────────

function bandaPrecio(usd) {
  if (!Number.isFinite(usd) || usd <= 0) return 'sin presupuesto';
  const escalones = [30000, 50000, 70000, 100000, 150000, 250000];
  for (let i = 0; i < escalones.length; i += 1) {
    if (usd <= escalones[i]) {
      const desde = i === 0 ? 0 : escalones[i - 1];
      return `USD ${(desde / 1000).toFixed(0)}k a ${(escalones[i] / 1000).toFixed(0)}k`;
    }
  }
  return 'USD 250k o más';
}

/**
 * Qué están pidiendo los clientes que no tenemos.
 * Convierte la captación en una decisión con datos.
 */
async function demandaInsatisfecha({ limit = 20 } = {}) {
  const b = await barridoCompleto();

  const sinMatch = b.porCliente.filter((c) => c.matches === 0);
  const grupos = new Map();

  for (const c of sinMatch) {
    const zona = (c.zonas && c.zonas[0]) || 'sin zona declarada';
    const tipo = c.tipoPropiedad || 'sin tipo';
    const banda = bandaPrecio(c.presupuestoUSD);
    const key = `${c.operacion}|${zona}|${tipo}|${banda}`;

    const g = grupos.get(key) || {
      operacion: c.operacion,
      zona,
      tipo,
      banda,
      dormitorios: c.dormitorios,
      clientes: 0,
      nombres: [],
    };
    g.clientes += 1;
    if (g.nombres.length < 5) g.nombres.push(c.nombre);
    grupos.set(key, g);
  }

  const orden = [...grupos.values()].sort((a, b2) => b2.clientes - a.clientes);

  return {
    calculadoAt: b.calculadoAt,
    clientesSinMatch: sinMatch.length,
    totalClientes: b.totalClientes,
    grupos: orden.slice(0, limit),
  };
}

// ── Propiedades huérfanas ─────────────────────────────────────────────────────

/**
 * Publicadas hace más de N días y sin ningún cliente al que le sirvan.
 * Disparador de baja de precio, mejores fotos o recategorización.
 */
async function propiedadesHuerfanas({ dias = 30, limit = 20 } = {}) {
  const b = await barridoCompleto();
  const corte = Date.now() - dias * 24 * 60 * 60 * 1000;

  const huerfanas = b.propFacts
    .filter((p) => {
      const creada = p.creada ? new Date(p.creada).getTime() : 0;
      if (creada && creada > corte) return false; // todavía es nueva
      return !(b.matchesPorPropiedad.get(p.id) > 0);
    })
    .map((p) => ({
      id: p.id,
      titulo: p.titulo,
      slug: p.slug,
      operacion: p.operacion,
      tipo: p.tipo,
      barrio: p.barrio,
      precio: p.precio,
      moneda: p.moneda,
      precioUSD: p.precioUSD,
      agenteId: p.agenteId,
      diasPublicada: p.creada ? Math.floor((Date.now() - new Date(p.creada).getTime()) / (24 * 60 * 60 * 1000)) : null,
      motivos: motivosSinMatch(p),
    }))
    .sort((x, y) => (y.diasPublicada || 0) - (x.diasPublicada || 0));

  return {
    calculadoAt: b.calculadoAt,
    dias,
    total: huerfanas.length,
    propiedades: huerfanas.slice(0, limit),
  };
}

/** Por qué una propiedad no le aparece a nadie. */
function motivosSinMatch(p) {
  const out = [];
  if (!p.precio) out.push('sin precio cargado');
  if (!p.operacion) out.push('sin tipo de operación');
  if (!p.tipo) out.push('sin tipo de propiedad');
  if (!p.barrio && !p.ciudad) out.push('sin barrio ni ciudad');
  if (!p.m2Cubierta && !p.m2Total) out.push('sin superficie');
  if (!p.dormitorios && !p.ambientes) out.push('sin ambientes ni dormitorios');
  if (!out.length) out.push('los datos están completos: es el precio o la demanda');
  return out;
}

// ── Oportunidades sin accionar ────────────────────────────────────────────────

/**
 * Matches fuertes que nadie movió. Se lee sobre lo que ya se recomendó, no
 * sobre el barrido: acá interesa lo que el sistema mostró y quedó frío.
 */
async function oportunidadesSinAccion({ agenteId = '', horas = 48, limit = 20 } = {}) {
  const corte = new Date(Date.now() - horas * 60 * 60 * 1000);

  const filtro = {
    bucket: 'fuerte',
    status: { $in: ['pending', 'viewed'] },
    createdAt: { $lte: corte },
  };
  if (agenteId) filtro.colocadorId = String(agenteId);

  const recs = await MatchRecommendation.find(filtro)
    .sort({ score: -1, createdAt: 1 })
    .limit(limit)
    .lean();

  const clienteIds = [...new Set(recs.map((r) => r.clienteId))];
  const propIds = [...new Set(recs.map((r) => r.propiedadId))];

  const [clientes, propiedades] = await Promise.all([
    Cliente.find({ _id: { $in: clienteIds } }).select('nombre agenteId').lean(),
    Propiedad.find({ _id: { $in: propIds } }).select('title slug status').lean(),
  ]);

  const cliMap = new Map(clientes.map((c) => [String(c._id), c]));
  const propMap = new Map(propiedades.map((p) => [String(p._id), p]));

  return {
    horas,
    total: recs.length,
    oportunidades: recs.map((r) => ({
      id: String(r._id),
      score: r.score,
      titulo: r.titulo,
      status: r.status,
      diasSinAccion: Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (24 * 60 * 60 * 1000)),
      cliente: { id: r.clienteId, nombre: cliMap.get(r.clienteId)?.nombre || 'Cliente eliminado' },
      propiedad: {
        id: r.propiedadId,
        titulo: propMap.get(r.propiedadId)?.title || 'Propiedad eliminada',
        slug: propMap.get(r.propiedadId)?.slug || '',
        estado: propMap.get(r.propiedadId)?.status || '',
      },
      colocadorId: r.colocadorId,
      captadorId: r.captadorId,
      cruzado: !!(r.captadorId && r.colocadorId && r.captadorId !== r.colocadorId),
    })),
  };
}

module.exports = {
  barridoCompleto,
  coberturaDeCartera,
  demandaInsatisfecha,
  propiedadesHuerfanas,
  oportunidadesSinAccion,
  invalidarBarrido,
  bandaPrecio,
  UMBRAL_COBERTURA,
};
