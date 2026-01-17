import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/admin");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/admin");
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-slate-50 sm:px-6 lg:px-8">
      {/* Card Container */}
      <div className="w-full max-w-sm p-6 space-y-8 bg-white border border-gray-200 shadow-xl rounded-2xl md:p-10 md:max-w-md">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mx-auto mb-6 shadow-lg w-14 h-14 text-amber-500 bg-slate-900 rounded-2xl">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Secure access for ProShop administrators
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={submitHandler}>
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1.5 text-sm font-bold text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full py-3 pr-3 text-sm placeholder-gray-400 transition-all border border-gray-300 outline-none pl-11 text-slate-900 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="admin@proshop.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-slate-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-3 text-sm placeholder-gray-400 transition-all border border-gray-300 outline-none pl-11 pr-11 text-slate-900 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 cursor-pointer hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-bold text-white transition-all bg-slate-900 rounded-xl hover:bg-slate-800 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? (
              "Authenticating..."
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ProShop Admin. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
