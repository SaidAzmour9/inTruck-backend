// paymentController.js
console.log("Stripe API Key:", process.env.STRIPE_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPaymentIntent(amount) {
    try {
        const roundedAmount = Math.round(amount * 100);
        if (!roundedAmount || roundedAmount < 50) {
            throw new Error('Invalid amount. Amount must be at least $0.50 USD.');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: roundedAmount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        throw error;
    }
}

// This is still used as a route if needed
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
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!');
            break;
        case 'payment_intent.payment_failed':
            const error = event.data.object;
            console.log('PaymentIntent failed: ', error);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
}

module.exports = {
    createPaymentIntentHandler,
    createPaymentIntent, // exported as a helper
    handleWebhook
};