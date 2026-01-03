import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { toast } from "react-toastify";
import {
  CheckCheck,
  Trash2,
  ShoppingBag,
  User,
  AlertCircle,
  Clock,
  Bell,
  ArrowLeft,
} from "lucide-react";
import { markAsRead } from "../slices/notificationsSlice";
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsMutation,
  useMarkNotificationsReadMutation,
} from "../slices/notificationsApiSlice";

const NotificationsScreen = () => {
  const [notificationId, setNotificationId] = useState(null);
  const { data, isLoading, error } = useGetNotificationsQuery();
  const [clearNotifications, { isLoading: isClearing }] =
    useClearNotificationsMutation();
  const [markAllNotifications, { isLoading: isMarkAll }] =
    useMarkAllNotificationsMutation();
  const [markNotificationsRead, { isLoading: isRead }] =
    useMarkNotificationsReadMutation({
      notificationId,
    });
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case "user":
        return <User className="w-5 h-5 text-green-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "user":
        return "bg-green-100 text-green-700 border-green-200";
      case "alert":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleClearNotifications = async () => {
    try {
      const res = await clearNotifications().unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.res?.message || "Error to clear notifications");
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      const res = await markAllNotifications().unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.res?.message || "Notification not found");
    }
  };

  const handleMarkNotificationsRead = async (id) => {
    setNotificationId(id);
    try {
      const res = await markNotificationsRead(id).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.res?.message || "Notifications Not Found");
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-900"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        {data?.length > 0 && (
          <div className="flex gap-3">
            <button
              disabled={isMarkAll}
              onClick={handleMarkAllNotifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
            <button
              disabled={isClearing}
              onClick={handleClearNotifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-all bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isClearing ? "Clearing All..." : "Clear all"}
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="p-4 mb-4 rounded-full bg-gray-50">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              All caught up!
            </h3>
            <p className="text-gray-500">You have no new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data?.map((item) => (
              <div
                key={item._id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 transition-colors hover:bg-gray-50 ${
                  !item.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div className="flex-shrink-0 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getTypeStyle(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <Link
                      to={item.link}
                      onClick={() => dispatch(markAsRead(item._id))}
                      className={`text-base hover:text-blue-600 hover:underline ${
                        !item.read
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-700"
                      }`}
                    >
                      {item.message}
                    </Link>
                  </div>
                </div>

                {/* Action */}
                {!item.read && (
                  <button
                    onClick={() => handleMarkNotificationsRead(item._id)}
                    className="mt-3 text-xs font-medium text-blue-600 sm:mt-0 sm:ml-4 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
