/**
 * Scoring Engine — Puntaje determinista de un cruce cliente ↔ propiedad.
 *
 * Acá NO hay inteligencia artificial. Son reglas, y esa es la idea: el puntaje
 * tiene que ser auditable y reproducible. Un modelo que "estima" si un precio
 * entra en el presupuesto se equivoca una vez delante de un cliente y el agente
 * no vuelve a abrir el panel.
 *
 * La IA entra después, y solo para redactar sobre este resultado ya calculado.
 *
 * Dos etapas:
 *   1. vetar()  — descarta lo imposible (operación, estado, precio, mascotas…)
 *   2. puntuar() — 0 a 100 con el desglose por dimensión
 *
 * Si una dimensión no tiene datos de los dos lados, se saca del cálculo y su
 * peso se reparte entre las demás. Una ficha incompleta baja la confianza del
 * match, no su puntaje.
 */

const { cosineSimilarity } = require('../ai/embeddings');
const { slug } = require('./normalize');
const { pesosPara, bucket } = require('./weights');

const DIAS_MS = 24 * 60 * 60 * 1000;

// Rango útil del coseno con text-embedding-3-small: por debajo de 0,15 no hay
// relación, por encima de 0,70 ya es prácticamente el mismo texto.
const COS_MIN = 0.15;
const COS_MAX = 0.70;

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

function num(v) {
  return Number.isFinite(v) ? v : null;
}

// ── Etapa 1: vetos ────────────────────────────────────────────────────────────

/**
 * Descarta lo que no puede recomendarse nunca.
 * @returns {{veto: boolean, motivo?: string}}
 */
function vetar(prop, cli) {
  if (!prop || !cli) return { veto: true, motivo: 'datos incompletos' };

  // Venta y alquiler no se cruzan jamás.
  if (prop.operacion && cli.operacion && prop.operacion !== cli.operacion) {
    return { veto: true, motivo: `la propiedad es en ${prop.operacion} y el cliente busca en ${cli.operacion}` };
  }

  const estado = slug(prop.estado);
  if (estado && estado !== 'disponible') {
    return { veto: true, motivo: `la propiedad está ${prop.estado}` };
  }

  // Presupuesto: el que busca hasta 100 mira una de 110, no una de 200.
  const precio = num(prop.precioUSD);
  const corte  = num(cli.presupuestoCorteUSD);
  if (precio !== null && corte !== null && precio > corte) {
    return { veto: true, motivo: 'el precio se pasa del presupuesto' };
  }

  // Mascotas: solo veta cuando la propiedad dice explícitamente que no acepta.
  if (cli.mascotas === true && prop.mascotas === false) {
    return { veto: true, motivo: 'la propiedad no acepta mascotas' };
  }

  // Expensas por encima del tope declarado, con 10% de tolerancia.
  const expensas = num(prop.expensas);
  const tope     = num(cli.expensasMaximas);
  if (expensas !== null && tope !== null && expensas > tope * 1.1) {
    return { veto: true, motivo: 'las expensas superan el máximo que puede pagar' };
  }

  // Disponibilidad contra la fecha de mudanza, con 30 días de aire.
  if (prop.disponibleDesde && cli.fechaMudanza) {
    const desde   = new Date(prop.disponibleDesde).getTime();
    const mudanza = new Date(cli.fechaMudanza).getTime();
    if (Number.isFinite(desde) && Number.isFinite(mudanza) && desde > mudanza + 30 * DIAS_MS) {
      return { veto: true, motivo: 'se libera después de la fecha en que necesita mudarse' };
    }
  }

  return { veto: false };
}

// ── Dimensiones ───────────────────────────────────────────────────────────────

/**
 * Precio contra el rango del cliente.
 * Penalización asimétrica: pasarse duele más que quedar por debajo.
 */
function dimPrecio(prop, cli) {
  const precio = num(prop.precioUSD);
  const ref    = num(cli.presupuestoRefUSD) ?? num(cli.presupuestoUSD);
  const min    = num(cli.presupuestoMinUSD);
  const corte  = num(cli.presupuestoCorteUSD);

  if (precio === null || ref === null || ref <= 0) return { aplica: false };

  // Hasta el número que dijo el cliente, puntaje pleno.
  if (precio <= ref) {
    if (min === null || precio >= min) {
      return { aplica: true, score: 1, detalle: 'entra en el presupuesto' };
    }
    // Muy por debajo suele ser otro segmento, no una ganga.
    const ratio = clamp(precio / min);
    return { aplica: true, score: 0.6 + 0.4 * ratio, detalle: 'muy por debajo del presupuesto' };
  }

  // Por encima ya es estirarse: cae hasta cero al llegar al corte duro.
  const techo = corte !== null && corte > ref ? corte : ref * 1.2;
  const exceso = clamp((precio - ref) / (techo - ref));
  const sobre = Math.round(((precio / ref) - 1) * 100);

  return { aplica: true, score: 1 - exceso, detalle: `${sobre}% por encima del presupuesto` };
}

/**
 * Ubicación: se queda con la MEJOR de las zonas de interés, no el promedio.
 * El promedio castigaría al cliente que agrega una zona más.
 *
 * Solo compara texto: los clientes no tienen coordenadas cargadas, así que la
 * distancia geográfica no se puede calcular de este lado.
 */
function dimUbicacion(prop, cli) {
  const zonas = Array.isArray(cli.zonas) ? cli.zonas.filter(Boolean) : [];
  if (!zonas.length) return { aplica: false };

  const campos = [prop.barrio, prop.ciudad, prop.direccion, prop.provincia]
    .map(slug)
    .filter(Boolean);

  if (!campos.length) return { aplica: false };

  const barrio = slug(prop.barrio);
  const ciudad = slug(prop.ciudad);

  let mejor = 0;
  let mejorZona = '';

  zonas.forEach((zonaRaw, index) => {
    const zona = slug(zonaRaw);
    if (!zona) return;

    let s = 0.15; // el cliente puede ser flexible: no coincidir no es cero
    if (barrio && (barrio === zona || barrio.includes(zona) || zona.includes(barrio))) s = 0.95;
    else if (campos.some((c) => c.includes(zona) || zona.includes(c))) s = 0.72;
    else if (ciudad && (ciudad.includes(zona) || zona.includes(ciudad))) s = 0.5;

    // La primera zona es la principal: solo ahí se llega al puntaje pleno.
    if (index === 0 && s > 0.15) s = clamp(s + 0.05);

    if (s > mejor) { mejor = s; mejorZona = zonaRaw; }
  });

  return {
    aplica: true,
    score: mejor,
    detalle: mejor >= 0.75 ? `coincide con ${mejorZona}` : 'fuera de las zonas pedidas',
  };
}

/** Cercanía entre dos cantidades, con tolerancia de ±1 y caída suave. */
function cercania(pedido, real, tolerancia = 1) {
  if (pedido === null || real === null) return null;
  const diff = Math.abs(pedido - real);
  if (diff === 0) return 1;
  if (diff <= tolerancia) return 0.75;
  if (diff <= tolerancia + 1) return 0.4;
  return 0.1;
}

/** Tipo de propiedad, dormitorios, ambientes y baños. */
function dimTipologia(prop, cli) {
  const partes = [];

  if (cli.tipoPropiedad && prop.tipo) {
    partes.push({ peso: 0.5, score: cli.tipoPropiedad === prop.tipo ? 1 : 0.2 });
  }

  const dorm = cercania(num(cli.dormitorios), num(prop.dormitorios));
  if (dorm !== null) partes.push({ peso: 0.3, score: dorm });

  const amb = cercania(num(cli.ambientes), num(prop.ambientes));
  if (amb !== null) partes.push({ peso: 0.1, score: amb });

  const banos = cercania(num(cli.banos), num(prop.banos));
  if (banos !== null) partes.push({ peso: 0.1, score: banos });

  if (!partes.length) return { aplica: false };

  const pesoTotal = partes.reduce((acc, p) => acc + p.peso, 0);
  const score = partes.reduce((acc, p) => acc + p.peso * p.score, 0) / pesoTotal;

  return { aplica: true, score, detalle: score >= 0.8 ? 'la tipología coincide' : 'la tipología difiere' };
}

/** Superficie: quedarse corto penaliza, sobrar no. */
function dimSuperficie(prop, cli) {
  const pedido = num(cli.m2Cubierta) ?? num(cli.m2Total);
  const real   = num(prop.m2Cubierta) ?? num(prop.m2Total);

  if (pedido === null || real === null || pedido <= 0) return { aplica: false };

  const ratio = real / pedido;
  if (ratio >= 1) return { aplica: true, score: 1, detalle: 'cumple la superficie pedida' };

  return { aplica: true, score: clamp(ratio ** 1.5), detalle: 'más chica de lo pedido' };
}

/**
 * Similitud semántica entre el perfil del cliente y el de la propiedad.
 * Es lo que captura lo que los campos no dicen.
 */
function dimSemantico(embProp, embCli) {
  if (!Array.isArray(embProp) || !Array.isArray(embCli) || !embProp.length || !embCli.length) {
    return { aplica: false };
  }

  const cos = cosineSimilarity(embCli, embProp);
  const score = clamp((cos - COS_MIN) / (COS_MAX - COS_MIN));

  return { aplica: true, score, detalle: `afinidad ${(cos * 100).toFixed(0)}%`, cos };
}

/**
 * Señales de comportamiento: qué zonas y tipologías ya miró este cliente.
 * Lo que ya visitó pesa más que lo que declaró en la ficha.
 */
function dimSenales(prop, contexto) {
  const historial = contexto?.historialCliente;

  // Sin historial no hay señal que leer. La dimensión no aplica y su peso se
  // reparte: inventar un 0,5 sería castigar al cliente nuevo por serlo.
  if (!historial || (!historial.barrios?.length && !historial.tipos?.length)) {
    return { aplica: false };
  }

  const partes = [];

  if (historial.barrios?.length) {
    const barrio = slug(prop.barrio);
    partes.push({ peso: 0.45, score: barrio && historial.barrios.includes(barrio) ? 1 : 0.2 });
  }
  if (historial.tipos?.length) {
    partes.push({ peso: 0.35, score: prop.tipo && historial.tipos.includes(prop.tipo) ? 1 : 0.2 });
  }

  // Una exclusiva conviene moverla antes: la inmobiliaria la controla.
  partes.push({ peso: 0.2, score: prop.exclusiva ? 1 : 0.5 });

  if (!partes.length) return { aplica: false };

  const pesoTotal = partes.reduce((acc, p) => acc + p.peso, 0);
  const score = partes.reduce((acc, p) => acc + p.peso * p.score, 0) / pesoTotal;

  return { aplica: true, score, detalle: 'según lo que ya miró' };
}

/**
 * Rentabilidad para inversores: precio por m2 contra la mediana de la zona
 * en la propia cartera. Comprar por debajo de la mediana es la señal.
 */
function dimRentabilidad(prop, contexto) {
  const medianas = contexto?.medianaPrecioM2 || {};
  const m2 = num(prop.m2Cubierta) ?? num(prop.m2Total);
  const precio = num(prop.precioUSD);

  if (!m2 || !precio) return { aplica: false };

  const zona = slug(prop.barrio) || slug(prop.ciudad);
  const mediana = num(medianas[zona]);
  if (!mediana) return { aplica: false };

  const propio = precio / m2;
  const ratio = propio / mediana;

  // 20% por debajo de la mediana o mejor → puntaje pleno.
  const score = clamp((1.2 - ratio) / 0.4);

  return {
    aplica: true,
    score,
    detalle: ratio < 1 ? 'por debajo del precio por m2 de la zona' : 'por encima del precio por m2 de la zona',
  };
}

/** Costo total del alquiler: precio más expensas contra lo que puede pagar. */
function dimCostoTotal(prop, cli) {
  const expensas = num(prop.expensas);
  const tope     = num(cli.expensasMaximas);
  if (expensas === null || tope === null || tope <= 0) return { aplica: false };

  const ratio = expensas / tope;
  if (ratio <= 0.7) return { aplica: true, score: 1, detalle: 'expensas cómodas' };
  if (ratio <= 1) return { aplica: true, score: 0.8, detalle: 'expensas dentro del tope' };

  return { aplica: true, score: clamp(1 - (ratio - 1) / 0.1) * 0.5, detalle: 'expensas al límite' };
}

// ── Etapa 2: puntaje ──────────────────────────────────────────────────────────

/**
 * Puntúa un cruce ya vetado.
 *
 * @param {object} prop      facts de la propiedad
 * @param {object} cli       facts del cliente
 * @param {object} pesos     pesos por dimensión (weights.pesosPara)
 * @param {object} contexto  { embProp, embCli, historialCliente, medianaPrecioM2 }
 */
function puntuar(prop, cli, pesos, contexto = {}) {
  const dims = {
    precio:       dimPrecio(prop, cli),
    ubicacion:    dimUbicacion(prop, cli),
    tipologia:    dimTipologia(prop, cli),
    superficie:   dimSuperficie(prop, cli),
    semantico:    dimSemantico(contexto.embProp, contexto.embCli),
    senales:      dimSenales(prop, contexto),
    rentabilidad: dimRentabilidad(prop, contexto),
    costoTotal:   dimCostoTotal(prop, cli),
  };

  let sumaPesos = 0;
  let suma = 0;
  const breakdown = {};

  for (const [nombre, peso] of Object.entries(pesos)) {
    const dim = dims[nombre];
    if (!dim || !dim.aplica) {
      breakdown[nombre] = { aplica: false, peso };
      continue;
    }
    const score = clamp(dim.score);
    sumaPesos += peso;
    suma += peso * score;
    breakdown[nombre] = {
      aplica: true,
      peso,
      score: Math.round(score * 100) / 100,
      puntos: Math.round(peso * score * 10) / 10,
      detalle: dim.detalle || '',
    };
  }

  // Sin ninguna dimensión comparable no hay match que mostrar.
  if (sumaPesos === 0) {
    return { score: 0, bucket: null, breakdown, cobertura: 0 };
  }

  const score = Math.round((suma / sumaPesos) * 100);

  // Qué porción del criterio se pudo evaluar: mide la confianza del puntaje.
  const cobertura = Math.round((sumaPesos / Object.values(pesos).reduce((a, b) => a + b, 0)) * 100);

  return {
    score,
    bucket: bucketConCobertura(score, cobertura),
    breakdown,
    cobertura,
  };
}

/**
 * Un 100 calculado sobre una sola dimensión no es un match fuerte: es un dato
 * suelto. Con poca cobertura la banda baja, aunque el puntaje se mantenga —
 * el agente merece saber que el sistema casi no tuvo con qué comparar.
 */
function bucketConCobertura(score, cobertura) {
  const banda = bucket(score);
  if (!banda) return null;

  if (cobertura < 30) return 'alternativa';
  if (cobertura < 50 && banda === 'fuerte') return 'buena';

  return banda;
}

/**
 * Evalúa un cruce completo: veta y, si pasa, puntúa.
 */
function evaluar(prop, cli, pesos, contexto = {}) {
  const veto = vetar(prop, cli);
  if (veto.veto) {
    return { score: 0, bucket: null, veto: true, motivoVeto: veto.motivo, breakdown: {}, cobertura: 0 };
  }
  return { ...puntuar(prop, cli, pesos, contexto), veto: false };
}

module.exports = {
  vetar,
  puntuar,
  evaluar,
  pesosPara,
  bucket,
  bucketConCobertura,
  // exportadas para tests
  dimPrecio,
  dimUbicacion,
  dimTipologia,
  dimSuperficie,
  dimSemantico,
  dimSenales,
  dimRentabilidad,
  dimCostoTotal,
};
