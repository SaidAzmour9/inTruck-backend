const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStatistics = async (req, res) => {
  try {
    const statistics = {
      onTheRoad: await prisma.tracking.count({ where: { status: 'IN_TRANSIT' } }),
      delivered: await prisma.order.count({ where: { status: 'DELIVERED' } }),
      accidents: await prisma.tracking.count({ where: { status: 'DELAYED' } }),
      loading: await prisma.tracking.count({ where: { status: 'LOADING' } }),
      canceled: await prisma.order.count({ where: { status: 'CANCELLED' } }),
    };
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques." });
  }
};

module.exports = { getStatistics };
