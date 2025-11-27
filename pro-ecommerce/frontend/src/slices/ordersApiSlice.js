import { ORDERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: { ...order },
            }),
        }),
        // New endpoint to talk to our Stripe Controller
        createPaymentIntent: builder.mutation({
            query: (data) => ({
                url: "/api/payments/create-payment-intent",
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useCreateOrderMutation, useCreatePaymentIntentMutation } = ordersApiSlice;