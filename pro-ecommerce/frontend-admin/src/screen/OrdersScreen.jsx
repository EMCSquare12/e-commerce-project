import { useState } from "react";
import {
  Search,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const OrdersScreen = () => {
  // 1. Mock Data matching your "Orders" image
  const orders = [
    {
      id: "#90001",
      customer: "John Doe",
      date: "2023-03-23",
      total: "$120.50",
      status: "Pending",
    },
    {
      id: "#90002",
      customer: "Jane Smith",
      date: "2023-03-22",
      total: "$450.00",
      status: "Shipped",
    },
    {
      id: "#90003",
      customer: "Bob Johnson",
      date: "2023-03-21",
      total: "$89.99",
      status: "Delivered",
    },
    {
      id: "#90004",
      customer: "John Doe",
      date: "2023-03-20",
      total: "$120.50",
      status: "Pending",
    },
    {
      id: "#90005",
      customer: "Jane Smith",
      date: "2023-03-20",
      total: "$450.00",
      status: "Shipped",
    },
    {
      id: "#90006",
      customer: "Jane Smith",
      date: "2023-03-19",
      total: "$150.00",
      status: "Delivered",
    },
    {
      id: "#90007",
      customer: "Bob Johnson",
      date: "2023-03-18",
      total: "$120.50",
      status: "Delivered",
    },
  ];

  // Helper function for status badge styling
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Page Title --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      </div>

      {/* --- Main Content Card --- */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Toolbar Section (Filters & Search) --- */}
        <div className="flex flex-col justify-between gap-4 p-4 border-b border-gray-100 lg:flex-row lg:items-center">
          {/* Left Side: Filter Dropdowns */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8">
                  <option>All, Pending, Shipped, Delivered...</option>
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8">
                  <option>Date Range</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Month</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>
          </div>

          {/* Right Side: Search & Export */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Order ID, Customer Name"
              />
            </div>

            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="w-10 px-6 py-4">Select</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr key={index} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Order {order.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.total}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer --- */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-200 rounded-md bg-blue-50">
            1
          </button>

          <button className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersScreen;
