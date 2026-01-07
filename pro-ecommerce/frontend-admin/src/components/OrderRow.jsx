import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MoreHorizontal,
  ChevronDown,
  Copy,
  Check,
  Eye,
  FileText,
  Truck,
  XCircle,
} from "lucide-react";
import { useUpateDeliveryStatusMutation } from "../slices/ordersApiSlice";

const formatAddress = (addr) => {
  if (!addr) return "N/A";
  return [addr.address, addr.city, addr.country, addr.postalCode]
    .filter(Boolean)
    .join(", ");
};
const OrderRow = ({ order, isExpanded, onToggle, copiedId, onCopy }) => {
  const [showMenu, setShowMenu] = useState(false);
  const fullAddress = formatAddress(order.shippingAddress);
  const [updateDeliveryStatus, { isLoading: isDelivered }] =
    useUpateDeliveryStatusMutation({
      orderId: order._id,
    });

  const rawId = order.orderId || order._id || "";
  const orderId = String(rawId);
  const isCopied = copiedId === orderId;

  const StatusBadge = ({ isDelivered }) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          isDelivered
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-yellow-100 text-yellow-700 border-yellow-200"
        }`}
      >
        {isDelivered ? "Shipped" : "Pending"}
      </span>
    );
  };

  const handleDownloadInvoice = () => {
    console.log(`Downloading invoice for order ${orderId}...`);
    setShowMenu(false);
  };

  const handleUpdateDeliveryStatus = async () => {
    console.log(order._id);
    try {
      const res = await updateDeliveryStatus({ orderId: order._id }).unwrap();
      setShowMenu(false);
      toast.success(res?.message || `Order #${order.orderId} is ready to ship`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change delivery status");
    }
  };

  return (
    <>
      <tr className="align-top transition-colors border-b hover:bg-gray-50 border-gray-50 last:border-0">
        <td className="p-4 text-sm font-medium text-gray-900">
          {orderId.length > 10 ? `${orderId.substring(0, 10)}...` : orderId}
        </td>
        <td className="p-4 font-medium text-gray-700">
          <div className="flex items-center gap-2">
            {order.user ? order.user.name : "Guest"}
          </div>
        </td>
        <td className="p-4 text-sm font-medium text-gray-700 whitespace-nowrap">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>

        {/* Expand Trigger */}
        <td
          className="p-4 text-gray-500 cursor-pointer select-none group"
          onClick={onToggle}
        >
          <div className="flex flex-row items-center gap-1 text-gray-700 transition-colors group-hover:text-blue-600">
            <span className="flex flex-row text-sm font-medium whitespace-nowrap">
              {order.orderItems.length} items
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </td>

        <td className="p-4 font-mono text-sm font-medium text-gray-900 ">
          ${order.totalPrice}
        </td>

        {/* Address Copy */}
        <td
          className="max-w-[180px] p-4 cursor-pointer group"
          onClick={() => onCopy(fullAddress, orderId)}
          title={fullAddress}
        >
          <div className="flex items-center justify-between gap-2 px-2 py-1 font-medium transition-all border border-transparent rounded-md hover:bg-white hover:shadow-sm hover:border-gray-200">
            <span className="text-sm text-gray-700 truncate">
              {order.shippingAddress?.city || "N/A"}
            </span>
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </div>
        </td>

        <td className="p-4">
          <StatusBadge isDelivered={order.isDelivered} />
        </td>

        <td className="p-4 text-right">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showMenu && (
            <div
              className="fixed inset-0 z-10 w-full h-full cursor-default"
              onClick={() => setShowMenu(false)}
            />
          )}

          {/* 3. The Menu */}
          {showMenu && (
            <div className="absolute right-0 z-20 w-48 mt-2 duration-100 origin-top-right bg-white border border-gray-100 rounded-lg shadow-lg animate-in fade-in zoom-in-95">
              <div className="p-1">
                {/* View Details */}
                <Link
                  to={`/order/${orderId}`}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setShowMenu(false)}
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                  View Details
                </Link>

                {/* Download Invoice */}
                <button
                  onClick={handleDownloadInvoice}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  Download Invoice
                </button>
              </div>

              <div className="h-px my-1 bg-gray-100" />

              <div className="p-1">
                {/* Change Status Logic */}
                <button
                  disabled={isDelivered}
                  onClick={handleUpdateDeliveryStatus}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-50"
                >
                  {order.isDelivered ? (
                    <>
                      <XCircle className="w-4 h-4 text-orange-500" />
                      Mark Pending
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-green-600" />
                      Mark Shipped
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </td>
      </tr>

      {/* Expanded Details Row */}
      {isExpanded && (
        <tr className="bg-gray-50/50">
          <td colSpan="9" className="p-4 pt-0">
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm ml-14 animate-in fade-in slide-in-from-top-1">
              <h4 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Order Items
              </h4>
              <ul className="space-y-3">
                {order.orderItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between pb-1 text-sm text-gray-700 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        x{item.qty || item.quantity}
                      </span>
                    </div>
                    <span className="font-mono text-gray-600">
                      ${item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default OrderRow;
