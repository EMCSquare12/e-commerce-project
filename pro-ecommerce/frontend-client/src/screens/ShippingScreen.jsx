import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, Building2, Globe, Map, ArrowRight } from "lucide-react";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../slices/cartSlice";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/placeorder"); 
    navigate("/payment");
  };

  return (
    <div className="pb-24 md:pb-8">
      <CheckoutSteps step1 />

      <FormContainer>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold md:text-3xl text-slate-800">
            Shipping Address
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Where should we deliver your order?
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Address Input */}
          <div>
            <label
              className="block mb-1 text-sm font-bold text-gray-700"
              htmlFor="address"
            >
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                required
                placeholder="123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* City Input */}
          <div>
            <label
              className="block mb-1 text-sm font-bold text-gray-700"
              htmlFor="city"
            >
              City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Building2 className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="city"
                required
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Postal Code Input */}
          <div>
            <label
              className="block mb-1 text-sm font-bold text-gray-700"
              htmlFor="postalCode"
            >
              Postal Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Map className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="postalCode"
                required
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Country Input */}
          <div>
            <label
              className="block mb-1 text-sm font-bold text-gray-700"
              htmlFor="country"
            >
              Country
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="country"
                required
                placeholder="USA"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-3.5 mt-6 font-bold text-white uppercase tracking-wider transition-all rounded-lg shadow-md bg-slate-900 hover:bg-slate-800 hover:shadow-lg active:scale-95 text-sm md:text-base"
          >
            Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>
      </FormContainer>
    </div>
  );
};

export default ShippingScreen;
