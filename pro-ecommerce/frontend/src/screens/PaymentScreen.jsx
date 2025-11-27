import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Payment Method
        </h1>

        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <legend className="block mb-4 text-sm font-bold text-gray-700">
              Select Method
            </legend>

            {/* PayPal / Credit Card Option */}
            <div className="flex items-center mb-4">
              <input
                id="PayPal"
                name="paymentMethod"
                type="radio"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 bg-gray-100 border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <label
                htmlFor="PayPal"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                PayPal or Credit Card
              </label>
            </div>

            {/* Stripe Option (Can use same value or handle separately) */}
            <div className="flex items-center mb-4">
              <input
                id="Stripe"
                name="paymentMethod"
                type="radio"
                value="Stripe"
                checked={paymentMethod === "Stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 bg-gray-100 border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <label
                htmlFor="Stripe"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Stripe
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white rounded bg-slate-900 hover:bg-slate-800"
          >
            Continue
          </button>
        </form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
