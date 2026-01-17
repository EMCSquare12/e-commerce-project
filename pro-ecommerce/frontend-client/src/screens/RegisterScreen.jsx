import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Phone, Mail, Lock, UserPlus } from "lucide-react";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          name,
          email,
          password,
          phoneNumber: Number(phoneNumber),
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4 py-8 pb-24 md:py-10 md:pb-10">
      {/* Card Container */}
      <div className="w-full max-w-lg p-6 space-y-6 bg-white border border-gray-100 shadow-xl rounded-2xl md:p-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl text-slate-800">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">Join ProShop today for free</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Name & Phone Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-bold text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone"
                className="block mb-1 text-sm font-bold text-gray-700"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="phone"
                  placeholder="09123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-bold text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-bold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-bold text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full px-4 py-3.5 font-bold text-white uppercase tracking-wider transition-all duration-300 rounded-lg shadow-md bg-slate-900 hover:bg-slate-800 hover:shadow-lg active:scale-95 text-sm md:text-base"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">Processing...</span>
            ) : (
              <span className="flex items-center gap-2">
                Sign Up <UserPlus className="w-5 h-5" />
              </span>
            )}
          </button>

          {isLoading && <Loader />}
        </form>

        {/* Footer / Login Link */}
        <div className="pt-6 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="font-bold text-amber-600 hover:text-amber-700 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
