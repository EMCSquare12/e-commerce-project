import React from "react";
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
import {
  Calendar,
  ChevronDown,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
} from "lucide-react";

const AnalyticsScreen = () => {
  // Mock Data for Sales Trend (Area Chart)
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

  const pieData = [
    { name: "Electronics", value: 40, color: "#f59e0b" }, // Amber-500
    { name: "Fashion", value: 30, color: "#3b82f6" }, // Blue-500
    { name: "Home", value: 20, color: "#10b981" }, // Emerald-500
    { name: "Others", value: 10, color: "#94a3b8" }, // Slate-400
  ];

  const barData = [
    { name: "iPhone 15", value: 180, fill: "#0f172a" }, // Slate-900
    { name: "AirPods", value: 130, fill: "#334155" }, // Slate-700
    { name: "MacBook", value: 100, fill: "#475569" }, // Slate-600
    { name: "Galaxy S24", value: 70, fill: "#64748b" }, // Slate-500
    { name: "PS5", value: 40, fill: "#94a3b8" }, // Slate-400
  ];

  const activities = [
    {
      date: "07/10/2023",
      event: "New Order #1023",
      details: "jam.smith@email.com",
      value: "$1,450.00",
    },
    {
      date: "07/12/2023",
      event: "Refund Processed",
      details: "jom.smith@email.com",
      value: "-$25.00",
    },
    {
      date: "07/12/2023",
      event: "New Order #1024",
      details: "jane.doe@email.com",
      value: "$50.00",
    },
  ];

  return (
    <div className="pb-24 space-y-6 md:pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Analytics Overview
          </h1>
          <p className="text-sm text-gray-500">
            Track your store's performance
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-1 bg-white border border-gray-100 shadow-sm rounded-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex p-1 space-x-1 overflow-x-auto scrollbar-hide">
          <button className="px-4 py-2 text-sm font-bold rounded-lg text-amber-700 bg-amber-50 whitespace-nowrap">
            Last 30 Days
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-lg hover:bg-gray-100 whitespace-nowrap">
            Last Quarter
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-lg hover:bg-gray-100 whitespace-nowrap">
            Year to Date
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 mx-1 text-gray-600 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 sm:mx-0 hover:bg-gray-100">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Custom Range</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Total Revenue
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                $124,500
              </h2>
            </div>
            <div className="p-2 rounded-lg bg-amber-50">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +15%
            </span>
            <span className="ml-2 text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Total Orders
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">1,450</h2>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +10%
            </span>
            <span className="ml-2 text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Avg. Order Value
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">$85.86</h2>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +4%
            </span>
            <span className="ml-2 text-gray-400">vs last month</span>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Revenue Trend</h2>
          <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded">
            Year 2023
          </span>
        </div>
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#d97706"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-bold tracking-wide uppercase text-slate-800">
            Sales by Category
          </h3>
          <div className="relative flex items-center justify-center flex-1 h-56">
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
                <Tooltip />
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
            <div className="absolute inset-0 flex items-center justify-center pr-24 pointer-events-none">
              <span className="text-xs font-bold text-gray-400">DIST</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-bold tracking-wide uppercase text-slate-800">
            Top Products
          </h3>
          <div className="flex-1 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f3f4f6"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col p-5 bg-white border border-gray-200 shadow-sm rounded-xl lg:col-span-1">
          <h3 className="mb-4 text-sm font-bold tracking-wide uppercase text-slate-800">
            Recent Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="pb-2 pl-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Event</th>
                  <th className="pb-2 pr-2 font-semibold text-right">Value</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {activities.map((item, index) => (
                  <tr
                    key={index}
                    className="transition-colors border-b border-gray-50 last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-3 pl-2 text-gray-500 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3">
                      <p className="font-bold text-slate-700">{item.event}</p>
                      <p className="text-gray-400 truncate max-w-[120px]">
                        {item.details}
                      </p>
                    </td>
                    <td
                      className={`py-3 pr-2 font-bold text-right whitespace-nowrap ${item.value.includes("-") ? "text-red-500" : "text-emerald-600"}`}
                    >
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
