import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  ShoppingBag,
  Trash2,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  useDeleteSelectedNotificationMutation,
  useGetNotificationDetailsQuery,
} from "../slices/notificationsApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";

const NotificationDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, error } = useGetNotificationDetailsQuery({
    notificationId: id,
  });

  const [deleSelectedNotification, { isLoading: isDeleted }] =
    useDeleteSelectedNotificationMutation();

  // Helper for Styles
  const getTheme = (type) => {
    switch (type) {
      case "order":
        return {
          icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
          bg: "bg-blue-50",
          border: "border-blue-100",
          badge: "bg-blue-100 text-blue-700",
        };
      case "user":
        return {
          icon: <User className="w-6 h-6 text-green-600" />,
          bg: "bg-green-50",
          border: "border-green-100",
          badge: "bg-green-100 text-green-700",
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          bg: "bg-amber-50",
          border: "border-amber-100",
          badge: "bg-amber-100 text-amber-700",
        };
    }
  };

  const handleDeleteSelectedNotification = async () => {
    try {
      const res = await deleSelectedNotification({
        notificationId: id,
      }).unwrap();
      toast.success(res?.message || "Deleted successfully");
      navigate("/admin/notifications");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete notification");
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="p-4">
        <Message variant="danger">
          {error?.data?.message || "Error loading notification"}
        </Message>
      </div>
    );

  const theme = getTheme(data?.type);

  return (
    <div className="max-w-3xl px-4 py-6 pb-24 mx-auto md:pb-8">
      {/* Back Button */}
      <div className="mb-4 md:mb-6">
        <button
          onClick={() => navigate("/admin/notifications")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-amber-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notifications
        </button>
      </div>

      {/* --- Main Card --- */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* Header Section */}
        <div className="flex flex-col items-start gap-4 p-5 border-b border-gray-100 sm:flex-row md:p-8">
          <div
            className={`p-3 md:p-4 rounded-xl flex-shrink-0 ${theme.bg} ${theme.border} border self-start`}
          >
            {theme.icon}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span
                className={`px-2.5 py-1 rounded text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${theme.badge}`}
              >
                {data?.type}
              </span>
              <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(data?.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              {data?.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 md:p-8">
          <div className="mb-8">
            <h3 className="mb-2 text-xs font-bold tracking-wide text-gray-400 uppercase md:text-sm">
              Message
            </h3>
            <p className="text-base leading-relaxed text-gray-700 md:text-lg">
              {data?.message}
            </p>
          </div>

          {/* Related Data (Order Snapshot) */}
          {data?.type === "order" && data?.relatedData && (
            <div className="flex flex-col gap-4 p-4 mb-8 border border-gray-200 bg-gray-50 rounded-xl md:p-5">
              <h4 className="flex items-center gap-2 font-bold text-gray-900">
                <CheckCircle className="w-4 h-4 text-green-500" /> Order
                Snapshot
              </h4>

              {/* Grid: 1 column on mobile, 3 on desktop */}
              <div className="grid grid-cols-1 gap-4 pb-4 border-b border-gray-200 sm:grid-cols-3">
                <div className="p-3 bg-white border border-gray-100 rounded-lg sm:p-0 sm:bg-transparent sm:border-0">
                  <p className="text-xs text-gray-500 uppercase">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    ${data.relatedData.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg sm:p-0 sm:bg-transparent sm:border-0">
                  <p className="text-xs text-gray-500 uppercase">Customer</p>
                  <p className="font-medium text-slate-900">
                    {data.user || "Guest"}
                  </p>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-lg sm:p-0 sm:bg-transparent sm:border-0">
                  <p className="text-xs text-gray-500 uppercase">Items Count</p>
                  <p className="font-medium text-slate-900">
                    {data.relatedData.orderItems?.length || 0} Items
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-gray-400 uppercase">
                  Order Details
                </p>
                {/* Responsive Table Wrapper */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-xs font-semibold text-left text-gray-600 uppercase whitespace-nowrap">
                          Name
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold text-center text-gray-600 uppercase whitespace-nowrap">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold text-right text-gray-600 uppercase whitespace-nowrap">
                          Price
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold text-right text-gray-600 uppercase whitespace-nowrap">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.relatedData.orderItems?.map((item, index) => {
                        const itemSubtotal = item.price * item.qty;
                        return (
                          <tr
                            key={item._id || index}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-600 whitespace-nowrap">
                              {item.qty}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600 whitespace-nowrap">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900 whitespace-nowrap">
                              ${itemSubtotal.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col justify-end pt-4 border-t border-gray-100 sm:flex-row">
            <button
              disabled={isDeleted}
              onClick={handleDeleteSelectedNotification}
              className="flex items-center justify-center w-full gap-2 px-6 py-3.5 text-sm font-bold text-red-600 transition-colors bg-white border-2 border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              Delete Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsScreen;
