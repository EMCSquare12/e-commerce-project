import React, { useState } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  User,
} from "lucide-react";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import Loader from "../components/Loader"; // Assuming you have these
import Message from "../components/Message"; // Assuming you have these

// --- 1. Helper: Status Badge Component ---
const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-gray-100 text-gray-600 border-gray-200",
    suspended: "bg-red-100 text-red-700 border-red-200",
  };

  const currentStyle = styles[status] || styles.inactive;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${currentStyle}`}
    >
      {status}
    </span>
  );
};

// --- 2. Main Component ---
const CustomersScreen = () => {
  const [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, error } = useGetUsersQuery({ status, pageNumber });

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      setPageNumber(newPage);
    }
  };

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers
        </h1>
      </div>

      {/* Main Card */}
      <div className="pb-4 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 p-4 bg-white border-b border-gray-100 lg:flex-row lg:items-center">
          <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPageNumber(1); // Reset to page 1 on filter change
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 outline-none transition-all"
                >
                  <option value="">All Users</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>

            {/* Search (Optional Placeholder) */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-6">
            <Message variant="danger">
              {error?.data?.message || error.error || "Error loading users"}
            </Message>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Contact Info
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Orders
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Total Spent
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.users?.length > 0 ? (
                    data.users.map((customer) => (
                      <tr
                        key={customer._id}
                        className="transition-colors hover:bg-gray-50 group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700">
                              {customer.email}
                            </span>
                            <span className="text-xs text-gray-400">
                              {customer.phoneNumber || "No Phone"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-700">
                          {customer.totalOrder?.length || 0}
                        </td>
                        <td className="p-4 font-mono text-sm text-gray-900">
                          ${customer.totalSpent?.toFixed(2) || "0.00"}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={customer.status} />
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-1.5 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex items-center justify-end gap-2 p-4 bg-white border-t border-gray-100">
                <button
                  onClick={() => handlePageChange(pageNumber - 1)}
                  disabled={pageNumber === 1}
                  className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-medium text-gray-700">
                  Page{" "}
                  <span className="font-bold text-slate-900">{pageNumber}</span>{" "}
                  of {data?.pages}
                </span>

                <button
                  onClick={() => handlePageChange(pageNumber + 1)}
                  disabled={pageNumber === data?.pages}
                  className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            {/* Pagination Footer */}
            {data?.pages > 1 && (
              <div className="bg-white border-t border-gray-100">
                <Pagination
                  setItemPages={(num) =>
                    setFilter((prev) => ({ ...prev, page: num }))
                  }
                  page={filter.page}
                  pages={data?.pages}
                  s
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersScreen;
