const express = require('express');
const router = express.Router();
const { 
  getUserDeliveries, 
  getDeliveryDetails,
  getRecentShipping,
  createDelivery 
} = require('../controllers/deliveryController');
const auth = require('../middlewares/auth');

// Get all deliveries for authenticated user
router.get('/deliveries', auth, getUserDeliveries);

// Get details of specific delivery
router.get('/deliveries/:id', auth, getDeliveryDetails);

// Get recent shipping
router.get('/deliveries/recent', auth, getRecentShipping);

// Create new delivery
router.post('/deliveries', auth, createDelivery);

module.exports = router;
