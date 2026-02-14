import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ArrowLeft } from "lucide-react";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useSyncCartMutation } from "../slices/cartApiSlice";
import { useEffect } from "react";
const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);
  const [syncCart] = useSyncCartMutation();

  useEffect(() => {
    if (userInfo) {
      syncCart(cartItems);
    }
  }, [cartItems, syncCart, userInfo]);

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container px-4 py-4 pb-24 mx-auto md:pb-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="md:hidden text-slate-600"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold md:text-3xl text-slate-800">
          Shopping Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cart Items Column */}
        <div className="lg:col-span-8">
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty{" "}
              <Link to="/" className="font-bold underline text-slate-700">
                Go Back
              </Link>
            </Message>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 transition-shadow bg-white border shadow-sm border-slate-100 rounded-xl hover:shadow-md md:p-4"
                >
                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-100 rounded-lg md:w-32 md:h-32">
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-sm font-semibold leading-tight text-slate-800 line-clamp-2 md:text-lg hover:text-amber-600"
                        >
                          {item.name}
                        </Link>

                        {/* Delete Button (Top Right for easy access) */}
                        <button
                          type="button"
                          onClick={() => removeFromCartHandler(item._id)}
                          className="text-gray-400 transition hover:text-red-500 md:hidden"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-1 text-base font-bold md:mt-2 text-amber-600 md:text-xl">
                        ${item.price}
                      </div>
                    </div>

                    {/* Bottom: Qty and Desktop Delete */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">
                          Qty:
                        </span>
                        <div className="relative">
                          <select
                            className="block py-1 pl-3 pr-8 text-sm border-gray-200 rounded-lg bg-gray-50 focus:border-amber-500 focus:ring-amber-500"
                            value={item.qty}
                            onChange={(e) =>
                              addToCartHandler(item, Number(e.target.value))
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Desktop Delete Button (Hidden on Mobile) */}
                      <button
                        type="button"
                        onClick={() => removeFromCartHandler(item._id)}
                        className="items-center hidden gap-1 text-sm font-medium text-red-500 transition md:flex hover:text-red-700"
                      >
                        <Trash2 size={18} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Summary Column */}
        <div className="lg:col-span-4">
          <div className="sticky p-5 bg-white border shadow-sm rounded-xl border-slate-200 top-24">
            <h2 className="pb-3 mb-4 text-xl font-bold border-b border-gray-100 text-slate-800">
              Order Summary
            </h2>

            <div className="flex items-center justify-between mb-2 text-slate-600">
              <span>
                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </span>
              <span>Calculated at next step</span>
            </div>

            <div className="flex items-center justify-between mb-6 text-2xl font-bold text-slate-900">
              <span>Total</span>
              <span>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className={`w-full py-3.5 rounded-lg font-bold text-sm md:text-base text-white uppercase tracking-wider transition shadow-md ${
                cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-amber-500 hover:shadow-lg hover:-translate-y-0.5"
              }`}
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
