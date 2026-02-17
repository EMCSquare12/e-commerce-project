import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../slices/usersApiSlice";
import { useMergeCartMutation } from "../slices/cartApiSlice";
import { addToCart } from "../slices/cartSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { Mail, Lock, LogIn } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const [mergeCart] = useMergeCartMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleMergeCart = async () => {
    if (cartItems.length > 0) {
      try {
        const res = await mergeCart({ cartItems }).unwrap();
        res.forEach((item) => {
          dispatch(addToCart({ ...item, qty: item.qty }));
        });
      } catch (err) {
        console.error("Cart merge failed", err);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      await handleMergeCart();
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Google Login Handler
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin({
          token: tokenResponse.access_token,
        }).unwrap();
        dispatch(setCredentials({ ...res }));

        await handleMergeCart();
        navigate(redirect);
        toast.success("Login Successful");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

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

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2 mt-4">
          <div className="w-full border-t border-gray-200"></div>
          <span className="absolute px-3 text-xs font-medium text-gray-500 uppercase bg-white">
            Or continue with
          </span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => googleLoginHandler()}
          disabled={isGoogleLoading}
          className="flex items-center justify-center w-full gap-3 px-4 py-3.5 mt-4 text-sm font-bold text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md active:scale-95 disabled:opacity-70"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isGoogleLoading ? "Connecting..." : "Sign In with Google"}
        </button>

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
