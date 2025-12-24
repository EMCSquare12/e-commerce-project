import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  Users,
  CreditCard,
  MoreHorizontal,
  Package,
} from "lucide-react";
import { useGetTotalRevenueQuery } from "../slices/adminApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";

// --- Helper: Currency Formatter ---
const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// --- Sub-Component: Stats Card ---
const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="flex items-start justify-between p-6 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

// --- Sub-Component: Sales Chart ---
const SalesChart = ({ data }) => (
  <div className="p-6 bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-xl">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-gray-800">Total Sales</h2>
      <select className="px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded-md outline-none cursor-pointer bg-gray-50">
        <option>This Month</option>
        <option>Last 7 Days</option>
      </select>
    </div>

    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />
          <XAxis
            dataKey="_id"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// --- Sub-Component: Recent Orders Table ---
const RecentOrdersTable = ({ orders }) => (
  <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
      <button className="text-sm font-medium text-blue-600 hover:underline">
        View All
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="w-10 p-4">
              <input
                type="checkbox"
                className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
              Address
            </th>
            <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Amount
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
          {orders?.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order.orderId || order._id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="p-4 font-mono text-sm font-medium text-gray-900">
                  {order.orderId}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 text-gray-500 bg-gray-100 rounded-full">
                      <Users className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {order.user?.name || "Guest"}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">{order.createdAt}</td>
                <td
                  className="p-4 text-sm text-gray-500 max-w-[150px] truncate"
                  title={order.shippingAddress?.city}
                >
                  {order.shippingAddress?.city || "N/A"}
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">
                  {order.totalPrice}
                </td>
                <td className="p-4">
                  {/* Logic based on hypothetical isDelivered, fallback to Pending */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      order.isDelivered
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {order.isDelivered ? "Shipped" : "Pending"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-8 text-center text-gray-500">
                No recent orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main Component: Dashboard Screen ---
const DashboardScreen = () => {
  const { data, isLoading, error } = useGetTotalRevenueQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
      </div>

      {/* Top Grid: Chart & Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Chart */}
        <SalesChart data={data?.dailySales} />

        {/* Right: Stats Cards */}
        <div className="flex flex-col justify-between space-y-4">
          <StatsCard
            title="Total Orders"
            value={data?.ordersCount || 0}
            icon={ShoppingCart}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(data?.totalRevenue)}
            icon={CreditCard}
            colorClass="bg-emerald-50 text-emerald-600"
          />
          <StatsCard
            title="New Customers"
            value={data?.usersCount || 0}
            icon={Users}
            colorClass="bg-purple-50 text-purple-600"
          />
        </div>
      </div>

      {/* Bottom: Table */}
      <RecentOrdersTable orders={data?.dailyOrders} />
    </div>
  );
};

export default DashboardScreen;
