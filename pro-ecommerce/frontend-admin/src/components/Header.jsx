import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useDebounce from "../hooks/useDebounce";
import { Link, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { BASE_URL } from "../constants";
import {
  Search,
  Bell,
  ShoppingBag,
  User,
  AlertCircle,
  Menu,
  X, // 1. Import X icon
} from "lucide-react";
import { toast } from "react-toastify";
import ProfileMenu from "./ProfileMenu";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "../slices/notificationsApiSlice";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../slices/toggleSlice";
import { filterChange } from "../slices/productSlice";
import { setOrderKeyword } from "../slices/orderSlice";
import { setCustomerKeyword } from "../slices/customerSlice";
import { setCustomerByIdKeyword } from "../slices/customerDetailsSlice";

const Header = () => {
  const [notificationId, setNotificationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Api Hooks
  const { data = [], isLoading, error, refetch } = useGetNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationsReadMutation();

  const unreadCount = data?.filter((n) => !n.read).length;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();

  const isProductsRoute = location.pathname === "/admin/products";
  const isOrdersRoute = location.pathname === "/admin/orders";
  const isCustomersRoute = location.pathname === "/admin/customers";
  const isCustomerOrdersRoute =
    location.pathname.startsWith("/admin/customers/");
  const isDashboardRoute = location.pathname === "/admin";

  useEffect(() => {
    if (isProductsRoute) {
      dispatch(filterChange({ key: "keyword", value: debouncedSearchTerm }));
    } else if (isOrdersRoute) {
      dispatch(setOrderKeyword(debouncedSearchTerm));
    } else if (isCustomersRoute) {
      dispatch(setCustomerKeyword(debouncedSearchTerm));
    } else if (isCustomerOrdersRoute) {
      dispatch(setOrderKeyword(debouncedSearchTerm));
    } else if (isDashboardRoute) {
      dispatch(setCustomerByIdKeyword(debouncedSearchTerm));
    }
  }, [
    debouncedSearchTerm,
    dispatch,
    isProductsRoute,
    isOrdersRoute,
    isCustomersRoute,
    isCustomerOrdersRoute,
    isDashboardRoute,
  ]);

  useEffect(() => {
    setSearchTerm("");
  }, [location.pathname]);

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("newOrderPlaced", () => {
      refetch();
    });

    return () => socket.disconnect();
  }, [refetch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case "user":
        return <User className="w-4 h-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleMarkNotificationsRead = async (id) => {
    setNotificationId(id);
    try {
      const res = await markNotificationAsRead({ notificationId: id }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || "Error updating notification");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-16 px-4 transition-all duration-300 border-b border-gray-200 bg-white/90 backdrop-blur-md lg:left-64 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => dispatch(toggleSidebar(true))}
          className="p-2 text-gray-600 rounded-lg lg:hidden hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar - Hidden on small mobile screens */}
        <div className="relative hidden w-full max-w-xs sm:block md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isProductsRoute
                ? "Search Products..."
                : isOrdersRoute
                  ? "Search Orders..."
                  : isCustomersRoute
                    ? "Search Customers..."
                    : isDashboardRoute
                      ? "Search Orders..."
                      : isCustomerOrdersRoute
                        ? "Search Orders..."
                        : "Search..."
            }
            className="block w-full py-2 pl-10 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-all border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Notification Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="w-6 h-6" />

            {unreadCount > 0 && (
              <span className="absolute flex h-4 w-4 top-1 right-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 z-50 mt-2 origin-top-right bg-white border border-gray-200 shadow-xl w-72 md:w-80 rounded-xl animate-in fade-in zoom-in-95 ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/80 rounded-t-xl backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-gray-800">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                    <Bell className="w-8 h-8 mb-2 text-gray-300" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  data.slice(0, 10).map((item) => (
                    <Link
                      key={item._id}
                      to={`/admin/notifications/${item._id}` || "#"}
                      onClick={() => {
                        handleMarkNotificationsRead(item._id);
                        setIsOpen(false);
                      }}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors hover:bg-gray-50 active:bg-gray-100 ${
                        !item.read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5 p-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
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
                        <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                      )}
                    </Link>
                  ))
                )}
              </div>

              <Link
                to="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-xs font-bold text-center text-gray-600 uppercase transition-colors border-t border-gray-100 hover:bg-gray-50 hover:text-blue-600 rounded-b-xl"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative z-50">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
