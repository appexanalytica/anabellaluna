/**
 * Presencia de agentes.
 *
 * Este router alojaba el chat interno entre agentes. Esa funcionalidad se
 * retiró cuando Mensajería se fusionó en Consultas: lo que llega del sitio se
 * atiende desde ahí, y no quedó ningún consumidor de los endpoints de chat.
 *
 * Lo único que sigue en uso es el estado en línea del agente, que el CRM marca
 * al iniciar y cerrar sesión. El modelo Message se conserva para no perder el
 * historial ya almacenado.
 */
const express = require('express');
const router = express.Router();
const Agente = require('../models/Agente');
const { requireCRMUser } = require('../auth');
const { authenticateTokenOrService } = require('../middlewares/serviceAuth');

/**
 * Resuelve el agente detrás del token.
 * Token: { sub: userId, username, role, agenteId }
 */
async function getUserFromToken(req) {
  // Llamadas servicio-a-servicio: se confía en el senderId del body.
  if (req.serviceAuth && req.body && req.body.senderId) {
    return {
      id: String(req.body.senderId),
      type: req.body.senderType || 'agent',
      role: 'service',
    };
  }

  const user = req.user || {};

  if (user.agenteId) {
    return {
      id: String(user.agenteId),
      type: 'agent',
      role: user.role || 'agent',
    };
  }

  if (user.role === 'admin') {
    return {
      id: user.sub ? String(user.sub) : null,
      type: 'erp',
      role: 'admin',
    };
  }

  // Agentes cuyo token no trae agenteId: se busca por email.
  if (user.role === 'agent' && user.username) {
    try {
      const agente = await Agente.findOne({ email: user.username }).select('_id').lean();
      if (agente) {
        return {
          id: String(agente._id),
          type: 'agent',
          role: 'agent',
        };
      }
    } catch (err) {
      console.error('Error looking up agente:', err);
    }
  }

  return {
    id: user.sub ? String(user.sub) : null,
    type: user.role === 'admin' ? 'erp' : 'agent',
    role: user.role || 'agent',
  };
}

// ==================== ONLINE STATUS ====================

// Update online status for current user
router.put('/status/online', authenticateTokenOrService, requireCRMUser, async (req, res) => {
  try {
    const currentUser = await getUserFromToken(req);
    const { online } = req.body;

    if (!currentUser.id || currentUser.type !== 'agent') {
      return res.status(400).json({ error: 'Agent ID required' });
    }

    await Agente.findByIdAndUpdate(currentUser.id, {
      $set: {
        'metadata.online': online,
        'metadata.lastSeen': new Date(),
      },
    });

    res.json({ success: true, online });
  } catch (error) {
    console.error('Error updating online status:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

module.exports = router;
