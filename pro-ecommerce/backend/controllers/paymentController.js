import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
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

    const { orderItems } = req.body;
    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }


    const productIds = orderItems.map(item => item._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    let dbTotalPrice = 0;
    orderItems.forEach(item => {
        const matchingProduct = dbProducts.find(p => p._id.toString() === item._id);
        if (matchingProduct) {
            dbTotalPrice += matchingProduct.price * item.qty;
        }
    });

    const amountInCents = Math.round(dbTotalPrice * 100);


    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

export { createPaymentIntent };