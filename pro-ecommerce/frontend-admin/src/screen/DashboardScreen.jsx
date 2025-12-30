import React from "react";
import { ShoppingCart, Users, CreditCard } from "lucide-react";
import { useGetTotalRevenueQuery } from "../slices/adminApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import RecentOrdersTable from "../components/RecentOrdersTable";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";

// --- Helper: Currency Formatter ---
const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SalesChart data={data?.dailySales} />

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

      <RecentOrdersTable orders={data?.dailyOrders} />
      {data?.pages > 1 && <Pagination />}
    </div>
  );
};

export default DashboardScreen;
