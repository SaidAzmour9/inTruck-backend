const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
app.use(express.json());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function createPaymentIntent(req, res) {
    try {
        let { amount } = req.body;
        amount = Math.round(amount * 100);
        if (!amount || amount < 50) {
            return res.status(400).json({ message: 'Invalid amount. Amount must be at least $0.50 USD.' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
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
            // Handle successful payment here
            console.log('PaymentIntent was successful!');
            break;
        case 'payment_intent.payment_failed':
            const error = event.data.object;
            // Handle failed payment here
            console.log('PaymentIntent failed: ', error);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).json({ received: true });
}

module.exports = {
    createPaymentIntent,
    handleWebhook
}

