const express = require('express');
const BookingRequest = require('../models/BookingRequest');
const { authenticateToken, requireCRMUser } = require('../auth');
const { authenticateTokenOrService } = require('../middlewares/serviceAuth');
const { publishEventAsync, metaFromRequest } = require('../utils/redisStreams');

const router = express.Router();

// GET / — list all bookings (admin/CRM view)
router.get('/', authenticateToken, requireCRMUser, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const items = await BookingRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(req.query.limit) || 50, 100))
      .lean();
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /:id/status — update booking status (approve/reject/cancel)
router.patch('/:id/status', authenticateTokenOrService, requireCRMUser, async (req, res) => {
  try {
    const { status, adminNotes } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status is required' });

    const set = { status };
    if (adminNotes) set.adminNotes = adminNotes;

    const updated = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { $set: set },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) return res.status(404).json({ error: 'Booking not found' });

    publishEventAsync('booking.status_changed', {
      booking_id: String(updated._id),
      status: updated.status,
      admin_notes: adminNotes || '',
    }, metaFromRequest(req));

    res.json(updated);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
