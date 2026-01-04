import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  ShoppingBag,
  Trash2,
  ExternalLink,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  useDeleteSelectedNotificationMutation,
  useGetNotificationDetailsQuery,
} from "../slices/notificationsApiSlice";
import { toast } from "react-toastify";

const NotificationDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useGetNotificationDetailsQuery({
    notificationId: id,
  });
  const [deleSelectedNotification, { isLoading: isDeleted }] =
    useDeleteSelectedNotificationMutation({
      notificationId: id,
    });
  console.log(id);
  console.log(data);

  // Helper for Styles
  const getTheme = (type) => {
    switch (type) {
      case "order":
        return {
          icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
          bg: "bg-blue-50",
          border: "border-blue-100",
          badge: "bg-blue-100 text-blue-700",
          btn: "bg-blue-600 hover:bg-blue-700 text-white",
        };
      case "user":
        return {
          icon: <User className="w-6 h-6 text-green-600" />,
          bg: "bg-green-50",
          border: "border-green-100",
          badge: "bg-green-100 text-green-700",
          btn: "bg-green-600 hover:bg-green-700 text-white",
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          bg: "bg-amber-50",
          border: "border-amber-100",
          badge: "bg-amber-100 text-amber-700",
          btn: "bg-gray-800 hover:bg-gray-900 text-white",
        };
    }
  };

  const theme = getTheme(data?.type);

  const handleDeleteSelectedNotification = async () => {
    try {
      const res = await deleSelectedNotification({
        notificationId: id,
      }).unwrap();
      toast.success(res?.message || "Deleted successfully");
      navigate("/admin/notifications");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete notification");
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/notifications")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notifications
        </button>
      </div>

      {/* --- Main Card --- */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-start gap-5 p-8 border-b border-gray-100">
          <div
            className={`p-4 rounded-xl flex-shrink-0 ${theme.bg} ${theme.border} border`}
          >
            {theme.icon}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${theme.badge}`}
              >
                {data?.type}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{new Date(data?.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              {data?.title}
            </h1>
            {/* <p className="text-gray-500">
              Notification ID:{" "}
              <span className="font-mono text-xs select-all">{data?._id}</span>
            </p> */}
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-900 uppercase">
              Message Content
            </h3>
            <p className="text-lg leading-relaxed text-gray-700">
              {data?.message}
            </p>
          </div>

          {data?.type === "order" && data?.relatedData && (
            <div className="flex flex-col gap-4 p-5 mb-8 border border-gray-200 bg-gray-50 rounded-xl">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                <CheckCircle className="w-4 h-4 text-green-500" /> Snapshot
              </h4>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ${data.relatedData.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Customer</p>
                  <p className="font-medium text-gray-900">
                    {data.user || "Guest"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 uppercase">
                  Order Items
                </p>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-xs font-semibold text-left text-gray-600 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold text-center text-gray-600 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold text-right text-gray-600 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold text-right text-gray-600 uppercase">
                          Tax
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold text-right text-gray-600 uppercase">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.relatedData.orderItems?.map((item, index) => {
                        const itemTax = item.price * 0.15 * item.qty || 0;
                        const itemSubtotal = item.price * item.qty;

                        return (
                          <tr
                            key={item._id || index}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-600">
                              {item.qty}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-red-500">
                              +${itemTax.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                              ${itemSubtotal.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Table Footer for Grand Totals */}
                    <tfoot className="font-semibold bg-gray-50">
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-2 text-sm text-right text-gray-500"
                        >
                          Total Inc. Tax:
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-blue-600">
                          ${data.relatedData.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-end sm:flex-row">
            {/* <Link
              // to={notification.link}
              className={`flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-semibold transition-all rounded-lg shadow-sm ${theme.btn} focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <ExternalLink className="w-4 h-4" />
              View Related {data?.type === "order" ? "Order" : "Resource"}
            </Link> */}

            <button
              disabled={isDeleted}
              onClick={handleDeleteSelectedNotification}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-red-600 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200"
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
