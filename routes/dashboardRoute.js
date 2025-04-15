const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getUserDashboard,getTrackingInfo,getDeliveredOrders,getCanceledOrders } = require('../controllers/dashboardController');
const { createOrder } = require('../controllers/orderController');
const {CalculDistance} = require('../controllers/distanceController');


router.get('/', auth, getUserDashboard);
router.get('/tracking', auth, getTrackingInfo);
router.get('/deleveries', auth, getDeliveredOrders);
router.get('/canceled', auth, getCanceledOrders);
router.post('/newOrder', auth, createOrder);
router.post('/distance', auth, CalculDistance);



module.exports = router;
