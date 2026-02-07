import React, { useState } from "react";
import { Download, ChevronDown, Filter, Calendar, Search } from "lucide-react";
import { useGetOrdersQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Pagination";
import OrderRow from "../components/OrderRow";
import { useDispatch, useSelector } from "react-redux";
import { setDateRange, setStatus, setPageNumber } from "../slices/orderSlice";

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

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const { dateRange, pageNumber, status, keyword } = useSelector(
    (state) => state.order,
  );
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Hooks
  const { copiedId, copyToClipboard } = useClipboard();
  const { data, isLoading, error } = useGetOrdersQuery({
    from: dateRange.from,
    to: dateRange.to,
    status,
    keyword,
    pageNumber,
  });

  console.log("Fetched Orders:", data);
  const today = new Date().toISOString().split("T")[0];

  // Handlers
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    dispatch(setDateRange({ name, value }));
    dispatch(setPageNumber(1));
  };

  const toggleRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
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
    <div className="pb-24 mx-auto space-y-6 max-w-7xl md:pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Orders
        </h1>
        {/* Mobile Export Button (Optional placement, or keep inside filter bar) */}
      </div>

      {/* --- Filter Bar --- */}
      <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Side: Status & Dates */}
          <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
            {/* Status Dropdown */}
            <div className="flex-1 sm:flex-none">
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    dispatch(setStatus(e.target.value));
                    dispatch(setPageNumber(1));
                  }}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent block p-2.5 pr-8 outline-none transition-all"
                >
                  <option value="">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-3 top-3" />
              </div>
            </div>

            {/* Date Range Inputs */}
            <div className="flex flex-1 gap-2 sm:flex-none">
              <div className="w-full">
                <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">
                  From
                </label>
                <input
                  type="date"
                  name="from"
                  max={today}
                  value={dateRange.from}
                  onChange={handleDateChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent block p-2.5 outline-none"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">
                  To
                </label>
                <input
                  type="date"
                  name="to"
                  min={dateRange.from}
                  max={today}
                  value={dateRange.to}
                  onChange={handleDateChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent block p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Export Button */}
          <div className="pt-2 border-t border-gray-100 lg:pt-0 lg:border-t-0">
            <button className="flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors active:scale-95 lg:w-auto mt-2 lg:mt-6">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* --- Orders List --- */}
      <>
        {data?.orders?.length > 0 ? (
          <>
            {/* View 1: Mobile Stack (Using OrderRow which has mobile card built-in) */}
            <div className="flex flex-col gap-4 md:hidden">
              {data.orders.map((order) => {
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
              })}
            </div>

            {/* View 2: Desktop Table */}
            <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl md:block">
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Items
                      </th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Address
                      </th>
                      <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="p-4 text-xs font-bold tracking-wider text-right text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.orders.map((order) => {
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
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-white border border-gray-300 border-dashed rounded-xl">
            <div className="flex flex-col items-center justify-center">
              <Search className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-medium text-gray-500">
                No orders matching your criteria
              </p>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {data?.pages > 1 && (
          <div className="mt-4">
            <Pagination
              setItemPages={(num) => dispatch(setPageNumber(num))}
              page={pageNumber}
              pages={data?.pages}
            />
          </div>
        )}
      </>
    </div>
  );
};

export default OrdersScreen;
