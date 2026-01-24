import { MoreHorizontal, Package, Edit, Trash2 } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    "Out of Stock": "bg-red-100 text-red-700 border-red-200",
    "Low Stock": "bg-amber-100 text-amber-700 border-amber-200",
    "In Stock": "bg-green-100 text-green-700 border-green-200",
  };

  const currentStyle =
    styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${currentStyle}`}
    >
      {status}
    </span>
  );
};

const ProductRow = ({ product, isOpen, onToggle, onDelete, onUpdate }) => {
  return (
    <>
      {/* --- Mobile Card View --- */}
      <div className="p-4 mb-4 bg-white border border-gray-200 shadow-sm rounded-xl md:hidden">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 border border-gray-200 rounded-lg">
            {product.image?.[0] ? (
              <img
                src={product.image[0]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="mb-1 font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h4>
                <p className="mb-2 text-xs text-gray-500">
                  SKU: {product.sku || "N/A"} • {product.category}
                </p>
              </div>
              <StatusBadge status={product.status} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-gray-900">${product.price}</span>
              <span className="text-xs text-gray-500">
                {product.countInStock} units in stock
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <button
            onClick={onUpdate}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95"
          >
            <Edit className="w-4 h-4 text-blue-600" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-all bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-200 active:scale-95"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* --- Desktop Table Row View --- */}
      <tr className="hidden transition-colors border-b md:table-row hover:bg-gray-50 border-gray-50 last:border-0 group">
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
        <td className="p-4 font-mono text-sm text-gray-700">
          ${product.price}
        </td>
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
            <>
              <div className="fixed inset-0 z-10" onClick={onToggle} />
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
            </>
          )}
        </td>
      </tr>
    </>
  );
};

export default ProductRow;
