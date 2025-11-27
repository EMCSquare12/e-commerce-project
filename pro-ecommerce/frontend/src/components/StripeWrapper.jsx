import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";

// Public Key (Safe to expose)
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const StripeWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Outlet />
    </Elements>
  );
};

export default StripeWrapper;
