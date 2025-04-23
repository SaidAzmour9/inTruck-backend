const express = require('express');
const router = express.Router();
const { getTrackingOrders } = require('../controllers/trackingController');
const auth = require('../middlewares/auth');

// Get tracking orders with optional search and status filters
router.get('/trackings', auth, getTrackingOrders);

module.exports = router;
