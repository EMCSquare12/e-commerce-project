import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { useGetDashboardQuery } from "../slices/adminApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const SalesChart = () => {
  const { data, isLoading, error } = useGetDashboardQuery({});
  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white border border-gray-200 h-72 rounded-xl">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      </div>
    );
  }

  const salesData = data?.charts?.dailySales || [];

  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm md:p-6 lg:col-span-2 rounded-xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <TrendingUp className="w-5 h-5 text-amber-500" /> Total Sales
          </h2>
          <p className="text-xs text-gray-500">Daily revenue performance</p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <Calendar className="absolute w-4 h-4 text-gray-400 pointer-events-none top-2 left-2.5" />
          <select className="py-1.5 pl-8 pr-3 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-amber-500 focus:border-transparent">
            <option value="7days">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              dataKey="_id"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              dy={10}
              tickFormatter={(str) => {
                const date = new Date(str);
                if (isNaN(date.getTime())) return str;
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(value) =>
                value >= 1000 ? `$${value / 1000}k` : `$${value}`
              }
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                "Revenue",
              ]}
              labelStyle={{
                color: "#64748b",
                marginBottom: "0.25rem",
                fontSize: "0.85rem",
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                if (isNaN(date.getTime())) return label;
                return date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#d97706"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorSales)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#d97706" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
