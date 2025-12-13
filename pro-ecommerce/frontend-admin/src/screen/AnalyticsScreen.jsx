import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Calendar, ChevronDown } from "lucide-react";

const AnalyticsScreen = () => {
  // 1. Mock Data for Sales Trend (Area Chart)
  const trendData = [
    { name: "Jan", value: 30000 },
    { name: "Feb", value: 45000 },
    { name: "Mar", value: 65000 },
    { name: "Apr", value: 50000 },
    { name: "May", value: 80000 },
    { name: "Jun", value: 65000 },
    { name: "Jul", value: 120000 },
    { name: "Aug", value: 95000 },
    { name: "Sep", value: 135000 },
    { name: "Oct", value: 120000 },
  ];

  // 2. Mock Data for Category Sales (Pie Chart)
  const pieData = [
    { name: "Sales", value: 40, color: "#3b82f6" }, // Blue
    { name: "Category", value: 30, color: "#10b981" }, // Green
    { name: "Wholesale", value: 20, color: "#0ea5e9" }, // Light Blue
    { name: "Others", value: 10, color: "#9ca3af" }, // Gray
  ];

  // 3. Mock Data for Top Products (Bar Chart)
  const barData = [
    { name: "A1", value: 180, fill: "#1d4ed8" }, // Dark Blue
    { name: "B2", value: 130, fill: "#3b82f6" }, // Blue
    { name: "B3", value: 100, fill: "#10b981" }, // Green
    { name: "B4", value: 70, fill: "#6ee7b7" }, // Light Green
    { name: "B5", value: 40, fill: "#a7f3d0" }, // Pale Green
  ];

  // 4. Mock Data for Recent Activity Table
  const activities = [
    {
      date: "07/10/2023",
      event: "Vrmt by Category",
      details: "jam.smith@email.com",
      value: "$1,450.00",
    },
    {
      date: "07/12/2023",
      event: "Sales by Category",
      details: "jom.smith@email.com",
      value: "$25.00",
    },
    {
      date: "07/12/2023",
      event: "Top Products",
      details: "jam.smith@email.com",
      value: "$50.00",
    },
  ];

  return (
    <div className="space-y-6">
      {/* --- Header & Controls --- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Analytics Overview
          </h1>
        </div>
      </div>

      {/* --- Date Filters Bar --- */}
      <div className="flex flex-col items-center justify-between p-1 rounded-lg sm:flex-row bg-gray-50">
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md">
            Last 30 Days
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-md hover:bg-gray-200">
            Last Quarter
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-md hover:bg-gray-200">
            Year to Date
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 mt-2 text-gray-600 bg-white border border-gray-200 rounded-md cursor-pointer sm:mt-0 hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Last 1 Month</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* --- Key Stats Cards --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Sales */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="font-medium text-gray-500">Total Sales</p>
          <div className="flex items-end gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-800">$124,500</h2>
            <span className="mb-1 text-sm font-semibold text-green-600">
              (+15%)
            </span>
          </div>
        </div>
        {/* Orders */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="font-medium text-gray-500">Orders</p>
          <div className="flex items-end gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-800">1,450</h2>
            <span className="mb-1 text-sm font-semibold text-green-600">
              (+10%)
            </span>
          </div>
        </div>
        {/* Avg Order Value */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <p className="font-medium text-gray-500">Average Order Value</p>
          <div className="flex items-end gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-800">$85.86</h2>
            <span className="mb-1 text-sm font-semibold text-green-600">
              (+4%)
            </span>
          </div>
        </div>
      </div>

      {/* --- Main Chart: Sales & Revenue Trend --- */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Sales & Revenue Trend
          </h2>
          <span className="text-sm text-gray-400">Last year</span>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Bottom Row Grid --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Pie Chart: Sales by Category */}
        <div className="flex flex-col p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-bold text-gray-800">
            Sales by Category (Pie Chart)
          </h3>
          <div className="relative flex items-center justify-center flex-1 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text mimic */}
            <div className="absolute inset-0 flex items-center justify-center pr-20 pointer-events-none">
              <div className="w-2 h-2 bg-transparent" />
            </div>
          </div>
        </div>

        {/* 2. Bar Chart: Top Products */}
        <div className="flex flex-col p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-bold text-gray-800">
            Top Products (Bar Chart)
          </h3>
          <div className="flex-1 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Recent Activity Table */}
        <div className="flex flex-col p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-bold text-gray-800">
            Recent Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Event</th>
                  <th className="pb-2 font-medium">Details</th>
                  <th className="pb-2 font-medium text-right">Value</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {activities.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3 text-gray-500">{item.date}</td>
                    <td className="py-3 font-medium text-gray-800">
                      {item.event}
                    </td>
                    <td
                      className="py-3 text-gray-500 truncate max-w-[100px]"
                      title={item.details}
                    >
                      {item.details}
                    </td>
                    <td className="py-3 font-medium text-right text-gray-800">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
