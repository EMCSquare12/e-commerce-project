import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaCheckDouble,
  FaTrash,
  FaBoxOpen,
  FaInfoCircle,
} from "react-icons/fa";
import {
  markAsRead,
  markAllAsRead,
  clearAll,
} from "../slices/notificationSlice";
import { Link } from "react-router-dom";

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  // Helper to get icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <FaBoxOpen className="text-blue-500" />;
      case "system":
        return <FaInfoCircle className="text-gray-500" />;
      default:
        return <FaInfoCircle className="text-amber-500" />;
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={() => dispatch(markAllAsRead())}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
            >
              <FaCheckDouble /> Mark all read
            </button>
            <button
              onClick={() => dispatch(clearAll())}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
            >
              <FaTrash /> Clear all
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="flex justify-center mb-4">
              <FaInfoCircle className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="mb-6 text-sm">
              We'll let you know when updates arrive.
            </p>
            <Link to="/" className="text-blue-600 hover:underline">
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => dispatch(markAsRead(item.id))}
                className={`p-4 transition-colors cursor-pointer hover:bg-gray-50 flex gap-4 ${
                  !item.read ? "bg-blue-50/50" : "bg-white"
                }`}
              >
                {/* Icon Column */}
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm">
                    {getIcon(item.type)}
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4
                      className={`text-base ${
                        !item.read
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-700"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-sm ${
                      !item.read ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {item.message}
                  </p>
                  {!item.read && (
                    <span className="inline-block mt-2 text-xs font-semibold text-blue-600">
                      • Unread
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
