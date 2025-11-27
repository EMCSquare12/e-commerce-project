import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
} from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [errorMsg, setErrorMsg] = useState(null);
  const [processing, setProcessing] = useState(false);

  // API Hooks
  const [createOrder, { isLoading: loadingOrder }] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  const handlePaymentAndOrder = async () => {
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setErrorMsg(null);

    try {
      // 1. Create Payment Intent on Server (Get Client Secret)
      const res = await createPaymentIntent({
        totalPrice: cart.totalPrice,
      }).unwrap();

      const clientSecret = res.clientSecret;

      // 2. Confirm Card Payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Test User", // You can pull this from auth state if needed
            address: {
              city: cart.shippingAddress.city,
              country: "US", // Simplified for testing
              line1: cart.shippingAddress.address,
              postal_code: cart.shippingAddress.postalCode,
            },
          },
        },
      });

      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        setErrorMsg(result.error.message);
        setProcessing(false);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          // 3. Save Order to Database
          await createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: "Stripe",
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            paymentResult: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              update_time: String(result.paymentIntent.created),
              email_address: "stripe_test@example.com",
            },
            isPaid: true,
            paidAt: Date.now(),
          }).unwrap();

          dispatch(clearCartItems());
          toast.success("Order Placed Successfully!");
          navigate("/"); // Redirect to Home (or Order Details page in future)
        }
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err.error || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Column: Order Details */}
        <div className="md:col-span-8">
          <div className="p-6 mb-4 bg-white border rounded-lg shadow-sm border-slate-200">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">Shipping</h2>
            <p className="text-gray-700">
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="p-6 mb-4 bg-white border rounded-lg shadow-sm border-slate-200">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">
              Payment Details
            </h2>
            <div className="p-4 border border-gray-300 rounded bg-gray-50">
              {/* Stripe Element renders here */}
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm border-slate-200">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">
              Order Items
            </h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-16 h-16">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                    <div className="flex-grow ml-4">
                      <Link
                        to={`/product/${item._id}`}
                        className="font-medium text-slate-800 hover:text-amber-600"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-600">
                      {item.qty} x ${item.price} ={" "}
                      <span className="font-bold text-slate-900">
                        ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-4">
          <div className="sticky p-6 bg-white border rounded-lg shadow-lg border-slate-200 top-24">
            <h2 className="pb-4 mb-6 text-2xl font-bold border-b text-slate-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${cart.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${cart.taxPrice}</span>
              </div>
              <div className="flex justify-between pt-3 mt-3 text-lg font-bold border-t text-slate-900">
                <span>Total</span>
                <span>${cart.totalPrice}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4">
                <Message variant="danger">{errorMsg}</Message>
              </div>
            )}
            {loadingOrder && <Loader />}

            <button
              type="button"
              className="w-full px-4 py-3 mt-6 font-bold text-white transition rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.cartItems.length === 0 || processing || !stripe}
              onClick={handlePaymentAndOrder}
            >
              {processing ? "Processing..." : `Pay $${cart.totalPrice}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
