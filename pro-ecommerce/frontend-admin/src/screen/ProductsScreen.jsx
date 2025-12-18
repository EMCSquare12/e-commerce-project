import { useState } from "react";
import { Download, MoreHorizontal, ChevronDown, Search } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
  useGetProductStatusQuery,
  useDeleteProductMutation,
} from "../slices/productsApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import DeleteConfirmationModal from "../components/modal/DeleteConfirmationModal";
import UpdateProductModal from "../components/modal/UpdateProductModal";

// --- Constants ---
const STATUS_STYLES = {
  "Out of Stock": "bg-red-100 text-red-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "In Stock": "bg-green-100 text-green-700",
};

const ProductsScreen = () => {
  const [filter, setFilter] = useState({ category: "", status: "", page: 1 });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const [activeActionIndex, setActiveActionIndex] = useState(null);

  const { data, isLoading, error } = useGetProductsQuery({
    category: filter.category,
    status: filter.status,
    pageNumber: filter.page,
  });

  const { data: categories } = useGetProductCategoriesQuery();
  const { data: stockStatus } = useGetProductStatusQuery();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const toggleActionMenu = (index) => {
    setActiveActionIndex(activeActionIndex === index ? null : index);
  };

  const openDeleteModal = (product) => {
    setDeleteModal({ open: true, id: product._id, name: product.name });
    setActiveActionIndex(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(deleteModal.id).unwrap();
      toast.success("Product deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Error deleting product");
    }
  };

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteModal.open}
        itemName={deleteModal.name}
        onClose={() => setDeleteModal({ ...deleteModal, open: false })}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />

      <UpdateProductModal  />

      <div className="space-y-6">
        {/* --- Header --- */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        </div>

        {/* --- Main Card --- */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
          {/* --- Toolbar --- */}
          <div className="flex flex-col justify-between gap-4 p-4 border-b border-gray-100 lg:flex-row lg:items-center">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <FilterDropdown
                label="Category"
                options={categories?.map((c) => c._id)}
                onChange={(val) => handleFilterChange("category", val)}
              />
              <FilterDropdown
                label="Stock Status"
                options={stockStatus}
                onChange={(val) => handleFilterChange("status", val)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* --- Table Content --- */}
          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader />
              </div>
            ) : error ? (
              <div className="p-4">
                <Message variant="danger">
                  {error?.data?.message || error.error}
                </Message>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                  <tr>
                    <th className="w-10 px-6 py-4">
                      {/* <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      /> */}
                    </th>
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-gray-100">
                  {data.products?.map((product, index) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      isOpen={activeActionIndex === index}
                      onToggle={() => toggleActionMenu(index)}
                      onDelete={() => openDeleteModal(product)}
                    />
                  ))}
                  {data.products?.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* --- Pagination --- */}
        {!isLoading && !error && (
          <Pagination
            setItemPages={(num) => handleFilterChange("page", num)}
            page={filter.page}
            pages={data?.pages}
          />
        )}
      </div>
    </>
  );
};

// --- Sub-Components ---

// 1. Reusable Row Component to clean up main file
const ProductRow = ({ product, isOpen, onToggle, onDelete }) => {
  return (
    <tr className="transition-colors hover:bg-gray-50 group">
      <td className="p-4">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden bg-gray-100 border border-gray-200 rounded-md">
            <img
              src={product.image?.[0] || "/placeholder.png"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>
      </td>
      <td className="p-4 text-gray-600">{product.sku}</td>
      <td className="p-4 text-gray-600">{product.category}</td>
      <td className="p-4 font-medium text-gray-900">${product.price}</td>
      <td className="p-4 text-gray-600">{product.countInStock}</td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            STATUS_STYLES[product.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {product.status}
        </span>
      </td>

      {/* Action Column */}
      <td className="relative p-4 text-right">
        <button
          onClick={onToggle}
          className="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute right-4 top-12 z-20 w-32 bg-white border border-gray-100 rounded-lg shadow-lg">
            <ul className="py-1 text-left">
              <li>
                <button className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 text-left">
                  Update
                </button>
              </li>
              <li>
                <button
                  onClick={onDelete}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </td>
    </tr>
  );
};

// 2. Reusable Filter Component
const FilterDropdown = ({ label, options, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="relative">
      <select
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8"
      >
        <option value="">All</option>
        {options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 pointer-events-none">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  </div>
);

export default ProductsScreen;
