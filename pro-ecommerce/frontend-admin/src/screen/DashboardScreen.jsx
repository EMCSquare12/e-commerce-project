import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Users, CreditCard, MoreHorizontal } from "lucide-react";

const DashboardScreen = () => {
  // 1. Mock Data for the Chart (Simulating the "Total Sales" wave)
  const salesData = [
    { name: "Jan 4", value: 20000 },
    { name: "May 8", value: 80000 },
    { name: "May 10", value: 75000 },
    { name: "May 12", value: 100000 },
    { name: "Jan 14", value: 60000 },
    { name: "Sep 16", value: 135000 },
    { name: "Dec 20", value: 85000 },
    { name: "Dec 31", value: 180000 },
  ];

  // 2. Mock Data for Recent Orders
  const recentOrders = [
    {
      id: "9000000355a06087",
      date: "2023-03-22",
      status: "Shipping",
      revenue: "Rs 33,665.08",
      state: "Complete",
    },
    {
      id: "9000000355a06004",
      date: "2023-03-22",
      status: "Shipping",
      revenue: "Rs 48,824.76",
      state: "Complete",
    },
    {
      id: "9000000355a06093",
      date: "2023-03-22",
      status: "Shipping",
      revenue: "Rs 59,281.39",
      state: "Complete",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      {/* --- Top Section: Chart + Stats Grid --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Sales Chart (Takes up 2 columns space) */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              Total Sales this Month
            </h2>
            <select className="px-3 py-1 text-sm border border-gray-200 rounded-md outline-none bg-gray-50">
              <option>All Month</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
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
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
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
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Stats Cards (Stacked vertically) */}
        <div className="space-y-4">
          {/* Card 1: Today's Orders */}
          <div className="flex items-start justify-between p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today's Orders
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-800">13</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Card 2: Revenue */}
          <div className="flex items-start justify-between p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-800">
                $1,366.52
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Card 3: New Customers */}
          <div className="flex items-start justify-between p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-500">New Customers</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-800">22</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Recent Orders Table --- */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-4 font-medium">Order Name</th>
                <th className="px-6 py-4 font-medium">Order Date</th>
                <th className="px-6 py-4 font-medium">Notification</th>
                <th className="px-6 py-4 font-medium">Revenue</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-gray-800">{order.status}</td>
                  <td className="px-6 py-4 text-gray-800">{order.revenue}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      {order.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
