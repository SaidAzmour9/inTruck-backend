const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getUserDashboard,getTrackingInfo,getDeliveredOrders,getCanceledOrders } = require('../controllers/dashboardController');


router.get('/', auth, getUserDashboard);
router.get('/tracking', auth, getTrackingInfo);
router.get('/deleveries', auth, getDeliveredOrders);
router.get('/canceled', auth, getCanceledOrders);


module.exports = router;
