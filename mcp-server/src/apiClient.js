/**
 * API Client interno para MCP Server.
 *
 * Las tools de escritura deben pasar por el backend Node.js —
 * no tocar MongoDB directamente — para respetar la Regla 2:
 * "La IA JAMÁS debe escribir directamente en MongoDB."
 *
 * Toda operación de mutación pasa por las APIs del backend,
 * que tienen: validaciones, permisos, notificaciones, eventos y auditoría.
 */

const http = require('http');
const https = require('https');

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000';
const SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY || '';

/**
 * Hace una request HTTP al backend Node.js usando la service key.
 *
 * @param {string} method    GET, POST, PUT, PATCH, DELETE
 * @param {string} path      Ej: '/crm/clientes' o '/crm/clientes/abc123'
 * @param {object} [body]    Payload JSON para POST/PUT/PATCH
 * @param {object} [query]   Query params como objeto
 * @returns {Promise<any>}   Respuesta JSON del backend
 */
async function apiCall(method, path, body = null, query = null) {
  if (!SERVICE_KEY) {
    throw new Error(
      'INTERNAL_SERVICE_KEY no configurada. ' +
      'El MCP server no puede llamar la API del backend sin esta clave.'
    );
  }

  const url = new URL(path, BACKEND_URL);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const bodyStr = body ? JSON.stringify(body) : null;
  const transport = url.protocol === 'https:' ? https : http;

  const headers = {
    'Content-Type': 'application/json',
    'X-Service-Key': SERVICE_KEY,
    'X-Service-Name': 'mcp-server',
  };
  if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr);

  return new Promise((resolve, reject) => {
    const req = transport.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method,
        headers,
        timeout: 15000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) {
              const err = new Error(parsed.error || `HTTP ${res.statusCode}`);
              err.statusCode = res.statusCode;
              err.body = parsed;
              reject(err);
            } else {
              resolve(parsed);
            }
          } catch {
            reject(new Error(`Invalid JSON response from backend: ${data.slice(0, 200)}`));
          }
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Backend API timeout: ${method} ${path}`));
    });

    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ── Helpers de dominio ─────────────────────────────────────────────────────────

const clientes = {
  create: (data) => apiCall('POST', '/crm/clientes', data),
  update: (id, data) => apiCall('PUT', `/crm/clientes/${id}`, data),
  setFidelizado: (id, fidelizado) => apiCall('PUT', `/crm/clientes/${id}`, { fidelizado }),
};

const propiedades = {
  create: (data) => apiCall('POST', '/crm/propiedades', data),
  update: (id, data) => apiCall('PUT', `/crm/propiedades/${id}`, data),
  setPublished: (id, published) => apiCall('PATCH', `/crm/propiedades/${id}/publish`, { published }),
};

const citas = {
  create: (data) => apiCall('POST', '/crm/citas', data),
  update: (id, data) => apiCall('PUT', `/crm/citas/${id}`, data),
  cancel: (id) => apiCall('DELETE', `/crm/citas/${id}`),
};

const tareas = {
  create: (data) => apiCall('POST', '/crm/tareas', data),
  update: (id, data) => apiCall('PUT', `/crm/tareas/${id}`, data),
  updateStatus: (id, status) => apiCall('PUT', `/crm/tareas/${id}`, { status }),
  delegate: (id, data) => apiCall('POST', `/crm/tareas/${id}/delegate`, data),
};

const operaciones = {
  create: (data) => apiCall('POST', '/crm/operaciones', data),
  update: (id, data) => apiCall('PUT', `/crm/operaciones/${id}`, data),
};

const agentes = {
  update: (id, data) => apiCall('PUT', `/crm/agentes/${id}`, data),
};

const bookings = {
  updateStatus: (id, status, adminNotes) => apiCall('PATCH', `/crm/bookings/${id}/status`, { status, adminNotes }),
};

const activities = {
  create: (data) => apiCall('POST', '/crm/activities', data),
};

const messages = {
  send: (data) => apiCall('POST', '/crm/messages/send', data),
  markRead: (messageId) => apiCall('PATCH', `/crm/messages/${messageId}/read`),
  markReadByPartner: (partnerId) => apiCall('PUT', `/crm/messages/read/${partnerId}`),
};

const notifications = {
  create: (data) => apiCall('POST', '/crm/notifications', data),
};

module.exports = {
  apiCall, clientes, propiedades, citas, tareas,
  operaciones, agentes, bookings, activities, messages, notifications,
};
