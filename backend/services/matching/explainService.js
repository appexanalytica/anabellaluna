/**
 * Explain Service — La IA redacta, no decide.
 *
 * Recibe un match con el puntaje YA calculado y escribe por qué esa propiedad
 * es para ese cliente, en el idioma de un colega, no de un folleto.
 *
 * Tres reglas que no se negocian:
 *   1. Solo puede afirmar cosas que estén en los hechos que se le pasan.
 *   2. Las objeciones son obligatorias. Un motor que solo dice cosas lindas es
 *      un folleto; uno que avisa "no tiene cochera, anticipalo" es un colega.
 *   3. Todo número que aparezca en el texto se valida contra los hechos antes
 *      de guardarse. Si no valida, se descarta la redacción y se usa la
 *      plantilla determinista.
 */

const { chatCompletion } = require('../ai/providerAbstraction');
const { slug } = require('./normalize');

const MODELO_EXPLICACION = process.env.OPENAI_EXPLAIN_MODEL || '';

const PROMPT = `Sos un agente inmobiliario argentino con veinte años de oficio. Recibís un cruce entre un cliente y una propiedad que YA fue puntuado por el sistema, y escribís la recomendación para el agente que va a atenderlo.

Reglas:
- No inventes NADA. Solo podés afirmar lo que está en los datos. Si un dato no está, no lo menciones.
- No repitas números que no estén en los datos. Nada de estimaciones propias.
- No uses lenguaje de aviso publicitario ("¡Oportunidad única!"). Escribí como le hablarías a un colega.
- Las objeciones son obligatorias: si no encontrás ninguna, decí qué habría que confirmar antes de mostrarla.
- Español rioplatense, voseo, frases cortas.

Devolvé exactamente este JSON:
{
  "titulo": "una línea que diga por qué esta propiedad para este cliente, sin signos de exclamación",
  "porQue": ["2 a 4 razones concretas, cada una apoyada en un dato real"],
  "objeciones": ["1 a 3 cosas que no cumple o que conviene anticipar antes de la visita"],
  "accionSugerida": "el próximo paso concreto, en una frase",
  "mensajeWhatsapp": "mensaje corto y natural para mandarle al cliente, tuteando o voseando según corresponda, sin emojis, sin precios que no estén en los datos"
}`;

// ── Hechos que se le entregan al modelo ───────────────────────────────────────

function hechosDelMatch(prop, cli, evaluacion) {
  const dims = Object.entries(evaluacion.breakdown || {})
    .filter(([, d]) => d.aplica)
    .map(([nombre, d]) => `${nombre}: ${Math.round(d.score * 100)}% (${d.detalle || 'sin detalle'})`);

  return {
    propiedad: limpiar({
      titulo: prop.titulo,
      operacion: prop.operacion,
      tipo: prop.tipo,
      precio: prop.precio,
      moneda: prop.moneda,
      expensas: prop.expensas,
      barrio: prop.barrio,
      ciudad: prop.ciudad,
      direccion: prop.direccion,
      ambientes: prop.ambientes,
      dormitorios: prop.dormitorios,
      banos: prop.banos,
      cocheras: prop.cocheras,
      m2Cubierta: prop.m2Cubierta,
      m2Total: prop.m2Total,
      antiguedad: prop.antiguedad,
      amenities: prop.amenities,
      estado: prop.estado,
      exclusiva: prop.exclusiva,
    }),
    cliente: limpiar({
      nombre: cli.nombre,
      tipoCliente: cli.tipoCliente,
      busca: cli.operacion,
      presupuesto: cli.presupuesto,
      moneda: cli.moneda,
      zonas: cli.zonas,
      tipoPropiedad: cli.tipoPropiedad,
      ambientes: cli.ambientes,
      dormitorios: cli.dormitorios,
      banos: cli.banos,
      superficieBuscada: cli.m2Cubierta,
      caracteristicasPedidas: cli.caracteristicas,
      expensasMaximas: cli.expensasMaximas,
      mascotas: cli.mascotas,
      fechaMudanza: cli.fechaMudanza,
    }),
    puntaje: {
      total: evaluacion.score,
      banda: evaluacion.bucket,
      dimensiones: dims,
    },
  };
}

function limpiar(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue;
    out[k] = v;
  }
  return out;
}

// ── Validación anti-invento ───────────────────────────────────────────────────

/** Todos los números que el modelo tiene permitido mencionar. */
function numerosPermitidos(prop, cli, evaluacion) {
  const nums = new Set();

  const agregar = (v) => {
    const n = Number(v);
    if (Number.isFinite(n)) nums.add(Math.round(Math.abs(n)));
  };

  [
    prop.precio, prop.expensas, prop.ambientes, prop.dormitorios, prop.banos,
    prop.cocheras, prop.m2Cubierta, prop.m2Total, prop.antiguedad, prop.anioConstruccion,
    cli.presupuesto, cli.presupuestoMinUSD, cli.presupuestoMaxUSD, cli.ambientes,
    cli.dormitorios, cli.banos, cli.m2Cubierta, cli.m2Total, cli.expensasMaximas,
    evaluacion.score,
  ].forEach(agregar);

  // El precio en la otra moneda también es un dato real del sistema.
  agregar(prop.precioUSD);
  agregar(cli.presupuestoUSD);

  return nums;
}

/**
 * Devuelve el primer número inventado que aparezca en el texto, o null.
 *
 * Se toleran: cantidades chicas (son conteos: "dos ambientes"), porcentajes,
 * y una diferencia del 1% por redondeo de la conversión de moneda.
 */
function numeroInventado(texto, permitidos) {
  const encontrados = String(texto || '').match(/\d[\d.,]*/g) || [];

  for (const raw of encontrados) {
    // Un porcentaje explícito no es un dato de la ficha.
    const idx = String(texto).indexOf(raw);
    if (String(texto)[idx + raw.length] === '%') continue;

    const limpio = raw.replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
    const n = Math.round(Math.abs(Number(limpio)));
    if (!Number.isFinite(n)) continue;

    if (n <= 12) continue;               // conteos y cantidades chicas
    if (n >= 1900 && n <= 2100) continue; // años

    let ok = false;
    for (const p of permitidos) {
      if (p === n) { ok = true; break; }
      if (p > 0 && Math.abs(p - n) / p <= 0.01) { ok = true; break; }
    }
    if (!ok) return raw;
  }

  return null;
}

function textoCompleto(exp) {
  return [
    exp.titulo,
    ...(exp.porQue || []),
    ...(exp.objeciones || []),
    exp.accionSugerida,
    exp.mensajeWhatsapp,
  ].filter(Boolean).join(' ');
}

// ── Plantilla determinista ────────────────────────────────────────────────────

const NOMBRE_DIM = {
  precio: 'el precio',
  ubicacion: 'la zona',
  tipologia: 'la tipología',
  superficie: 'la superficie',
  semantico: 'el perfil general',
  senales: 'lo que ya miró',
  rentabilidad: 'la rentabilidad',
  costoTotal: 'el costo total',
};

/**
 * Explicación sin IA. No es un plan B decorativo: si OpenAI no contesta, el
 * panel sigue mostrando algo útil en vez de romperse.
 */
function explicacionPlantilla(prop, cli, evaluacion) {
  const dims = Object.entries(evaluacion.breakdown || {}).filter(([, d]) => d.aplica);

  const fuertes = dims.filter(([, d]) => d.score >= 0.8).sort((a, b) => b[1].puntos - a[1].puntos);
  const flojas  = dims.filter(([, d]) => d.score < 0.5).sort((a, b) => a[1].score - b[1].score);

  const tituloProp = prop.titulo || 'Propiedad';
  // El título suele traer ya el barrio: repetirlo queda como error de máquina.
  const ubicacionCruda = [prop.barrio, prop.ciudad].filter(Boolean).join(', ');
  const tituloSlug = slug(tituloProp);
  const ubicacion = ubicacionCruda && !tituloSlug.includes(slug(prop.barrio || prop.ciudad))
    ? ubicacionCruda
    : '';
  const precio = prop.precio ? `${prop.moneda} ${prop.precio.toLocaleString('es-AR')}` : 'sin precio cargado';

  const porQue = fuertes.slice(0, 3).map(([nombre, d]) => {
    const etiqueta = NOMBRE_DIM[nombre] || nombre;
    return `Coincide en ${etiqueta}${d.detalle ? `: ${d.detalle}` : ''}`;
  });

  if (!porQue.length) porQue.push(`Entra dentro de lo que busca ${cli.nombre || 'el cliente'}`);

  const objeciones = flojas.slice(0, 2).map(([nombre, d]) => {
    const etiqueta = NOMBRE_DIM[nombre] || nombre;
    return `Flojo en ${etiqueta}${d.detalle ? `: ${d.detalle}` : ''}`;
  });

  if (!objeciones.length) objeciones.push('Confirmá disponibilidad y estado antes de ofrecer la visita');

  return {
    titulo: `${tituloProp}${ubicacion ? ` en ${ubicacion}` : ''} para ${cli.nombre || 'el cliente'}`,
    porQue,
    objeciones,
    accionSugerida: 'Contactar al cliente y proponer una visita',
    mensajeWhatsapp: `Hola ${(cli.nombre || '').split(' ')[0] || ''}, apareció ${tituloProp}${ubicacion ? ` en ${ubicacion}` : ''} a ${precio}. ¿Querés que coordinemos para verla?`.replace(/\s+/g, ' ').trim(),
    explicadoPor: 'plantilla',
    model: '',
  };
}

// ── API ───────────────────────────────────────────────────────────────────────

function safeJsonParse(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch { /* sigue */ }
  const m = String(text).match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

/**
 * Redacta la explicación de un match.
 * Nunca lanza: ante cualquier problema devuelve la versión de plantilla.
 */
async function explicar(prop, cli, evaluacion, { userId = 'system' } = {}) {
  const plantilla = explicacionPlantilla(prop, cli, evaluacion);

  try {
    const hechos = hechosDelMatch(prop, cli, evaluacion);

    const result = await chatCompletion({
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: JSON.stringify(hechos, null, 2) },
      ],
      maxTokens: 700,
      responseFormat: { type: 'json_object' },
      ...(MODELO_EXPLICACION ? { model: MODELO_EXPLICACION } : {}),
      userId,
    });

    const parsed = safeJsonParse(result?.choices?.[0]?.message?.content || '');
    if (!parsed?.titulo || !Array.isArray(parsed.porQue) || !parsed.porQue.length) {
      return plantilla;
    }

    const explicacion = {
      titulo: String(parsed.titulo).slice(0, 200),
      porQue: parsed.porQue.slice(0, 4).map((t) => String(t).slice(0, 300)),
      objeciones: Array.isArray(parsed.objeciones) ? parsed.objeciones.slice(0, 3).map((t) => String(t).slice(0, 300)) : [],
      accionSugerida: String(parsed.accionSugerida || '').slice(0, 200),
      mensajeWhatsapp: String(parsed.mensajeWhatsapp || '').slice(0, 600),
      explicadoPor: 'ia',
      model: result?.choices?.[0]?.model || '',
    };

    // Sin objeciones no se publica: es la parte que le da credibilidad.
    if (!explicacion.objeciones.length) {
      explicacion.objeciones = plantilla.objeciones;
    }

    const inventado = numeroInventado(textoCompleto(explicacion), numerosPermitidos(prop, cli, evaluacion));
    if (inventado) {
      console.warn(`[matching] Explicación descartada: número inventado "${inventado}" en ${prop.id}/${cli.id}`);
      return plantilla;
    }

    return explicacion;

  } catch (err) {
    console.warn(`[matching] Explicación sin IA (${prop.id}/${cli.id}): ${err.message}`);
    return plantilla;
  }
}

module.exports = {
  explicar,
  explicacionPlantilla,
  numeroInventado,
  numerosPermitidos,
  hechosDelMatch,
};
