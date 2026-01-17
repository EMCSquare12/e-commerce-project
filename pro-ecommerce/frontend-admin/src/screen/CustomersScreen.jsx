import React, { useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  User,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Pagination";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-gray-100 text-gray-600 border-gray-200",
    suspended: "bg-red-100 text-red-700 border-red-200",
  };

  const currentStyle = styles[status] || styles.inactive;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${currentStyle}`}
    >
      {status || "Unknown"}
    </span>
  );
};

const CustomersScreen = () => {
  const [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, error } = useGetUsersQuery({ status, pageNumber });

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

  return (
    <div className="pb-24 mx-auto space-y-6 max-w-7xl md:pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Customers
        </h1>

        {/* Status Filter */}
        <div className="relative w-full sm:w-48">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPageNumber(1);
            }}
            className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-2.5 pr-8 transition-shadow shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-3 top-3" />
        </div>
      </div>

      {/* --- Mobile Card List (Visible on small screens) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data?.users?.length > 0 ? (
          data.users.map((customer) => (
            <div
              key={customer._id}
              className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl"
            >
              {/* Header: Name & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {customer.name}
                    </h3>
                    <StatusBadge status={customer.status} />
                  </div>
                </div>
                <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Details */}
              <div className="mb-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{customer.phoneNumber || "No Phone"}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase">
                    <ShoppingBag className="w-3 h-3" /> Orders
                  </p>
                  <p className="font-semibold text-slate-900">
                    {customer.orders?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase">
                    <DollarSign className="w-3 h-3" /> Spent
                  </p>
                  <p className="font-semibold text-slate-900">
                    ${customer.totalSpent?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 bg-white border border-gray-300 border-dashed rounded-xl">
            No customers found.
          </div>
        )}
      </div>

      {/* --- Desktop Table (Hidden on mobile) --- */}
      <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Customer
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Contact Info
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Orders
                </th>
                <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Total Spent
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
                        <span className="font-semibold text-slate-900">
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
                      {customer.orders?.length || 0}
                    </td>
                    <td className="p-4 font-mono text-sm font-semibold text-slate-900">
                      ${customer.totalSpent?.toFixed(2) || "0.00"}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-gray-400 rounded-md hover:text-slate-600 hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data?.pages > 1 && (
          <div className="p-4 border-t border-gray-100">
            <Pagination
              page={pageNumber}
              pages={data.pages}
              setItemPages={setPageNumber}
            />
          </div>
        )}
      </div>

      {/* Mobile Pagination (Outside card) */}
      <div className="md:hidden">
        {data?.pages > 1 && (
          <Pagination
            page={pageNumber}
            pages={data.pages}
            setItemPages={setPageNumber}
          />
        )}
      </div>
    </div>
  );
};

export default CustomersScreen;
