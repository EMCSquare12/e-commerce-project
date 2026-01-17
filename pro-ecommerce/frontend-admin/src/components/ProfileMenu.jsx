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

  if (!userInfo) {
    return (
      <Link
        to="/login"
        className="text-sm font-bold text-gray-700 transition-colors hover:text-blue-600"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group"
      >
        <div className="relative">
          <img
            className="object-cover w-8 h-8 transition-all border border-gray-200 rounded-full group-hover:border-blue-500 group-hover:ring-2 group-hover:ring-blue-100"
            src={
              userInfo.image ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            }
            alt="User profile"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        <div className="hidden text-left md:block">
          <p className="text-xs font-bold text-gray-700 transition-colors group-hover:text-blue-600">
            {userInfo.name}
          </p>
          <p className="text-[10px] font-medium text-gray-400">
            {userInfo.isAdmin ? "Administrator" : "User"}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* --- Dropdown Menu --- */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white border border-gray-100 shadow-xl rounded-xl animate-in fade-in zoom-in-95 ring-1 ring-black ring-opacity-5">
          <div className="block px-4 py-3 mb-1 border-b border-gray-50 md:hidden bg-gray-50/50 rounded-t-xl">
            <p className="text-sm font-bold text-gray-900 truncate">
              {userInfo.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
          </div>

          <div className="p-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile Settings
            </Link>

            <div className="h-px my-1 bg-gray-100" />

            <button
              onClick={logoutHandler}
              className="flex items-center w-full gap-2.5 px-3 py-2.5 text-sm font-medium text-left text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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
