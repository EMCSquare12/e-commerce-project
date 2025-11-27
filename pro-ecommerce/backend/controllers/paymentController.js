import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';

// Use environment variable instead of hardcoding
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe Payment Intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { totalPrice } = req.body;

    // Stripe expects the amount in cents (e.g., $10.00 = 1000 cents)
    const calculateOrderAmount = (amount) => {
        return Math.round(amount * 100);
    };

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