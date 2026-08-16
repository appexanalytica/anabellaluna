/**
 * Notificaciones del motor de recomendaciones.
 *
 * Cobertura del 100%, entrega agrupada.
 *
 * El motor evalúa y notifica todo lo que muestra el panel, pero manda UNA
 * notificación por evento con todos los clientes que matchean, no una por
 * match. Un agente con 30 clientes recibiría 30 avisos por cada propiedad
 * nueva, silenciaría el canal en tres días, y ahí perdería también los
 * matches fuertes. Lo que se regula es la interrupción, no la cobertura.
 */

const Notification = require('../../models/Notification');
const Propiedad = require('../../models/Propiedad');
const Cliente = require('../../models/Cliente');

const matchService = require('./matchService');
const currency = require('./currency');

// Tope de interrupciones por agente y por día.
const MAX_NOTIFICACIONES_DIA = 12;
const UMBRAL_PUSH = 80;   // de acá para arriba, prioridad alta
const UMBRAL_MINIMO = 50; // lo mismo que muestra el panel

async function notificacionesHoy(agenteId) {
  const desde = new Date();
  desde.setHours(0, 0, 0, 0);

  return Notification.countDocuments({
    agenteId: String(agenteId),
    tipo: 'match_sugerido',
    createdAt: { $gte: desde },
  });
}

function prioridadPara(mejorScore) {
  if (mejorScore >= UMBRAL_PUSH) return 'alta';
  if (mejorScore >= 65) return 'media';
  return 'baja';
}

/**
 * Entró o cambió una propiedad: avisa a cada agente cuántos de SUS clientes
 * la están esperando, en un solo mensaje.
 */
async function notificarPropiedad(propiedadId, { motivo = 'nueva' } = {}) {
  const propiedad = await Propiedad.findById(propiedadId).select('title published status').lean();
  if (!propiedad || !propiedad.published || propiedad.status !== 'Disponible') return { enviadas: 0 };

  // Sin agenteId se evalúa contra toda la cartera de clientes; después se
  // agrupa por el agente dueño de cada uno.
  const resultado = await matchService.propiedadAClientes(propiedadId, {
    limit: 200,
    minScore: UMBRAL_MINIMO,
    agenteId: '',
  });

  if (!resultado.matches.length) return { enviadas: 0 };

  const porAgente = new Map();
  for (const m of resultado.matches) {
    const agenteId = m.cliente.agenteId;
    if (!agenteId) continue;
    const grupo = porAgente.get(agenteId) || { clientes: [], mejorScore: 0 };
    grupo.clientes.push({ nombre: m.cliente.nombre, score: m.score });
    if (m.score > grupo.mejorScore) grupo.mejorScore = m.score;
    porAgente.set(agenteId, grupo);
  }

  const rate = await currency.getRate();
  let enviadas = 0;

  for (const [agenteId, grupo] of porAgente.entries()) {
    if (await notificacionesHoy(agenteId) >= MAX_NOTIFICACIONES_DIA) continue;

    // Se guardan las recomendaciones para que el agente las encuentre
    // explicadas al entrar, sin esperar a que se generen en ese momento.
    const suyos = resultado.matches.filter((m) => m.cliente.agenteId === agenteId);
    await matchService.explicarMatches(suyos, 'propiedad_a_cliente', { topK: 3, rate });

    const cantidad = grupo.clientes.length;
    const nombres = grupo.clientes
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((c) => c.nombre)
      .filter(Boolean);

    const verbo = motivo === 'precio' ? 'Con el precio nuevo, ' : '';
    const mensaje = cantidad === 1
      ? `${verbo}${nombres[0] || 'Un cliente tuyo'} está buscando algo así.`
      : `${verbo}${cantidad} clientes tuyos están buscando algo así${nombres.length ? `: ${nombres.join(', ')}${cantidad > nombres.length ? ' y otros' : ''}` : ''}.`;

    await Notification.create({
      agenteId: String(agenteId),
      tipo: 'match_sugerido',
      titulo: `${cantidad} ${cantidad === 1 ? 'cliente' : 'clientes'} para "${propiedad.title}"`,
      mensaje,
      prioridad: prioridadPara(grupo.mejorScore),
      entidadTipo: 'propiedad',
      entidadId: String(propiedadId),
      entidadNombre: propiedad.title || '',
      accionUrl: `/propiedades?id=${propiedadId}`,
    });

    enviadas += 1;
  }

  return { enviadas, agentes: porAgente.size };
}

/**
 * Se cargó o cambió un cliente: le avisa a su agente qué hay en cartera
 * para mostrarle, también en un solo mensaje.
 */
async function notificarCliente(clienteId) {
  const cliente = await Cliente.findById(clienteId).select('nombre agenteId').lean();
  if (!cliente?.agenteId) return { enviadas: 0 };

  if (await notificacionesHoy(cliente.agenteId) >= MAX_NOTIFICACIONES_DIA) return { enviadas: 0 };

  const resultado = await matchService.clienteAPropiedades(clienteId, {
    limit: 20,
    minScore: UMBRAL_MINIMO,
  });

  if (!resultado.matches.length) return { enviadas: 0 };

  const rate = await currency.getRate();
  await matchService.explicarMatches(resultado.matches, 'cliente_a_propiedad', { topK: 3, rate });

  const cantidad = resultado.matches.length;
  const mejor = resultado.matches[0];

  await Notification.create({
    agenteId: String(cliente.agenteId),
    tipo: 'match_sugerido',
    titulo: `${cantidad} ${cantidad === 1 ? 'propiedad' : 'propiedades'} para ${cliente.nombre}`,
    mensaje: `La mejor coincidencia es "${mejor.propiedad.titulo}" con ${mejor.score} puntos. Entrá a la ficha del cliente para verlas.`,
    prioridad: prioridadPara(mejor.score),
    entidadTipo: 'cliente',
    entidadId: String(clienteId),
    entidadNombre: cliente.nombre || '',
    accionUrl: `/clientes?id=${clienteId}`,
  });

  return { enviadas: 1 };
}

module.exports = {
  notificarPropiedad,
  notificarCliente,
  MAX_NOTIFICACIONES_DIA,
  UMBRAL_MINIMO,
  UMBRAL_PUSH,
};
