const express = require('express');
const { authenticateToken } = require('../auth');
const portales = require('../services/portalesInmobiliarios');

// ── Admin router (montado en /admin/portales) ────────────────────────────────

const adminRouter = express.Router();

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return next();
}

// GET /admin/portales — listado completo con estado de cada portal
adminRouter.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const list = await portales.listPortalesWithStatus();
    res.json({ portales: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/portales/:key/config — configuración de un portal
adminRouter.get('/:key/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const def = portales.getPortalDef(req.params.key);
    if (!def) return res.status(404).json({ error: 'Portal no encontrado' });
    const cfg = await portales.getPortalConfig(req.params.key);
    res.json({ portal: def.key, ...cfg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/portales/:key/config — guardar configuración
adminRouter.put('/:key/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const def = portales.getPortalDef(req.params.key);
    if (!def) return res.status(404).json({ error: 'Portal no encontrado' });
    const { enabled, accountId, accountEmail, contactEmail, contactPhone, inmobiliariaNombre } = req.body || {};
    const patch = {};
    if (enabled !== undefined) patch.enabled = !!enabled;
    if (accountId !== undefined) patch.accountId = String(accountId);
    if (accountEmail !== undefined) patch.accountEmail = String(accountEmail);
    if (contactEmail !== undefined) patch.contactEmail = String(contactEmail);
    if (contactPhone !== undefined) patch.contactPhone = String(contactPhone);
    if (inmobiliariaNombre !== undefined) patch.inmobiliariaNombre = String(inmobiliariaNombre);
    const next = await portales.savePortalConfig(req.params.key, patch);
    res.json({ ok: true, config: next });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/portales/:key/regenerate-token — nuevo token de feed
adminRouter.post('/:key/regenerate-token', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const def = portales.getPortalDef(req.params.key);
    if (!def) return res.status(404).json({ error: 'Portal no encontrado' });
    const next = await portales.regenerateFeedToken(req.params.key);
    res.json({ ok: true, feedToken: next.feedToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /admin/portales/:key/config — eliminar configuración del portal
adminRouter.delete('/:key/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const def = portales.getPortalDef(req.params.key);
    if (!def) return res.status(404).json({ error: 'Portal no encontrado' });
    await portales.deletePortalConfig(req.params.key);
    res.json({ ok: true, message: `Configuración de ${def.nombre} eliminada` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/portales/:key/preview — vista previa del feed (primeras 3 propiedades)
adminRouter.get('/:key/preview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const def = portales.getPortalDef(req.params.key);
    if (!def) return res.status(404).json({ error: 'Portal no encontrado' });
    const { xml, count, formato } = await portales.buildFeed(req.params.key, { limit: 3 });
    res.json({ ok: true, formato, count, xml });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Feed router (montado en /public/feeds, sin auth — protegido por token) ───

const feedRouter = express.Router();

// GET /public/feeds/:key.xml?token=xxx — feed que consume el portal
feedRouter.get('/:key.xml', async (req, res) => {
  try {
    const key = String(req.params.key || '');
    const def = portales.getPortalDef(key);
    if (!def) return res.status(404).send('Portal no encontrado');

    const cfg = await portales.getPortalConfig(key);
    if (!cfg.enabled) return res.status(403).send('Portal desactivado');
    if (!cfg.feedToken || req.query.token !== cfg.feedToken) {
      return res.status(401).send('Token inválido');
    }

    const { xml } = await portales.buildFeed(key);

    // Registrar el acceso en segundo plano (no bloquea la respuesta)
    setImmediate(() => {
      portales.registerPull(key).catch((e) => {
        console.error(`[Portales] Error registrando pull de ${key}:`, e.message);
      });
    });

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    console.error('[Portales] Error generando feed:', err.message);
    res.status(500).send('Error generando feed');
  }
});

module.exports = { adminRouter, feedRouter };
