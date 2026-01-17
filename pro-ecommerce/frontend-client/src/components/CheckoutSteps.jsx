import React from "react";
import { Link } from "react-router-dom";
import { Truck, ClipboardCheck, ChevronRight } from "lucide-react";

const CheckoutSteps = ({ step1, step2 }) => {
  // Helper to render individual steps
  const renderStep = (isEnabled, path, label, Icon) => {
    const content = (
      <div className={`flex flex-col items-center gap-1 md:gap-2 group`}>
        <div
          className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors ${
            isEnabled
              ? "border-amber-500 bg-amber-50 text-amber-600"
              : "border-gray-200 bg-gray-50 text-gray-400"
          }`}
        >
          <Icon size={16} className="md:w-5 md:h-5" />
        </div>

        <span
          className={`text-xs md:text-sm font-bold uppercase tracking-wide transition-colors ${
            isEnabled ? "text-slate-900" : "text-gray-400"
          }`}
        >
          {label}
        </span>
      </div>
    );

    return isEnabled ? (
      <Link to={path} className="focus:outline-none">
        {content}
      </Link>
    ) : (
      <div className="cursor-not-allowed opacity-60">{content}</div>
    );
  };

  return (
    <nav className="flex justify-center w-full mt-4 mb-8">
      <div className="relative flex items-center w-full max-w-md px-4">
        <div className="relative z-10 px-2 bg-gray-50 md:bg-transparent">
          {renderStep(step1, "/shipping", "Shipping", Truck)}
        </div>

        <div className="flex-grow h-0.5 mx-2 bg-gray-200 relative -top-3 md:-top-4 -z-0">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-500 bg-amber-500 ${
              step2 ? "w-full" : "w-0"
            }`}
          />
        </div>

        <div className="relative z-10 px-2 bg-gray-50 md:bg-transparent">
          {renderStep(step2, "/placeorder", "Place Order", ClipboardCheck)}
        </div>
      </div>
    </nav>
  );
};

export default CheckoutSteps;
