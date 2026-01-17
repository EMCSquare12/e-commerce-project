import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { Mail, Lock, LogIn } from "lucide-react";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="pb-24 md:pb-8">
      <FormContainer>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold md:text-3xl text-slate-800">
            Sign In
          </h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back to ProShop</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Email Input */}
          <div>
            <label
              className="block mb-1 text-sm font-bold text-gray-700"
              htmlFor="email"
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
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm leading-tight text-gray-700 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block mb-1 text-sm font-bold text-gray-700"
              htmlFor="password"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm leading-tight text-gray-700 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold tracking-wider text-white uppercase transition rounded-lg shadow-md bg-slate-900 hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">Processing...</span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <LogIn className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>

          {isLoading && <Loader />}
        </form>

        <div className="pt-6 mt-6 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="font-bold text-amber-600 hover:text-amber-700 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </FormContainer>
    </div>
  );
};

export default LoginScreen;
