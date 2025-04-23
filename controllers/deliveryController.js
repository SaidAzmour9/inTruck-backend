const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserDeliveries = async (req, res) => {
  try {
    const userId = req.user.id;

    const deliveries = await prisma.order.findMany({
      where: { customerId: userId },
      select: {
        id: true,
        code: true,
        destination: true,
        coverageAmount: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des livraisons." });
  }
};

const getDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const delivery = await prisma.order.findFirst({
      where: {
        id,
        customerId: userId
      }
    });

    if (!delivery) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des détails." });
  }
};

const getRecentShipping = async (req, res) => {
  try {
    const recentShipping = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
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
      }
    });

    if (!recentShipping) {
      return res.status(404).json({ error: "Aucune livraison trouvée" });
    }

    res.json({
      id: recentShipping.code,
      destination: recentShipping.delivery_loc,
      distance: 0, // Will be calculated
      driver: {
        name: recentShipping.truck.driver.name,
        company: recentShipping.truck.driver.company
      },
      date_exit: recentShipping.pickup_date,
      date_arrival: recentShipping.delivery_date,
      status: recentShipping.status,
      coverage: recentShipping.coverageAmount
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de la livraison récente." });
  }
};

const createDelivery = async (req, res) => {
  try {
    const { departure, destination, weight, status, coverage, date_exit, date_arrival, driver } = req.body;
    const userId = req.user.id;

    const newDelivery = await prisma.order.create({
      data: {
        pickup_loc: departure,
        delivery_loc: destination,
        weight,
        status,
        coverageAmount: coverage,
        pickup_date: new Date(date_exit),
        delivery_date: new Date(date_arrival),
        customerId: userId,
        truck: {
          connect: {
            driverId: driver.id
          }
        }
      }
    });

    res.status(201).json(newDelivery);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de la livraison." });
  }
};

module.exports = { 
  getUserDeliveries, 
  getDeliveryDetails,
  getRecentShipping,
  createDelivery
};
