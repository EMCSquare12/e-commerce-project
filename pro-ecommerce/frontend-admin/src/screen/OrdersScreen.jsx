import React, { useState } from "react";
import {
  Download,
  MoreHorizontal,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { useGetOrdersQuery } from "../slices/ordersApiSlice";
import Pagination from "../components/Pagination";

// --- 1. Helper Functions (Pure Logic) ---
const getStatusColor = (isDelivered) => {
  return isDelivered
    ? "bg-blue-100 text-blue-700 border border-blue-200"
    : "bg-yellow-100 text-yellow-700 border border-yellow-200";
};

const formatAddress = (addr) => {
  if (!addr) return "";
  return [addr.address, addr.city, addr.country, addr.postalCode]
    .filter(Boolean)
    .join(", ");
};

// --- 2. Custom Hook for Clipboard ---
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

// --- 3. Sub-Component: Order Row ---
const OrderRow = ({ order, isExpanded, onToggle, copiedId, onCopy }) => {
  const fullAddress = formatAddress(order.shippingAddress);
  const isCopied = copiedId === order.orderId;

  return (
    <tr className="align-top transition-colors hover:bg-gray-50">
      <td className="p-4">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="p-4 font-medium text-gray-900">{order.orderId}</td>
      <td className="p-4 font-medium text-gray-700">
        {order.user ? order.user.name : "Unknown User"}
      </td>
      <td className="p-4 text-gray-500 whitespace-nowrap">
        {new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}
      </td>

      {/* Expandable Items Cell */}
      <td
        className="p-4 text-gray-500 align-top cursor-pointer select-none group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-1 transition-colors group-hover:text-blue-600">
          <span>{order.orderItems.length} items</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
        {isExpanded && (
          <ul className="w-full mt-2 duration-200 border border-gray-100 rounded-md shadow-sm bg-gray-50 animate-in fade-in zoom-in-95">
            {order.orderItems.map((item, idx) => (
              <li
                key={idx}
                className="px-3 py-2 text-xs text-gray-700 truncate border-b border-gray-100 last:border-0"
              >
                {item.name} <span className="font-bold">({item.price})</span>
              </li>
            ))}
          </ul>
        )}
      </td>

      <td className="p-4 font-medium text-gray-900">${order.totalPrice}</td>

      {/* Address Cell with Copy */}
      <td
        className="max-w-[200px] p-4 font-medium text-gray-900 cursor-pointer group hover:bg-gray-100 active:text-blue-600 transition-colors rounded-lg"
        title={fullAddress}
        onClick={() => onCopy(fullAddress, order.orderId)}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate">{order.shippingAddress.city}</span>
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          )}
        </div>
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.isDelivered
          )}`}
        >
          {order.isDelivered ? "Shipped" : "Pending"}
        </span>
      </td>
      <td className="p-4 text-right">
        <button className="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

// --- 4. Main Component ---
const OrdersScreen = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Use custom hook
  const { copiedId, copyToClipboard } = useClipboard();

  const { data, isLoading, error } = useGetOrdersQuery({
    from: dateRange.from,
    to: dateRange.to,
    status,
    pageNumber,
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 p-4 border-b border-gray-100 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg block w-full p-2.5 pr-8"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>

            {/* Date Inputs */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">From</span>
              <input
                type="date"
                name="from"
                max={today}
                value={dateRange.from}
                onChange={handleDateChange}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg block w-full p-2.5"
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
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg block w-full p-2.5"
              />
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="w-10 p-4">Select</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {data?.orders?.map((order) => (
                <OrderRow
                  key={order.orderId || order._id}
                  order={order}
                  isExpanded={expandedOrderId === order.orderId}
                  onToggle={() => toggleRow(order.orderId)}
                  copiedId={copiedId}
                  onCopy={copyToClipboard}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && !error && (
        <Pagination
          setItemPages={setPageNumber}
          page={pageNumber}
          pages={data?.pages}
        />
      )}
    </div>
  );
};

export default OrdersScreen;
