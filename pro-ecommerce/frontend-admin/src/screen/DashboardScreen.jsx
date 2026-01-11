import React, { useState } from "react";
import { ShoppingCart, Users, CreditCard, ImageOff } from "lucide-react";
import { useGetDashboardQuery } from "../slices/adminApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import OrderRow from "../components/OrderRow";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

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
const DashboardScreen = () => {
  const { copiedId, copyToClipboard } = useClipboard();
  const [pageNumber, setPageNumber] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { data, isLoading, error } = useGetDashboardQuery({
    pageNumber,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || error.error || "Something went wrong"}
      </Message>
    );
  }
  const { orders = {}, stats = {}, monthlySales = [] } = data || {};
  const { data: orderList = [], pages = 1, page = 1 } = orders;
  const { ordersCountToday = 0, totalRevenue = 0, usersCountToday = 0 } = stats;

  console.log(orderList);

  const toggleRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart data={monthlySales} />
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <StatsCard
            title="Total Orders"
            value={ordersCountToday}
            icon={ShoppingCart}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={CreditCard}
            colorClass="bg-emerald-50 text-emerald-600"
          />
          <StatsCard
            title="New Customers"
            value={usersCountToday}
            icon={Users}
            colorClass="bg-purple-50 text-purple-600"
          />
        </div>
      </div>

      <>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
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
              {orderList?.length > 0 ? (
                orderList.map((order) => {
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

      {pages > 1 && (
        <Pagination
          setItemPages={(num) => setPageNumber(num)}
          page={page}
          pages={pages}
        />
      )}
    </div>
  );
};

export default DashboardScreen;
