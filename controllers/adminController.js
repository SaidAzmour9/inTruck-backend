const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require('moment');

//  Dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Fetch orders for today
    const orders = await prisma.order.findMany({
      where: {
        delivery_date: {
          gte: moment().startOf('day').toDate(),
          lte: moment().endOf('day').toDate(),
        },
      },
      include: {
        tracking: true,
      },
    });
    

    // Filter today's delivered orders
    const deliveriesToday = orders.filter(
      order => order.tracking?.status === 'DELIVERED'
    ).length;
    
    const revenueToday = orders.reduce((sum, order) => {
      return order.tracking?.status === 'DELIVERED'
        ? sum + parseFloat(order.price)
        : sum;
    }, 0);
    

const assignedDriverIds = (await prisma.truck.findMany({
  select: { driverId: true },
  where: { driverId: { not: null } },
})).map(truck => truck.driverId);

const availableDrivers = await prisma.driver.count({
  where: {
    id: { notIn: assignedDriverIds },
  },
});
    // Get available trucks
    const activeTrucks = await prisma.truck.count({
      where: {
        status: 'AVAILABLE',
      }
    });

    // Get total revenue (assuming 'payments' is an array of payments)
    const payments = await prisma.payment.findMany();
    const totalRevenue = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);

    // Fetch the total number of users and trucks
    const users = await prisma.user.count();
    const trucks = await prisma.truck.count();

    // Send the dashboard data
    res.json({
      users,
      trucks,
      totalRevenue,
      deliveriesToday,
      revenueToday,
      availableDrivers,
      activeTrucks,
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).json({ message: 'Error loading dashboard', error });
  }
};
//  Users
exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, role } = req.body;
  const updated = await prisma.user.update({
    where: { id },
    data: { fullName, phone, role },
  });
  res.json(updated);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.json({ message: 'User deleted' });
};

//   Trucks
exports.getTrucks = async (req, res) => {
  const trucks = await prisma.truck.findMany({ include: { driver: true } });
  res.json(trucks);
};

exports.getTruckById = async (req, res) => {
  const { id } = req.params;
  const truck = await prisma.truck.findUnique({ where: { id }, include: { driver: true } });
  if (!truck) return res.status(404).json({ message: 'Truck not found' });
  res.json(truck);
};

exports.addTruck = async (req, res) => {
  try {
    const { truckNumber, truckYear, model, truckType, technicalDate, capacity,location } = req.body;

    const truck = await prisma.truck.create({
      data: {
        truckNumber,
        truckYear,
        model,
        truckType,
        location,

        technicalDate: new Date(technicalDate),
        capacity
      }
    });

    res.status(201).json(truck);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid input', error });
  }
};

exports.updateTruck = async (req, res) => {
  const { id } = req.params;
  const { carrier, location, status, capacity } = req.body;
  const truck = await prisma.truck.update({
    where: { id },
    data: { carrier, location, status, capacity, updatedAt: new Date() },
  });
  res.json(truck);
};

exports.deleteTruck = async (req, res) => {
  const { id } = req.params;
  await prisma.truck.delete({ where: { id } });
  res.json({ message: 'Truck deleted' });
};

//  Orders
exports.getOrders = async (req, res) => {
  const orders = await prisma.order.findMany({ include: { truck: true, customer: true } });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({ where: { id }, include: { truck: true, customer: true } });
  res.json(order);
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, truckNumber, reason } = req.body;

  try {
    // Check if order exists
    const orderExists = await prisma.order.findUnique({ where: { id } });
    if (!orderExists) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Mise à jour ou création du tracking
    const existingTracking = await prisma.tracking.findUnique({
      where: { orderId: id },
    });

    const tracking = existingTracking
      ? await prisma.tracking.update({
          where: { orderId: id },
          data: { status },
        })
      : await prisma.tracking.create({
          data: { orderId: id, status },
        });

    // Gérer les cas spécifiques
    if (status === 'DELIVERED') {
      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          delivery_date: new Date(),
          status,
        },
      });

      // Find the truck associated with the order
      const orderWithTruck = await prisma.order.findUnique({
        where: { id },
        select: { truckId: true },
      });

      if (orderWithTruck && orderWithTruck.truckId) {
        // Update truck status to AVAILABLE and unassign driver
        await prisma.truck.update({
          where: { id: orderWithTruck.truckId },
          data: {
            status: 'AVAILABLE',
            driverId: null,
          },
        });
      }

      return res.json({ tracking, updatedOrder });
    }

    if (status === 'IN_TRANSIT') {
      console.log('updateOrderStatus: truckNumber received:', truckNumber);
      const truck = await prisma.truck.findUnique({
        where: { truckNumber },
      });
      console.log('updateOrderStatus: truck found:', truck);

      if (!truck) {
        return res.status(404).json({ message: 'Truck not found' });
      }

      if (truck.status !== 'AVAILABLE') {
        return res.status(400).json({ message: 'Truck is not available' });
      }

      await prisma.truck.update({
        where: { truckNumber },
        data: { status: 'ON_DELIVERY' },
      });

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          truckId: truck.id,
          status,
        },
      });

      return res.json({ tracking, updatedOrder });
    }

    if (status === 'CANCELLED') {
      await prisma.tracking.delete({
        where: { orderId: id },
      });

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status,
          reason,
        },
      });

      return res.json({ tracking: null, updatedOrder });
    }

    // Default case: update only status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ tracking, updatedOrder });
  } catch (error) {
    console.error("Erreur updateOrderStatus:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut de suivi", error });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  await prisma.order.delete({ where: { id } });
  res.json({ message: 'Order deleted' });
};

//  Tracking



//getAvailableDrivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  }
  catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Error fetching drivers', error });
  }
};

exports.getTrucks = async (req, res) => {
  try {
    const trucks = await prisma.truck.findMany();
    res.json(trucks);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    res.status(500).json({ message: 'Error fetching trucks', error });
  }
};





exports.getAllTracking = async (req, res) => {
  const tracking = await prisma.tracking.findMany({ include: { order: true } });
  res.json(tracking);
};

//get all IN_TRANSIT orders
exports.getInTransitOrders = async (req, res) => {
  const inTransitOrders = await prisma.tracking.findMany({
    where: { status: 'IN_TRANSIT' },
    include: { order: true },
  });
  res.json(inTransitOrders);
};

//get all DELIVERED orders
exports.getAllDeliveriesOrders = async (req, res) => {
  const deliveredOrders = await prisma.tracking.findMany({
    where: { status: 'DELIVERED' },
    include: { order: true },
  });
  res.json(deliveredOrders);
};

//get all CANCELLED orders
exports.getAllCancelledOrders = async (req, res) => {
  const cancelledOrders = await prisma.tracking.findMany({
    where: { status: 'CANCELLED' },
    include: { order: true },
  });
  res.json(cancelledOrders);
};


exports.getTrackingByOrder = async (req, res) => {
  const { orderId } = req.params;
  const tracking = await prisma.tracking.findMany({ where: { orderId } });
  res.json(tracking);
};

// Payments
exports.getPayments = async (req, res) => {
  const payments = await prisma.payment.findMany({ include: { order: true } });
  res.json(payments);
};

exports.getPaymentById = async (req, res) => {
  const { id } = req.params;
  const payment = await prisma.payment.findUnique({ where: { id }, include: { order: true } });
  res.json(payment);
};

exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const payment = await prisma.payment.update({ where: { id }, data: { status } });
  res.json(payment);
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    console.log(drivers);

    if (!drivers || drivers.length === 0) {
      return res.status(404).json({ message: 'No drivers found' });
    }
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Error fetching drivers', error });
  }
};

exports.getDriverById = async (req, res) => {
  const { id } = req.params;
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) return res.status(404).json({ message: 'Driver not found' });
  res.json(driver);
};

exports.addDriver = async (req, res) => {
  try {
    const { fullName, license, nationalId, phone, email, licenseExpire } = req.body;
    const driver = await prisma.driver.create({
      data: {
        fullName,
        license,
        nationalId,
        phone,
        email,
        licenseExpire: new Date(licenseExpire),
      },
    });
    res.status(201).json(driver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ message: 'Error creating driver', error });
  }
};

exports.assignDriverToTruck = async (req, res) => {
  try {
    const { driverId, truckId } = req.body;

    // Check if driver exists
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check if driver is already assigned to another truck
    const existingTruckWithDriver = await prisma.truck.findUnique({
      where: { driverId: driverId },
    });
    if (existingTruckWithDriver) {
      return res.status(400).json({ message: 'Driver is already assigned to another truck' });
    }

    // Check if truck exists
    const truck = await prisma.truck.findUnique({ where: { id: truckId } });
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Assign driver to truck by updating truck's driverId
    const updatedTruck = await prisma.truck.update({
      where: { id: truckId },
      data: { driverId: driverId },
      include: { driver: true },
    });

    res.json({ message: 'Driver assigned to truck successfully', truck: updatedTruck });
  } catch (error) {
    console.error('Error assigning driver to truck:', error);
    res.status(500).json({ message: 'Error assigning driver to truck', error });
  }
};

exports.updateDriver = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, email
, password } = req.body;
  const driver = await prisma.user.update({
    where: { id },
    data: {
      fullName,
      phone,
      email,
      password,
    },
  });
  res.json(driver);
}

exports.deleteDriver = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.json({ message: 'Driver deleted' });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { userType: 'USER' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

//get pending orders
exports.getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await prisma.order.findMany({
      where: { status: 'PENDING' },
    });
    res.json(pendingOrders);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ message: 'Error fetching pending orders', error });
  }
};