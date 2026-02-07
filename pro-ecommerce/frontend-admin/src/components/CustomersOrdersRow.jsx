import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, ChevronDown, Eye, Package } from "lucide-react";

const StatusBadge = ({ isDelivered }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isDelivered
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-amber-100 text-amber-700 border-amber-200"
      }`}
    >
      {isDelivered ? "Shipped" : "Pending"}
    </span>
  );
};

const CustomersOrdersRow = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const orderId = order.orderId;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <>
      {/* --- Mobile Card View --- */}
      <div className="p-4 mb-4 bg-white border border-gray-200 shadow-sm rounded-xl md:hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-gray-900">
                orderId
              </span>
              <StatusBadge isDelivered={order.isDelivered} />
            </div>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <Link
            to={`/order/${orderId}`}
            className="p-2 text-gray-400 rounded-full hover:bg-gray-100"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total</p>
            <p className="font-medium text-gray-900">${order.totalPrice}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Items</p>
            <p className="font-medium text-gray-900">
              {order.orderItems.length} items
            </p>
          </div>
        </div>

        <button
          onClick={toggleExpanded}
          className="flex items-center justify-center w-full gap-1 py-2 text-xs font-medium text-gray-500 transition-colors border-t border-gray-100 hover:text-blue-600 hover:bg-gray-50 rounded-b-xl"
        >
          {isExpanded ? "Hide Details" : "Show Items"}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="pt-3 mt-2 border-t border-gray-100 animate-in slide-in-from-top-2">
            <div>
              <p className="flex items-center gap-1 mb-2 text-xs font-bold text-gray-400 uppercase">
                <Package className="w-3 h-3" /> Order Items
              </p>
              <ul className="space-y-2">
                {order.orderItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name}{" "}
                      <span className="text-xs text-gray-400">x{item.qty}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      ${item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* --- Desktop Table Row View --- */}
      <tr className="hidden align-top transition-colors border-b md:table-row hover:bg-gray-50 border-gray-50 last:border-0">
        <td className="p-4 text-sm font-medium text-gray-900">
          {orderId.length > 10 ? `${orderId.substring(0, 8)}...` : orderId}
        </td>
        <td className="p-4 text-sm font-medium text-gray-700 whitespace-nowrap">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>
        <td
          className="p-4 text-gray-500 cursor-pointer select-none group"
          onClick={toggleExpanded}
        >
          <div className="flex flex-row items-center gap-1 text-gray-700 transition-colors group-hover:text-blue-600">
            <span className="flex flex-row text-sm font-medium whitespace-nowrap">
              {order.orderItems.length} items
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </td>
        <td className="p-4 font-mono text-sm font-medium text-gray-900">
          ${order.totalPrice}
        </td>
        <td className="p-4">
          <StatusBadge isDelivered={order.isDelivered} />
        </td>
        <td className="relative p-4 text-right">
          <div className="flex justify-end gap-2">
            <Link
              to={`/order/${orderId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </Link>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="hidden bg-gray-50/50 md:table-row">
          <td colSpan="6" className="p-4 pt-0">
            <div className="p-4 ml-10 bg-white border border-gray-100 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-1">
              <h4 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Order Items
              </h4>
              <ul className="space-y-2">
                {order.orderItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between pb-1 text-sm text-gray-700 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        x{item.qty || item.quantity}
                      </span>
                    </div>
                    <span className="font-mono text-gray-600">
                      ${item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default CustomersOrdersRow;
