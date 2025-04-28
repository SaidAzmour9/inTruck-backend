// paymentController.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPaymentIntent(amount) {
    try {
        const roundedAmount = Math.round(amount * 100); // Stripe requires cents
        if (!roundedAmount || roundedAmount < 500) { // 500 MAD cents = 5 MAD minimum
            throw new Error('Invalid amount. Amount must be at least 5 MAD.');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: roundedAmount,
            currency: 'mad', // Moroccan Dirham currency
            payment_method_types: ['card'],
        });

        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        throw error;
    }
}

async function createPaymentIntentHandler(req, res) {
    try {
        const { amount } = req.body;
        const result = await createPaymentIntent(amount);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

async function handleWebhook(req, res) {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            console.log('PaymentIntent succeeded!');
            break;
        case 'payment_intent.payment_failed':
            console.log('PaymentIntent failed');
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
}

module.exports = {
    createPaymentIntentHandler,
    createPaymentIntent,
    handleWebhook
};
