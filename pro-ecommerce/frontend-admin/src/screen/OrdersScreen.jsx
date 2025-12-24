import React, { useState } from "react";
import {
  Download,
  MoreHorizontal,
  ChevronDown,
  Copy,
  Check,
  Package,
} from "lucide-react";
import { useGetOrdersQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Pagination";

// --- 1. Helper: Status Badge ---
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

// --- 2. Helper: Address Formatter ---
const formatAddress = (addr) => {
  if (!addr) return "N/A";
  return [addr.address, addr.city, addr.country, addr.postalCode]
    .filter(Boolean)
    .join(", ");
};

// --- 3. Custom Hook: Clipboard ---
const useClipboard = (resetTime = 2000) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), resetTime);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return { copiedId, copyToClipboard };
};

// --- 4. Sub-Component: Order Row ---
const OrderRow = ({ order, isExpanded, onToggle, copiedId, onCopy }) => {
  const fullAddress = formatAddress(order.shippingAddress);

  // FIX: Ensure orderId is treated as a string before using substring
  const rawId = order.orderId || order._id || "";
  const orderId = String(rawId);
  const isCopied = copiedId === orderId;

  return (
    <>
      <tr className="align-top transition-colors border-b hover:bg-gray-50 border-gray-50 last:border-0">
        <td className="p-4">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </td>
        <td className="p-4 font-mono text-sm font-medium text-gray-900">
          {/* FIX: Safe substring check */}
          {orderId.length > 10 ? `${orderId.substring(0, 10)}...` : orderId}
        </td>
        <td className="p-4 font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500">
              <Package className="w-3 h-3" />
            </div>
            {order.user ? order.user.name : "Guest"}
          </div>
        </td>
        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
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
          <div className="flex items-center gap-1 transition-colors group-hover:text-blue-600">
            <span className="text-sm font-medium">
              {order.orderItems.length} items
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </td>

        <td className="p-4 font-mono text-sm font-medium text-gray-900">
          ${order.totalPrice}
        </td>

        {/* Address Copy */}
        <td
          className="max-w-[180px] p-4 cursor-pointer group"
          onClick={() => onCopy(fullAddress, orderId)}
          title={fullAddress}
        >
          <div className="flex items-center justify-between gap-2 px-2 py-1 transition-all border border-transparent rounded-md hover:bg-white hover:shadow-sm hover:border-gray-200">
            <span className="text-sm text-gray-600 truncate">
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
          <button className="p-1.5 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
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

// --- 5. Main Component ---
const OrdersScreen = () => {
  // State
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Hooks
  const { copiedId, copyToClipboard } = useClipboard();
  const { data, isLoading, error } = useGetOrdersQuery({
    from: dateRange.from,
    to: dateRange.to,
    status,
    pageNumber,
  });

  const today = new Date().toISOString().split("T")[0];

  // Handlers
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
    setPageNumber(1); // Reset page on filter change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      setPageNumber(newPage);
    }
  };

  const toggleRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Orders
        </h1>
      </div>

      {/* Main Card */}
      <div className="pb-4 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 p-4 bg-white border-b border-gray-100 lg:flex-row lg:items-center">
          <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPageNumber(1);
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 outline-none"
                >
                  <option value="">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">From</span>
              <input
                type="date"
                name="from"
                max={today}
                value={dateRange.from}
                onChange={handleDateChange}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">To</span>
              <input
                type="date"
                name="to"
                min={dateRange.from}
                max={today}
                value={dateRange.to}
                onChange={handleDateChange}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
              />
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-6">
            <Message variant="danger">
              {error?.data?.message || error.error || "Error loading orders"}
            </Message>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="w-10 p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Address
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.orders?.length > 0 ? (
                    data.orders.map((order) => {
                      const id = order.orderId || order._id || "";
                      return (
                        <OrderRow
                          key={id}
                          order={order}
                          isExpanded={expandedOrderId === id}
                          onToggle={() => toggleRow(id)}
                          copiedId={copiedId}
                          onCopy={copyToClipboard}
                        />
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-gray-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {data?.pages > 1 && (
              <div className="bg-white border-t border-gray-100">
                <Pagination
                  setItemPages={(num) =>
                    setFilter((prev) => ({ ...prev, page: num }))
                  }
                  page={filter.page}
                  pages={data?.pages}
                  s
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersScreen;
