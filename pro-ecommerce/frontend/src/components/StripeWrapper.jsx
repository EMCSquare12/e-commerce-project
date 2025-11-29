import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";

// Public Key (Safe to expose)
const stripePromise = loadStripe(
  "pk_test_51SYgfjF8qMkexvO6kWhQyVYUK82v20Fb5odLC327oL3QnU2bcK5Uriy9ov5xCuPIp8vIV6yXId1rOOBFiCKGwM2N00g8EvrAff"
);

const StripeWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Outlet />
    </Elements>
  );
};

export default StripeWrapper;
