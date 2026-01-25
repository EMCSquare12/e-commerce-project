import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Outlet />
    </Elements>
  );
};

export default StripeWrapper;
