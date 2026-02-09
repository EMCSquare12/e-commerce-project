import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Phone,
  Mail,
  Lock,
  UserPlus,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google"; // Changed import
import { useGoogleLoginMutation } from "../slices/usersApiSlice";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Validation State
  const [passValidations, setPassValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // Real-time password validation
  useEffect(() => {
    setPassValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    });
  }, [password]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Check if all validations pass
    const isPasswordValid = Object.values(passValidations).every(Boolean);

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

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
  };

  // Custom Google Hook
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin({
          token: tokenResponse.access_token,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Login Successful");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4 py-8 pb-24 md:py-10 md:pb-10">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white border border-gray-100 shadow-xl rounded-2xl md:p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl text-slate-800">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">Join ProShop today for free</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  placeholder="09123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password & Validation */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700">
              Password
            </label>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-2.5 pl-10 pr-4 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Validation Checklist */}
            {password && (
              <div className="grid grid-cols-2 gap-2 p-3 text-xs border border-gray-100 bg-gray-50 rounded-xl">
                <ValidationItem
                  isValid={passValidations.length}
                  text="8+ Characters"
                />
                <ValidationItem
                  isValid={passValidations.upper}
                  text="1 Uppercase"
                />
                <ValidationItem
                  isValid={passValidations.lower}
                  text="1 Lowercase"
                />
                <ValidationItem
                  isValid={passValidations.number}
                  text="1 Number"
                />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full py-2.5 pl-10 pr-4 text-sm border rounded-lg outline-none focus:ring-2 transition-all ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:ring-amber-500 focus:border-transparent"
                }`}
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="flex items-center mt-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3 mr-1" /> Passwords do not match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full px-4 py-3.5 font-bold text-white uppercase tracking-wider transition-all duration-300 rounded-lg shadow-md bg-slate-900 hover:bg-slate-800 hover:shadow-lg active:scale-95 text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">Processing...</span>
            ) : (
              <span className="flex items-center gap-2">
                Sign Up <UserPlus className="w-5 h-5" />
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-gray-200"></div>
            <span className="absolute px-3 text-xs font-medium text-gray-500 uppercase bg-white">
              Or continue with
            </span>
          </div>

          {/* Custom Google Button */}
          <button
            type="button"
            onClick={() => googleLoginHandler()}
            disabled={isGoogleLoading}
            className="flex items-center justify-center w-full gap-3 px-4 py-3.5 text-sm font-bold text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md active:scale-95 disabled:opacity-70"
          >
            {/* Google SVG Icon */}
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
            {isGoogleLoading ? "Connecting..." : "Register with Google"}
          </button>

          {isLoading && <Loader />}
        </form>

        {/* Footer */}
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

// Helper Component for Validation Checklist
const ValidationItem = ({ isValid, text }) => (
  <div
    className={`flex items-center gap-1.5 transition-colors duration-200 ${isValid ? "text-green-600" : "text-gray-400"}`}
  >
    {isValid ? (
      <Check className="w-3.5 h-3.5" />
    ) : (
      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-1 mr-1"></div>
    )}
    <span className={isValid ? "font-medium" : ""}>{text}</span>
  </div>
);

export default RegisterScreen;
