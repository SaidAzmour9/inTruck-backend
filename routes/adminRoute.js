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
//assignDriverToTruck
router.put('/trucks/:id/assign-driver', admin.assignDriverToTruck);
//get available trucks
//router.get('/trucks/available', admin.getTrucks);

// Drivers
router.get('/drivers', admin.getDrivers);
router.get('/drivers/:id', admin.getDriverById);
router.post('/drivers/add', admin.addDriver);
router.put('/drivers/:id/edit', admin.updateDriver);
router.delete('/drivers/:id/delete', admin.deleteDriver);
//get available drivers
//router.get('/drivers/available', admin.getDrivers);


// Orders
router.get('/orders', admin.getOrders);
//get pending orders
router.get('/orders/pending', admin.getPendingOrders);
//get all deliveries orders
router.get('/orders/delivered', admin.getAllDeliveriesOrders);
//get all cancelled orders
router.get('/orders/cancelled', admin.getAllCancelledOrders);

router.get('/orders/:id', admin.getOrderById);
router.put('/orders/:id/update-status', admin.updateOrderStatus);
router.delete('/orders/:id/delete', admin.deleteOrder);

// Tracking
router.get('/tracking', admin.getAllTracking);
router.get('/tracking/:orderId', admin.getTrackingByOrder);
//get all IN_TRANSIT orders
router.get('/in-transit', admin.getInTransitOrders);

// Payments
router.get('/payments', admin.getPayments);
router.get('/payments/:id', admin.getPaymentById);
router.put('/payments/:id/update-status', admin.updatePaymentStatus);



module.exports = router;
