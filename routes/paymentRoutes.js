const express = require('express');
const router = express.Router();

const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const { validation, errorValidatorHandler } = require('../middlewares/validator');
const auth = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


router.post('/create-payment-intent', createPaymentIntent);
router.post('/webhook', handleWebhook);
module.exports = router;
