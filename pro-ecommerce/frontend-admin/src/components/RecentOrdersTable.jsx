import { Users, MoreHorizontal, Loader2, AlertCircle } from "lucide-react";

const RecentOrdersTable = ({ orders, isLoading, error }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white border border-gray-200 rounded-xl">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 border border-red-200 bg-red-50 rounded-xl">
        <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
        <span className="text-red-800">Failed to load recent orders.</span>
      </div>
    );
  }

  return (
    <div className="pb-4 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        <button className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="w-10 p-4">
                <input
                  type="checkbox"
                  className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Order ID
              </th>
              <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Customer
              </th>
              <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Date
              </th>
              <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Address
              </th>
              <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Amount
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.orderId || order._id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4 font-mono text-sm font-medium text-gray-900">
                    #{order.orderId ? order.orderId.slice(-6) : "Unknown"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 text-gray-500 bg-gray-100 rounded-full">
                        <Users className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {order.user?.name || "Guest"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td
                    className="p-4 text-sm text-gray-500 max-w-[150px] truncate"
                    title={order.shippingAddress?.city}
                  >
                    {order.shippingAddress?.city || "N/A"}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
