const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const isAdmin = require('../middlewares/admin');
const auth = require('../middlewares/auth');

router.use(auth, isAdmin);

router.get('/dashboard', admin.getDashboard);
// Users
router.get('/users', admin.getUsers);
router.get('/users/:id', admin.getUserById);
router.put('/users/:id/edit', admin.updateUser);
router.delete('/users/:id/delete', admin.deleteUser);

// Trucks
router.get('/trucks', admin.getTrucks);
router.get('/trucks/:id', admin.getTruckById);
router.post('/trucks/add', admin.addTruck);
router.put('/trucks/:id/edit', admin.updateTruck);
router.delete('/trucks/:id/delete', admin.deleteTruck);

// Orders
router.get('/orders', admin.getOrders);
router.get('/orders/:id', admin.getOrderById);
router.put('/orders/:id/update-status', admin.updateOrderStatus);
router.delete('/orders/:id/delete', admin.deleteOrder);

// Tracking
router.get('/tracking', admin.getAllTracking);
router.get('/tracking/:orderId', admin.getTrackingByOrder);

// Payments
router.get('/payments', admin.getPayments);
router.get('/payments/:id', admin.getPaymentById);
router.put('/payments/:id/update-status', admin.updatePaymentStatus);



module.exports = router;
