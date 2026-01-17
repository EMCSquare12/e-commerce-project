import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import {
  ShoppingBag,
  UserRound,
  AlertCircle,
  ChevronDown,
  ShoppingCart,
  Bell,
  LogOut,
} from "lucide-react";

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
        return <UserRound className="w-4 h-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
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
    <header className="sticky top-0 z-40 w-full text-white shadow-md bg-slate-900">
      <div className="container flex items-center justify-between gap-4 px-4 py-3 mx-auto">
        <div className="flex items-center flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-wide md:text-2xl"
          >
            <i className="fa-solid fa-shop text-amber-500"></i>
            <span>ProShop</span>
          </Link>
        </div>
        <div className="flex-grow max-w-md mx-auto">
          <SubHeader />
        </div>
        <nav className="items-center flex-shrink-0 hidden gap-4 text-sm font-medium tracking-wider uppercase md:flex sm:gap-6">
          {/* Notification Bell */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="flex items-center gap-1 transition hover:text-amber-500 focus:outline-none"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown (Same as before) */}
            {notifyOpen && (
              <div className="absolute right-0 z-50 mt-2 origin-top-right bg-white border border-gray-200 shadow-xl w-80 rounded-xl ring-1 ring-black ring-opacity-5">
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
                  {/* ... (Existing Notification Logic) ... */}
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
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors hover:bg-gray-50 text-gray-800 ${
                          !item.read ? "bg-blue-50/60" : ""
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs md:text-sm">{item.message}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                <Link
                  to="/notifications"
                  onClick={() => setNotifyOpen(false)}
                  className="block w-full py-2 text-xs font-bold text-center text-gray-600 border-t"
                >
                  View All
                </Link>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 transition hover:text-amber-500"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
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
                  {userInfo.name} <ChevronDown className="w-4 h-4" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-20 w-48 py-1 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link
                      to="/profile"
                      className="flex items-center block w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <UserRound className="w-4 h-4" /> Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-amber-500"
              >
                <UserRound className="w-5 h-5" /> Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
