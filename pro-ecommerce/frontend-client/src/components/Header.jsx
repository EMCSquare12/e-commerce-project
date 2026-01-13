import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toggleDrawer } from "../slices/toggleSlice"; // Import toggle action
import {
  FaCaretDown,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaBars, // Import Hamburger Icon
} from "react-icons/fa";
import { ShoppingBag, User, AlertCircle } from "lucide-react";

import SubHeader from "./SubHeader";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "../slices/notificationsApiSlice";

const Header = () => {
  const [notificationId, setNotificationId] = useState(null);
  const { data } = useGetNotificationsQuery();
  const [markNotificationsRead] = useMarkNotificationsReadMutation();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // State for dropdowns
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  const unreadCount = data?.filter((n) => !n.read).length;

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

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case "user":
        return <User className="w-4 h-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <FaBell className="w-4 h-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkNotificationsRead = async (id) => {
    setNotificationId(id);
    try {
      await markNotificationsRead({ notificationId: id }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 text-white shadow-md bg-slate-900">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu - Visible on Mobile */}
          <button
            onClick={() => dispatch(toggleDrawer())}
            className="text-2xl text-white focus:outline-none lg:hidden"
          >
            <FaBars />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-wide"
          >
            <i className="fa-solid fa-shop text-amber-500"></i>
            <span>ProShop</span>
          </Link>
        </div>

        <SubHeader />

        {/* Right Section: Icons */}
        <nav className="flex items-center gap-4 text-sm font-medium tracking-wider uppercase sm:gap-6">
          {/* Notification Bell */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="flex items-center gap-1 transition hover:text-amber-500 focus:outline-none"
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifyOpen && (
              <div className="absolute right-0 z-50 mt-2 origin-top-right bg-white border border-gray-200 shadow-xl w-80 rounded-xl animate-fade-in ring-1 ring-black ring-opacity-5">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium text-blue-600">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {data && data.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    data?.slice(0, 10).map((item) => (
                      <Link
                        key={item._id}
                        to={`/notifications/${item._id}`}
                        onClick={() => {
                          handleMarkNotificationsRead(item._id);
                          setNotifyOpen(false);
                        }}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors hover:bg-gray-50 ${
                          !item.read ? "bg-blue-50/60" : ""
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1 p-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${
                              !item.read
                                ? "font-semibold text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {item.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!item.read && (
                          <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                        )}
                      </Link>
                    ))
                  )}
                </div>
                <Link
                  to="/notifications"
                  onClick={() => setNotifyOpen(false)}
                  className="block w-full py-2.5 text-xs font-bold text-center text-gray-600 uppercase transition-colors border-t border-gray-100 hover:bg-gray-50 hover:text-blue-600 rounded-b-xl"
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 transition hover:text-amber-500"
          >
            <FaShoppingCart /> <span className="hidden sm:inline">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-amber-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* User Profile */}
          <div className="relative">
            {userInfo ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 transition hover:text-amber-500 focus:outline-none"
                >
                  {userInfo.name} <FaCaretDown />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-20 w-48 py-1 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link
                      to="/profile"
                      className="flex items-center block w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaUserCircle /> Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100"
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
                <FaUser /> <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
