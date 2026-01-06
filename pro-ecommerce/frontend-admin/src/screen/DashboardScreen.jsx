import React, { useState } from "react";
import { ShoppingCart, Users, CreditCard } from "lucide-react";
import { useGetDashboardQuery } from "../slices/adminApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import RecentOrdersTable from "../components/RecentOrdersTable";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const DashboardScreen = () => {
  const [pageNumber, setPageNumber] = useState(1);

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

  console.log(data)

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

      <RecentOrdersTable orders={orderList} />

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
