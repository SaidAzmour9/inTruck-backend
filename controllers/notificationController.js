const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get notifications for a user
exports.getNotificationsByUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification', error });
  }
};

// Create a notification (optional, can be used internally)
exports.createNotification = async (userId, message) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
