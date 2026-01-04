import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Search, Bell, ShoppingBag, User, AlertCircle } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { markAsRead } from "../slices/notificationsSlice";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "../slices/notificationsApiSlice";

const Header = () => {
  const [notificationId, setNotificationId] = useState(null);
  const { data, isLoading, error } = useGetNotificationsQuery();
  const [markNotificationAsRead, { isLoading: isRead }] =
    useMarkNotificationsReadMutation();
  const dispatch = useDispatch();
  const unreadCount = data?.filter((n) => !n.read).length;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log(data);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Helper to get Icon based on notification type
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
      const res = await markNotificationAsRead(id).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.res?.message || "Notifications Not Found");
    }
  };
  return (
    <header className="fixed top-0 right-0 z-20 flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 left-64">
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-6">
        {/* --- Notification Bell & Dropdown --- */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-gray-400 transition-colors rounded-full hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="w-6 h-6" />

            {/* Dynamic Red Badge */}
            {unreadCount > 0 && (
              <span className="absolute flex h-4 w-4 top-1 right-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 z-50 mt-2 origin-top-right bg-white border border-gray-200 shadow-xl w-80 rounded-xl animate-fade-in ring-1 ring-black ring-opacity-5">
              {/* Dropdown Header */}
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

              {/* Dropdown List */}
              <div className="max-h-[320px] overflow-y-auto">
                {data.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  // Show top 5 notifications
                  data.slice(0, 10).map((item) => (
                    <Link
                      key={item._id}
                      to={`/admin/notifications/${item._id}` || "#"}
                      onClick={() => {
                        handleMarkNotificationsRead(item._id);
                        setIsOpen(false);
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

              {/* Dropdown Footer */}
              <Link
                to="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full py-2.5 text-xs font-bold text-center text-gray-600 uppercase transition-colors border-t border-gray-100 hover:bg-gray-50 hover:text-blue-600 rounded-b-xl"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative z-50">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
