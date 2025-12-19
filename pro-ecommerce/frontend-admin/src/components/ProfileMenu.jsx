import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
    }
  };

  // If not logged in, show "Sign In" button instead of Avatar
  if (!userInfo) {
    return (
      <Link
        to="/login"
        className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- Trigger Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group"
      >
        <img
          className="object-cover w-8 h-8 transition-colors border border-gray-200 rounded-full group-hover:border-blue-500"
          src={
            userInfo.image ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          }
          alt="User profile"
        />
        <div className="hidden text-left md:block">
          <p className="text-xs font-medium text-gray-700 group-hover:text-blue-600">
            {userInfo.name}
          </p>
          <p className="text-[10px] text-gray-400">Admin</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* --- Dropdown Menu --- */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in-down">
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            <button
              onClick={logoutHandler}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
