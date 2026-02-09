import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { ShoppingCart, Users, CreditCard, Clock } from "lucide-react";
import { useGetDashboardQuery } from "../slices/adminApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import OrderRow from "../components/OrderRow";
import { BASE_URL } from "../constants";
import { setPageNumber } from "../slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import {useClipboard} from "../hooks/useClipboard";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};


const DashboardScreen = () => {
  const { copiedId, copyToClipboard } = useClipboard();
  const { keyword, pageNumber } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { data, isLoading, error, refetch } = useGetDashboardQuery({
    pageNumber,
    keyword,
  });

  useEffect(() => {
    const socket = io(`${BASE_URL}`);

    socket.on("newOrderPlaced", () => {
      refetch();
    });

    return () => socket.disconnect();
  }, [refetch]);

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

  const { orders = {}, stats = {}, monthlySales = [] } = data || {};
  const { data: orderList = [], pages = 1, page = 1 } = orders;
  const { ordersCountToday = 0, totalRevenue = 0, usersCountToday = 0 } = stats;

  const toggleRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="pb-24 mx-auto space-y-6 max-w-7xl md:pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Dashboard Overview
        </h1>
        <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full md:hidden">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Sales Chart (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <SalesChart data={monthlySales} />
        </div>

        {/* Stats Cards (Stacked column) */}
        <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:flex lg:flex-col lg:justify-between">
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

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
        </div>

        {orderList?.length === 0 ? (
          <div className="p-8 text-center bg-white border border-gray-200 border-dashed rounded-xl">
            <p className="text-gray-500">No recent orders found.</p>
          </div>
        ) : (
          <>
            {/* View 1: Mobile List (Stack of Cards) */}
            <div className="flex flex-col gap-4 md:hidden">
              {orderList.map((order) => {
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
              <div className="overflow-x-auto">
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
                    {orderList.map((order) => {
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
        )}

        {/* Pagination Footer */}
        {pages > 1 && (
          <div className="mt-6">
            <Pagination
              setItemPages={(num) => dispatch(setPageNumber(num))}
              page={page}
              pages={pages}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
