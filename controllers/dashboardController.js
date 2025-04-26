const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function getUserDashboard(req, res) {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        individual: true,
        company: true
      }
      
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("ee")

    const lastOrders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: {
        tracking: true,
        truck: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    const lastDelivered = lastOrders.find(
      order => order.tracking?.status === 'DELIVERED'
    );

    const recentShipped = lastOrders.find(
      order => order.tracking?.status === 'IN_TRANSIT'
    );

    const totalOrders = await prisma.order.count({
      where: { customerId: userId }
    });

    const ordersByStatus = await prisma.tracking.groupBy({
      by: ['status'],
      where: {
        order: {
          customerId: req.user.id
        }
      },
      _count: {
        status: true
      }
    });

    const statusCounts = {};
    const statusPercentages = {};

    for (const status of ordersByStatus) {
      statusCounts[status.status] = status._count.status;
      statusPercentages[status.status] = ((status._count.status / totalOrders) * 100).toFixed(2) + '%';
    }

    res.status(200).json({
      user,
      lastDelivered,
      recentShipped,
      lastOrders,
      totalOrders,
      statusCounts,
      statusPercentages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//getTrackingInfo get all oders by userId 
async function getTrackingInfo(req, res) {
  try {
    const userId = req.user.userId;
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        tracking: true,
        truck: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    if (!orders) {
      return res.status(404).json({ message: 'No orders found' });
    }
    const trackingOrders = orders.filter(
      order => order.tracking?.status === 'IN_TRANSIT' || order.tracking?.status === 'PENDING'
    );
    if (trackingOrders.length === 0) {
      return res.status(404).json({ message: 'No tracking orders found' });
    }
    res.status(200).json({ trackingOrders });
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
  }
    
}

//getDeliveredOrders get all oders by userId
async function getDeliveredOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        tracking: true,
        truck: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    if (!orders) {
      return res.status(404).json({ message: 'No orders found' });
    }
    const deliveredOrders = orders.filter(
      order => order.tracking?.status === 'DELIVERED'
    );
    if (deliveredOrders.length === 0) {
      return res.status(404).json({ message: 'No delivered orders found' });
    }
    res.status(200).json({ deliveredOrders });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// getCanceledOrders get all oders by userId
async function getCanceledOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        tracking: true,
        truck: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    if (!orders) {
      return res.status(404).json({ message: 'No orders found' });
    }
    const canceledOrders = orders.filter(
      order => order.tracking?.status === 'CANCELED'
    );
    if (canceledOrders.length === 0) {
      return res.status(404).json({ message: 'No canceled orders found' });
    }
    res.status(200).json({ canceledOrders });
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



module.exports = {
  getUserDashboard,
  getTrackingInfo,
  getDeliveredOrders,
  getCanceledOrders
};
