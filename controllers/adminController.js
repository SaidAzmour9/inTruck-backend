const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 📊 Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [users, trucks, orders, payments] = await Promise.all([
      prisma.user.count(),
      prisma.truck.count(),
      prisma.order.count(),
      prisma.payment.findMany(),
    ]);

    const totalRevenue = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);

    res.json({ users, trucks, orders, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Error loading dashboard', error });
  }
};

// 👤 Users
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
  res.json(truck);
};

exports.addTruck = async (req, res) => {
  const { carrier, driverId, location, status, capacity } = req.body;
  const truck = await prisma.truck.create({
    data: { carrier, driverId, location, status, capacity, createdAt: new Date(), updatedAt: new Date() },
  });
  res.json(truck);
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
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id }, data: { status, updatedAt: new Date() } });
  res.json(order);
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  await prisma.order.delete({ where: { id } });
  res.json({ message: 'Order deleted' });
};

//  Tracking
exports.getAllTracking = async (req, res) => {
  const tracking = await prisma.tracking.findMany({ include: { order: true } });
  res.json(tracking);
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



