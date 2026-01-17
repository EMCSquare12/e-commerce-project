import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Handler to update quantity (Just re-adds the item with new qty)
  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // Handler to remove item
  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      {/* Cart Items Column */}
      <div className="md:col-span-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Shopping Cart
        </h1>
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
                className="flex items-center p-4 bg-white border rounded-lg shadow-sm border-slate-200"
              >
                {/* Image */}
                <div className="flex-shrink-0 w-24 h-24">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>

                {/* Name */}
                <div className="flex-grow ml-4">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-lg font-semibold transition text-slate-800 hover:text-amber-600"
                  >
                    {item.name}
                  </Link>
                </div>

                {/* Price */}
                <div className="w-24 ml-4 font-medium text-slate-600">
                  ${item.price}
                </div>

                {/* Quantity Selector */}
                <div className="ml-4">
                  <select
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm form-select focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
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

                {/* Delete Button */}
                <div className="ml-4">
                  <button
                    type="button"
                    onClick={() => removeFromCartHandler(item._id)}
                    className="p-2 text-red-500 transition rounded-full hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Summary Column */}
      <div className="md:col-span-4">
        <div className="sticky p-6 bg-white border rounded-lg shadow-sm border-slate-200 top-24">
          <h2 className="pb-4 mb-4 text-2xl font-bold border-b border-gray-200 text-slate-800">
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            items
          </h2>

          <div className="mb-6 text-2xl font-bold text-slate-900">
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </div>

          <button
            type="button"
            className={`w-full py-3 rounded font-bold text-white uppercase tracking-wider transition shadow-md ${
              cartItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 hover:shadow-lg"
            }`}
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
