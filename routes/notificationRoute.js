const express = require('express');
const router = express.Router();
const {
    getAllNotifications,
    getNotificationsByCategory,
    markNotificationAsRead,
    deleteNotification
} = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

// Get all notifications
router.get('/', auth, getAllNotifications);

// Get notifications by category
router.get('/', auth, getNotificationsByCategory);

// Mark notification as read
router.put('/:id/read', auth, markNotificationAsRead);

// Delete notification
router.delete('/:id', auth, deleteNotification);

module.exports = router;
