import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import {
  FaCaretDown,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
} from "react-icons/fa";
import SubHeader from "./SubHeader";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  // Get notifications from Redux
  const { notifications } = useSelector((state) => state.notifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // State for dropdowns
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false); // New state for notification dropdown

  const profileRef = useRef(null);
  const notifyRef = useRef(null); // New ref

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setProfileOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close Profile Dropdown
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      // Close Notification Dropdown
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 text-white shadow-md bg-slate-900">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-wide"
        >
          <i className="fa-solid fa-shop text-amber-500"></i>
          <span>ProShop</span>
        </Link>
        <SubHeader />

        <nav className="flex items-center gap-6 text-sm font-medium tracking-wider uppercase">
          {/* --- Notification Bell & Dropdown --- */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="relative flex items-center gap-1 transition hover:text-amber-500 focus:outline-none"
            >
              <FaBell className="text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {notifyOpen && (
              <div className="absolute right-0 z-20 mt-3 overflow-hidden text-gray-800 bg-white border border-gray-100 rounded-lg shadow-xl w-80">
                <div className="px-4 py-3 font-semibold border-b border-gray-100 bg-gray-50">
                  Notifications
                </div>
                <div className="overflow-y-auto max-h-64">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    // Show only first 3 items in dropdown
                    notifications.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${
                          !item.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/notifications"
                  onClick={() => setNotifyOpen(false)}
                  className="block w-full py-2 text-xs font-bold text-center text-blue-600 uppercase bg-gray-50 hover:bg-gray-100 hover:text-blue-800"
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>
          {/* ------------------------------------ */}

          <Link
            to="/cart"
            className="relative flex items-center gap-1 transition hover:text-amber-500"
          >
            <FaShoppingCart /> Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-amber-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* User Info Logic */}
          {userInfo ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1 transition hover:text-amber-500 focus:outline-none"
              >
                {userInfo.name} <FaCaretDown />
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-20 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="flex items-center block w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaUserCircle /> Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 transition hover:text-amber-500"
            >
              <FaUser /> Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
