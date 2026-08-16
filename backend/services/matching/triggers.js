/**
 * Disparadores del motor de recomendaciones.
 *
 * Escucha los eventos de negocio que ya emite el CRM y reacciona:
 *   propiedad nueva / publicada / cambió de precio → ¿a quién le sirve?
 *   cliente nuevo o con requisitos cambiados       → ¿qué tenemos para él?
 *
 * Todo pasa por una espera de un minuto. Cuando alguien carga una propiedad
 * la guarda cuatro veces seguidas mientras completa campos: sin eso, se
 * dispararía el barrido cuatro veces y el agente recibiría cuatro avisos.
 */

const { eventBus } = require('../../utils/eventBus');
const profileService = require('./profileService');
const matchService = require('./matchService');
const notifyService = require('./notifyService');

const ESPERA_MS = 60 * 1000;

// entityKey → { timer, motivo }
const pendientes = new Map();

let iniciado = false;

function programar(tipo, id, motivo) {
  if (!id) return;
  const key = `${tipo}:${id}`;

  const previo = pendientes.get(key);
  if (previo) clearTimeout(previo.timer);

  const timer = setTimeout(() => {
    pendientes.delete(key);
    procesar(tipo, id, motivo).catch((err) => {
      console.error(`[matching] Disparador ${key} falló:`, err.message);
    });
  }, ESPERA_MS);

  // No sostiene el proceso vivo si es lo único que queda pendiente.
  if (typeof timer.unref === 'function') timer.unref();

  pendientes.set(key, { timer, motivo });
}

async function procesar(tipo, id, motivo) {
  // El perfil se regenera primero: el aviso tiene que salir con los datos
  // nuevos, no con los de antes de la edición.
  await profileService.ensureProfile(tipo, id, { force: true });
  matchService.invalidarVectores(tipo);

  if (tipo === 'propiedad') {
    const r = await notifyService.notificarPropiedad(id, { motivo });
    if (r.enviadas) console.log(`[matching] Propiedad ${id}: ${r.enviadas} agentes avisados`);
    return;
  }

  const r = await notifyService.notificarCliente(id);
  if (r.enviadas) console.log(`[matching] Cliente ${id}: agente avisado`);
}

/**
 * Conecta los listeners. Se llama una sola vez, desde el proceso de la API
 * (que es donde se emiten los eventos y corre con una única instancia).
 */
function init() {
  if (iniciado) return;
  iniciado = true;

  eventBus.on('property.created',   (p) => programar('propiedad', p?.property_id, 'nueva'));
  eventBus.on('property.published', (p) => programar('propiedad', p?.property_id, 'publicada'));
  eventBus.on('property.updated',   (p) => programar('propiedad', p?.property_id, 'actualizada'));

  eventBus.on('client.created', (p) => programar('cliente', p?.client_id, 'nuevo'));
  eventBus.on('client.updated', (p) => programar('cliente', p?.client_id, 'actualizado'));

  console.log('[matching] Disparadores conectados (propiedades y clientes)');
}

/** Para los tests y el apagado ordenado. */
function stop() {
  for (const { timer } of pendientes.values()) clearTimeout(timer);
  pendientes.clear();
}

module.exports = { init, stop, programar, ESPERA_MS };
