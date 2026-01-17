import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { MapPin, CreditCard, Package } from "lucide-react";

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
      const res = await createPaymentIntent({
        totalPrice: cart.totalPrice,
      }).unwrap();

      const clientSecret = res.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Test User",
            address: {
              city: cart.shippingAddress.city,
              country: "US",
              line1: cart.shippingAddress.address,
              postal_code: cart.shippingAddress.postalCode,
            },
          },
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
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
          navigate("/");
        }
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err.error || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <div className="pb-24 md:pb-8">
      {/* Checkout Steps (Shipping -> Place Order) */}
      <CheckoutSteps step1 step2 />

      <div className="grid grid-cols-1 gap-6 mt-6 lg:gap-8 lg:grid-cols-12 lg:mt-8">
        {/* Left Column: Order Details */}
        <div className="space-y-6 lg:col-span-8">
          {/* Shipping Info Card */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm md:p-6 rounded-xl">
            <h2 className="flex items-center gap-2 mb-3 text-lg font-bold md:text-xl text-slate-800">
              <MapPin className="w-5 h-5 text-amber-600" /> Shipping
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base ml-7">
              {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          {/* Payment Info Card */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm md:p-6 rounded-xl">
            <h2 className="flex items-center gap-2 mb-3 text-lg font-bold md:text-xl text-slate-800">
              <CreditCard className="w-5 h-5 text-amber-600" /> Payment Details
            </h2>
            <div className="p-4 border border-gray-200 rounded-lg md:ml-7 bg-gray-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1e293b",
                      "::placeholder": { color: "#94a3b8" },
                    },
                    invalid: { color: "#ef4444" },
                  },
                }}
              />
            </div>
          </div>

          {/* Order Items Card */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm md:p-6 rounded-xl">
            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold md:text-xl text-slate-800">
              <Package className="w-5 h-5 text-amber-600" /> Order Items
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
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 border border-gray-100 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-grow ml-3 md:ml-4">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-sm font-semibold md:text-base text-slate-800 hover:text-amber-600 line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-gray-500 md:text-sm">
                        {item.qty} x ${item.price}
                      </p>
                    </div>
                    <div className="text-sm font-bold md:text-base text-slate-900">
                      ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky p-5 bg-white border border-gray-200 shadow-sm top-24 md:p-6 rounded-xl">
            <h2 className="pb-3 mb-4 text-lg font-bold border-b border-gray-100 md:pb-4 md:text-xl text-slate-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600 md:text-base">
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
              <div className="flex justify-between pt-3 mt-3 text-lg font-bold border-t border-gray-100 text-slate-900">
                <span>Total</span>
                <span>${cart.totalPrice}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4">
                <Message variant="danger">{errorMsg}</Message>
              </div>
            )}
            {loadingOrder && (
              <div className="mt-4">
                <Loader />
              </div>
            )}

            <button
              type="button"
              className="w-full py-3.5 mt-6 font-bold text-white uppercase tracking-wider transition-all rounded-lg shadow-md bg-slate-900 hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm md:text-base"
              disabled={cart.cartItems.length === 0 || processing || !stripe}
              onClick={handlePaymentAndOrder}
            >
              {processing ? "Processing..." : `Pay $${cart.totalPrice}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
