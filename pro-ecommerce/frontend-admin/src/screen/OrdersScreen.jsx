import React, { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
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
  // State
  const dispatch = useDispatch();
  const { dateRange, pageNumber, status } = useSelector((state) => state.order);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Hooks
  const { copiedId, copyToClipboard } = useClipboard();
  const { data, isLoading, error } = useGetOrdersQuery({
    from: dateRange.from,
    to: dateRange.to,
    status,
    pageNumber,
  });
  console.log(pageNumber);

  const today = new Date().toISOString().split("T")[0];

  // Handlers
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    dispatch(setDateRange({ name, value }));
    dispatch(setPageNumber(1));
    console.log(dateRange);
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
                    dispatch(setStatus(e.target.value));
                    dispatch(setPageNumber(1));
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
                  setItemPages={(num) => dispatch(setPageNumber(num))}
                  page={pageNumber}
                  pages={data?.pages}
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
