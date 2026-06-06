/**
 * Service-to-Service Authentication Middleware.
 *
 * Permite que el AI Gateway Python (u otros microservicios internos)
 * llame las APIs de Node.js con autenticación dedicada,
 * separada de los JWT de usuarios.
 *
 * Header requerido: X-Service-Key: <INTERNAL_SERVICE_KEY>
 *
 * El req.service queda poblado con el contexto del servicio.
 */

const INTERNAL_SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY;

/**
 * Middleware que valida la X-Service-Key.
 * Usar en routes que los microservicios internos necesitan llamar.
 */
function authenticateService(req, res, next) {
  if (!INTERNAL_SERVICE_KEY) {
    console.warn('[ServiceAuth] INTERNAL_SERVICE_KEY not configured — service auth disabled');
    return res.status(503).json({
      error: 'Service authentication not configured',
      code: 'SERVICE_AUTH_UNCONFIGURED',
    });
  }

  const key = req.headers['x-service-key'];

  if (!key || key !== INTERNAL_SERVICE_KEY) {
    return res.status(401).json({
      error: 'Invalid or missing service key',
      code: 'INVALID_SERVICE_KEY',
    });
  }

  // Poblar contexto del servicio en el request
  req.service = {
    name: req.headers['x-service-name'] || 'unknown',
    isService: true,
    isAdmin: true, // Los servicios internos tienen acceso completo de lectura
  };

  next();
}

/**
 * Middleware que acepta TANTO un JWT de usuario como una X-Service-Key.
 * Útil para endpoints que pueden ser llamados por usuarios O por servicios.
 *
 * Si hay X-Service-Key válida → req.service = { isService: true }
 * Si hay JWT válido → req.user = { ... } (flujo normal)
 * Si ninguno → 401
 */
function authenticateTokenOrService(req, res, next) {
  const serviceKey = req.headers['x-service-key'];

  if (serviceKey) {
    return authenticateService(req, res, next);
  }

  // Delegar al middleware JWT normal
  const { authenticateToken } = require('../auth');
  return authenticateToken(req, res, next);
}

module.exports = { authenticateService, authenticateTokenOrService };
