const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { io } = require('../app'); // Import io instance

// Get all notifications
async function getAllNotifications(req, res) {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id }
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Get notifications by category
async function getNotificationsByCategory(req, res) {
    const { category } = req.query;
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: req.user.id,
                category: category
            }
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Mark notification as read
async function markNotificationAsRead(req, res) {
    const { id } = req.params;
    try {
        const updatedNotification = await prisma.notification.update({
            where: { id: id },
            data: { isRead: true }
        });
        // Emit websocket event for notification update
        io.to(updatedNotification.userId.toString()).emit('notificationUpdated', updatedNotification);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Delete notification
async function deleteNotification(req, res) {
    const { id } = req.params;
    try {
        const deletedNotification = await prisma.notification.delete({
            where: { id: id }
        });
        // Emit websocket event for notification deletion
        io.to(deletedNotification.userId.toString()).emit('notificationDeleted', deletedNotification);
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getAllNotifications,
    getNotificationsByCategory,
    markNotificationAsRead,
    deleteNotification
};
