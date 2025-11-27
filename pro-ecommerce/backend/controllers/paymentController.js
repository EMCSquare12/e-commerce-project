import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';

// @desc    Create a Stripe Payment Intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
    // Initialize Stripe INSIDE the function to ensure env vars are loaded
    if (!process.env.STRIPE_SECRET_KEY) {
        res.status(500);
        throw new Error('Stripe Secret Key is missing from .env');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { totalPrice } = req.body;

    if (!totalPrice) {
        res.status(400);
        throw new Error('Total price is required');
    }

    // Stripe expects the amount in cents (e.g., $10.00 = 1000 cents)
    const calculateOrderAmount = (amount) => {
        return Math.round(amount * 100);
    };

    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(totalPrice),
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

export { createPaymentIntent };