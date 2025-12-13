import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const CustomersScreen = () => {
  // 1. Mock Data matching your "Customers" image
  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 555-0101",
      orders: 12,
      totalSpent: "$1,450.00",
      group: "Retail",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 555-0102",
      orders: 5,
      totalSpent: "$625.50",
      group: "Wholesale",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@email.com",
      phone: "+1 555-0103",
      orders: 0,
      totalSpent: "$0.00",
      group: "Retail",
      status: "Inactive",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    },
    {
      id: 4,
      name: "John Doe",
      email: "john.smith@email.com",
      phone: "+1 555-0104",
      orders: 2,
      totalSpent: "$1,450.00",
      group: "Retail",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
    {
      id: 5,
      name: "Jamy Smith",
      email: "jam.smith@email.com",
      phone: "+1 555-0105",
      orders: 1,
      totalSpent: "$625.50",
      group: "Wholesale",
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    },
    {
      id: 6,
      name: "John Doe",
      email: "jorh.doe@email.com",
      phone: "+1 555-0106",
      orders: 3,
      totalSpent: "$150.00",
      group: "Retail",
      status: "Inactive",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    {
      id: 7,
      name: "Bob Johnson",
      email: "johnson@email.com",
      phone: "+1 555-0107",
      orders: 1,
      totalSpent: "$125.50",
      group: "Retail",
      status: "Inactive",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
  ];

  // Helper for status badge styling
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700"; // Grey for inactive
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Page Title --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
      </div>

      {/* --- Main Content Card --- */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Toolbar Section (Filters & Search) --- */}
        <div className="flex flex-col justify-between gap-4 p-4 border-b border-gray-100 lg:flex-row lg:items-center">
          {/* Left Side: Filter Dropdowns */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Group Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Group</span>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8">
                  <option>All, Retail, Wholesale, VIP</option>
                  <option>Retail</option>
                  <option>Wholesale</option>
                  <option>VIP</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8">
                  <option>All, Active, Inactive</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>
          </div>

          {/* Right Side: Search */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search Customer Name, Email"
            />
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="w-10 px-6 py-4">Select</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        className="object-cover border border-gray-200 rounded-full h-9 w-9"
                        src={customer.avatar}
                        alt={customer.name}
                      />
                      <span className="font-medium text-gray-900">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-500">{customer.phone}</td>
                  <td className="px-6 py-4 text-gray-700">{customer.orders}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {customer.totalSpent}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{customer.group}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
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

export default CustomersScreen;
