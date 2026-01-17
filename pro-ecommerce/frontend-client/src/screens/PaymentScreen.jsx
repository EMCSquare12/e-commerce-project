import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet } from "lucide-react";
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
    <div className="pb-24 md:pb-8">
      <CheckoutSteps step1 step2 />

      <FormContainer>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold md:text-3xl text-slate-800">
            Payment Method
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Select how you want to pay
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <label
            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all shadow-sm ${
              paymentMethod === "PayPal"
                ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                : "border-gray-200 bg-white hover:border-amber-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <div className="flex items-center ml-4">
              <div className="p-2 mr-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-bold text-gray-800">
                PayPal or Credit Card
              </span>
            </div>
          </label>

          <label
            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all shadow-sm ${
              paymentMethod === "Stripe"
                ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                : "border-gray-200 bg-white hover:border-amber-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethod === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <div className="flex items-center ml-4">
              <div className="p-2 mr-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-bold text-gray-800">Stripe</span>
            </div>
          </label>

          <button
            type="submit"
            className="w-full py-3.5 mt-6 font-bold text-white uppercase tracking-wider transition rounded-lg shadow-lg bg-slate-900 hover:bg-slate-800 hover:shadow-xl active:scale-95 text-sm md:text-base"
          >
            Continue
          </button>
        </form>
      </FormContainer>
    </div>
  );
};

export default PaymentScreen;
