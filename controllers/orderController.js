const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createPaymentIntent } = require('./paymentController');

async function createOrder(req, res) {
  try {
    const {
      shipment_range,
      pickup_loc,
      pickup_city,
      delivery_loc,
      delivery_city,
      width,
      height,
      weight,
      quantity,
      shipment_info,
      shipment_note,
      pickup_date,
      payment_method,
      price
    } = req.body;

    const customerId = req.user.userId;

    const newOrder = await prisma.order.create({
      data: {
        customer: { connect: { id: customerId } },
        shipment_range,
        pickup_loc,
        delivery_loc,
        width,
        height,
        weight,
        quantity,
        shipment_info,
        shipment_note,
        price:Number(price),
        pickup_date: new Date(pickup_date),
        // Tracking without truck
        tracking: {
          create: {
            status: 'PENDING'
            // No truck assigned yet
          }
        },       
        // Payment
        payment: {
          create: {
            paymentMethod: payment_method,
            amount: price,
            date: new Date(),
            status: payment_method === 'cash_on_delivery' ? 'unpaid' : 'pending'
          }
        }
      },
      include: {
        customer: true,
        tracking: true,
        payment: true,
      }
    });

    // Stripe payment flow
    if (payment_method !== 'cash_on_delivery') {
      const stripePayment = await createPaymentIntent(price);
      return res.status(201).json({
        message: 'Order created. Awaiting payment',
        order: newOrder,
        payment: {
          clientSecret: stripePayment.clientSecret
        }
      });
    }

    // Cash on delivery
    return res.status(201).json({
      message: 'Order created successfully (Cash on Delivery)',
      order: newOrder
    });

  } catch (error) {
    console.error('Error in createOrder:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      details: error.message
    });
  }
}

//get order by id
async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tracking: true,
        truck: true,
        payment: true
      }
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

//get all orders by userId
async function getAllOrdersByUserId(req, res) {
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
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getAllOrdersByUserId
};
