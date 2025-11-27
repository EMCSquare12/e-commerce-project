import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  // Helper to render steps
  const renderStep = (step, path, label) => {
    return step ? (
      <Link
        to={path}
        className="font-bold transition text-slate-900 hover:text-amber-500"
      >
        {label}
      </Link>
    ) : (
      <span className="text-gray-400 cursor-not-allowed">{label}</span>
    );
  };

  return (
    <nav className="flex justify-center mb-8">
      <ul className="flex items-center gap-8">
        <li>{renderStep(step1, "/login", "Sign In")}</li>
        <li>{renderStep(step2, "/shipping", "Shipping")}</li>
        <li>{renderStep(step3, "/payment", "Payment")}</li>
        <li>{renderStep(step4, "/placeorder", "Place Order")}</li>
      </ul>
    </nav>
  );
};

export default CheckoutSteps;
