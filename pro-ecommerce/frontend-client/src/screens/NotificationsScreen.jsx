import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Loader as LoaderIcon,
} from "lucide-react";
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsMutation,
  useMarkNotificationsReadMutation,
} from "../slices/notificationsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const NotificationsScreen = () => {
  const [notificationId, setNotificationId] = useState(null);
  const { data, isLoading, error } = useGetNotificationsQuery();

  const [clearNotifications, { isLoading: isClearing }] =
    useClearNotificationsMutation();
  const [markAllNotifications, { isLoading: isMarkAll }] =
    useMarkAllNotificationsMutation();
  const [markNotificationsRead] = useMarkNotificationsReadMutation();

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
        return <Bell className="w-5 h-5 text-gray-600" />;
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
      toast.error(err?.res?.message || "Error clearing notifications");
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      const res = await markAllNotifications().unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.res?.message || "Error updating notifications");
    }
  };

  const handleMarkNotificationsRead = async (id) => {
    setNotificationId(id);
    try {
      await markNotificationsRead({ notificationId: id }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Message variant="danger">
          {error?.data?.message || error.error || "Something went wrong"}
        </Message>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 py-6 pb-24 mx-auto md:pb-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100 hover:text-slate-900"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        </div>

        {data?.length > 0 && (
          <div className="flex gap-2">
            <button
              disabled={isMarkAll}
              onClick={handleMarkAllNotifications}
              className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 md:flex-none"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="md:inline">Mark all read</span>
            </button>
            <button
              disabled={isClearing}
              onClick={handleClearNotifications}
              className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-bold text-red-600 transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-200 md:flex-none"
            >
              {isClearing ? (
                <LoaderIcon className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="md:inline">
                {isClearing ? "Clearing..." : "Clear all"}
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
            <h3 className="text-lg font-bold text-slate-800">All caught up!</h3>
            <p className="text-gray-500">You have no new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data?.map((item) => (
              <div
                key={item._id}
                className={`relative p-4 md:p-5 transition-colors hover:bg-gray-50 ${
                  !item.read ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div className="flex-shrink-0 p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTypeStyle(
                          item.type,
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
                      to={`/notifications/${item._id}`}
                      onClick={() => handleMarkNotificationsRead(item._id)}
                      className={`block text-sm md:text-base mb-2 hover:text-blue-600 ${
                        !item.read
                          ? "font-bold text-slate-900"
                          : "font-medium text-slate-700"
                      }`}
                    >
                      {item.message}
                    </Link>

                    {/* Action Button (Mobile Friendly) */}
                    {!item.read && (
                      <button
                        onClick={() => handleMarkNotificationsRead(item._id)}
                        className="inline-flex items-center text-xs font-bold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
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
