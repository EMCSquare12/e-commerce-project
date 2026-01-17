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
} from "lucide-react";
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsMutation,
  useMarkNotificationsReadMutation,
} from "../slices/notificationsApiSlice";
import Loader from "../components/Loader"; 

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
        return <User className="w-5 h-5 text-emerald-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "user":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "alert":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleClearNotifications = async () => {
    try {
      const res = await clearNotifications().unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || "Error clearing notifications");
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      const res = await markAllNotifications().unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || "Error marking all as read");
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

  if (isLoading)
    return (
      <div className="flex justify-center pt-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl px-4 py-6 pb-24 mx-auto md:pb-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 text-gray-500 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-slate-900"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        </div>

        {data?.length > 0 && (
          <div className="flex gap-2 sm:gap-3">
            <button
              disabled={isMarkAll}
              onClick={handleMarkAllNotifications}
              className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:scale-95 disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
            <button
              disabled={isClearing}
              onClick={handleClearNotifications}
              className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-200 active:scale-95 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isClearing ? "Clearing..." : "Clear all"}</span>
            </button>
          </div>
        )}
      </div>

      {/* --- Notification List --- */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 mb-4 rounded-full bg-slate-50">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">All caught up!</h3>
            <p className="text-gray-500">You have no new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data?.map((item) => (
              <div
                key={item._id}
                className={`flex flex-col sm:flex-row sm:items-start justify-between p-4 sm:p-5 transition-colors hover:bg-gray-50 group ${
                  !item.read ? "bg-blue-50/30" : ""
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
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <Link
                      to={`/admin/notifications/${item._id}`}
                      onClick={() => handleMarkNotificationsRead(item._id)}
                      className={`block text-sm sm:text-base mb-1 ${
                        !item.read
                          ? "font-bold text-slate-900"
                          : "font-medium text-slate-600"
                      } hover:text-blue-600 transition-colors line-clamp-2`}
                    >
                      {item.message}
                    </Link>
                  </div>
                </div>

                {/* Mark Read Action (Mobile: Bottom Right, Desktop: Right aligned) */}
                {!item.read && (
                  <div className="flex justify-end mt-2 sm:mt-0 sm:ml-4 sm:self-center">
                    <button
                      onClick={() => handleMarkNotificationsRead(item._id)}
                      className="px-3 py-1 text-xs font-bold text-blue-600 transition-colors rounded-full bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                    >
                      Mark read
                    </button>
                  </div>
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
