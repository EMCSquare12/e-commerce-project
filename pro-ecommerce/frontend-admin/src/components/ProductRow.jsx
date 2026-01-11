import { MoreHorizontal, Package, Edit, Trash2 } from "lucide-react";
const ProductRow = ({ product, isOpen, onToggle, onDelete, onUpdate }) => {
  const StatusBadge = ({ status }) => {
    const styles = {
      "Out of Stock": "bg-red-100 text-red-700 border-red-200",
      "Low Stock": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "In Stock": "bg-green-100 text-green-700 border-green-200",
    };

    const currentStyle =
      styles[status] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${currentStyle}`}
      >
        {status}
      </span>
    );
  };
  return (
    <tr className="transition-colors border-b hover:bg-gray-50 border-gray-50 last:border-0 group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden bg-gray-100 border border-gray-200 rounded-lg">
            {product.image?.[0] ? (
              <img
                src={product.image[0]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <Package className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-700 line-clamp-1">
            {product.name}
          </span>
        </div>
      </td>
      <td className="p-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        {product.sku || "N/A"}
      </td>
      <td className="p-4 text-sm font-medium text-gray-700">
        {product.category}
      </td>
      <td className="p-4 font-mono text-sm text-gray-700">${product.price}</td>
      <td className="p-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        {product.countInStock} units
      </td>
      <td className="p-4">
        <StatusBadge status={product.status} />
      </td>

      <td className="relative p-4 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`p-1.5 rounded-md transition-colors ${
            isOpen
              ? "bg-gray-100 text-gray-900"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute z-20 overflow-hidden origin-top-right bg-white border border-gray-100 rounded-lg shadow-xl w-36 right-4 top-12 animate-in fade-in zoom-in-95">
            <div className="py-1">
              <button
                onClick={onUpdate}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};
export default ProductRow;
