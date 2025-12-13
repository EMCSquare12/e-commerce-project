import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const OrdersScreen = () => {
  // 1. Mock Data (Expanded for the full list)
  const allOrders = [
    {
      id: "9000000355a06087",
      customer: "Alex Johnson",
      date: "2023-03-22",
      status: "Shipping",
      revenue: "Rs 33,665.08",
      paymentStatus: "Complete",
    },
    {
      id: "9000000355a06004",
      customer: "Maria Garcia",
      date: "2023-03-22",
      status: "Processing",
      revenue: "Rs 48,824.76",
      paymentStatus: "Complete",
    },
    {
      id: "9000000355a06093",
      customer: "James Smith",
      date: "2023-03-22",
      status: "Delivered",
      revenue: "Rs 59,281.39",
      paymentStatus: "Complete",
    },
    {
      id: "9000000355a06021",
      customer: "Linda Wilson",
      date: "2023-03-21",
      status: "Cancelled",
      revenue: "Rs 12,400.00",
      paymentStatus: "Refunded",
    },
    {
      id: "9000000355a06033",
      customer: "Robert Brown",
      date: "2023-03-21",
      status: "Shipping",
      revenue: "Rs 22,150.50",
      paymentStatus: "Pending",
    },
    {
      id: "9000000355a06045",
      customer: "Michael Davis",
      date: "2023-03-20",
      status: "Delivered",
      revenue: "Rs 8,900.00",
      paymentStatus: "Complete",
    },
  ];

  // 2. State for filters (Basic implementation)
  const [searchTerm, setSearchTerm] = useState("");

  // Helper to choose badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Refunded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500">
            Manage and track all your customer orders.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            <span>+ Create Order</span>
          </button>
        </div>
      </div>

      {/* --- Filters & Search Bar --- */}
      <div className="flex flex-col items-center justify-between gap-4 p-4 bg-white border border-gray-200 shadow-sm rounded-xl sm:flex-row">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center w-full gap-3 sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <select className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg outline-none bg-gray-50">
            <option>Status: All</option>
            <option>Complete</option>
            <option>Pending</option>
            <option>Refunded</option>
          </select>
        </div>
      </div>

      {/* --- Orders Table --- */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="w-10 px-6 py-4 font-medium">
                  <input type="checkbox" className="border-gray-300 rounded" />
                </th>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Shipping Status</th>
                <th className="px-6 py-4 font-medium">Revenue</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-gray-50 group"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-gray-800">{order.status}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {order.revenue}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="flex justify-end gap-2 px-6 py-4 text-right transition-opacity opacity-0 group-hover:opacity-100">
                    <button
                      className="p-2 text-gray-400 rounded-lg hover:text-blue-600 hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing 1 to 6 of 50 entries</p>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersScreen;
