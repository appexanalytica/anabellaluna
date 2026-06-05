/**
 * ProviderFactory.js
 * Singleton que retorna la instancia del proveedor de WhatsApp configurado.
 * El proveedor se selecciona mediante la variable de entorno WHATSAPP_PROVIDER.
 */

const EvolutionProvider = require('../infrastructure/providers/EvolutionProvider');

let _instance = null;

/**
 * Retorna la instancia singleton del proveedor activo.
 * @returns {import('../domain/interfaces/WhatsappProvider')}
 */
function getProvider() {
  if (!_instance) {
    const providerName = process.env.WHATSAPP_PROVIDER || 'evolution';

    switch (providerName) {
      case 'evolution':
        _instance = new EvolutionProvider();
        break;
      default:
        throw new Error(`Unknown WhatsApp provider: ${providerName}`);
    }
  }

  return _instance;
}

/**
 * Resetear el singleton — útil para tests.
 */
function resetProvider() {
  _instance = null;
}

module.exports = { getProvider, resetProvider };
