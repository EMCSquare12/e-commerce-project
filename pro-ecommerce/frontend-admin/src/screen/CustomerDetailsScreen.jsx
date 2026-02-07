import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  CreditCard,
  User,
} from "lucide-react";
import { useGetUserDetailsQuery } from "../slices/usersApiSlice";
import { useGetOrdersQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Pagination";
import OrderRow from "../components/OrderRow";
import CustomersOrdersRow from "../components/CustomersOrdersRow";

const CustomerDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch User Details
  const {
    data: user,
    isLoading: loadingUser,
    error: errorUser,
  } = useGetUserDetailsQuery(id);

  // Fetch User Orders
  const {
    data: ordersData,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetOrdersQuery({ userId: id, pageNumber });

  const toggleRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loadingUser) return <Loader />;
  if (errorUser)
    return (
      <Message variant="danger">
        {errorUser?.data?.message || "User not found"}
      </Message>
    );

  return (
    <div className="max-w-6xl pb-20 mx-auto space-y-6 md:pb-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/customers")}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </button>

      {/* Customer Profile Card */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar Placeholder */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-400">
            <User className="w-10 h-10" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  user.status === "active" || !user.status
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {user.status || "Active"}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {user.phoneNumber || "No phone number"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <p className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase">
              <ShoppingBag className="w-3 h-3" /> Total Orders
            </p>
            <p className="text-xl font-bold text-slate-800">
              {ordersData?.orders?.length || 0}
            </p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <p className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase">
              <CreditCard className="w-3 h-3" /> Total Spent
            </p>
            <p className="text-xl font-bold text-slate-800">
              ${user.totalSpent?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Transaction History
        </h2>

        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">
            {errorOrders?.data?.message || "Error loading orders"}
          </Message>
        ) : ordersData?.orders?.length === 0 ? (
          <div className="p-8 text-center bg-white border border-gray-200 border-dashed rounded-xl">
            <p className="text-gray-500">No orders found for this customer.</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Order ID
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
                      Status
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ordersData.orders.map((order) => {
                    const orderId = order.orderId || order._id;
                    return <CustomersOrdersRow key={orderId} order={order} />;
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {ordersData.pages > 1 && (
              <div className="p-4 border-t border-gray-100">
                <Pagination
                  page={pageNumber}
                  pages={ordersData.pages}
                  setItemPages={setPageNumber}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsScreen;
