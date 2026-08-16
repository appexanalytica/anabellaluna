/**
 * Cotización del dólar — Lectura para todo el CRM, carga solo para el admin.
 *
 * Prefix: /crm/cotizacion
 */

const express = require('express');
const { authenticateToken, requireCRMUser } = require('../auth');
const { authenticateTokenOrService } = require('../middlewares/serviceAuth');
const { requireAdmin } = require('../middlewares/rbac');
const User = require('../models/User');
const currency = require('../services/matching/currency');

const router = express.Router();

// GET /crm/cotizacion — estado actual (cualquier usuario del CRM)
router.get('/', authenticateTokenOrService, requireCRMUser, async (req, res) => {
  try {
    const rate = await currency.getRate();
    res.json({
      ...rate,
      staleDays: currency.STALE_DAYS,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /crm/cotizacion — cargar un valor nuevo (solo admin)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = String(req.user.sub || req.user.id || req.user._id || '');

    let nombre = req.user.username || '';
    try {
      const user = await User.findById(userId).select('nombre username').lean();
      if (user) nombre = user.nombre || user.username || nombre;
    } catch { /* el nombre es informativo: si falla, se guarda igual */ }

    const rate = await currency.setRate(req.body?.valor, { userId, nombre });

    res.json({
      success: true,
      ...rate,
      staleDays: currency.STALE_DAYS,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
