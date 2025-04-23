const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTrackingOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, status } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        customerId: userId,
        ...(search && { delivery_loc: { contains: search, mode: 'insensitive' } }),
        ...(status && { status: status.toUpperCase() })
      },
      select: {
        id: true,
        code: true,
        destination: true,
        status: true,
        coverageAmount: true,
        truck: {
          select: {
            driver: {
              select: {
                name: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders.map(order => ({
      id: order.id,
      code: order.code,
      destination: order.destination,
      status: order.status,
      coverageAmount: order.coverageAmount,
      driver: {
        name: order.truck.driver.name,
        company: order.truck.driver.company
      }
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTrackingOrders };
