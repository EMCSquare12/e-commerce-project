import React, { useState } from "react";
import axios from "axios";

import {
  Download,
  MoreHorizontal,
  ChevronDown,
  Plus,
  Package,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
  useGetProductStatusQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
} from "../slices/productsApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import DeleteConfirmationModal from "../components/modal/DeleteConfirmationModal";
import UpdateProductModal from "../components/modal/UpdateProductModal";
import CreateProductModal from "../components/modal/CreateProductModal";

// --- 1. Helper: Status Badge ---
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

// --- 2. Sub-Component: Product Row ---
const ProductRow = ({ product, isOpen, onToggle, onDelete, onUpdate }) => {
  return (
    <tr className="transition-colors border-b hover:bg-gray-50 border-gray-50 last:border-0 group">
      <td className="p-4">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
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

      {/* Action Column */}
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

// --- 3. Main Component ---
const ProductsScreen = () => {
  // --- State ---
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const [filter, setFilter] = useState({ category: "", status: "", page: 1 });

  // Modal States
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [updateModal, setUpdateModal] = useState({
    open: false,
    product: null,
  });
  const [createNewProductModal, setCreatNewProductModal] = useState({
    open: false,
    product: null,
  });

  const [activeActionIndex, setActiveActionIndex] = useState(null);

  // --- API Hooks ---
  const { data, isLoading, error } = useGetProductsQuery({
    category: filter.category,
    status: filter.status,
    pageNumber: filter.page,
  });

  //API Query
  const { data: categories } = useGetProductCategoriesQuery();
  const { data: stockStatus } = useGetProductStatusQuery();

  //API Mutation
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [newProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const globalLoading =
    isLoadingGlobal || isCreating || isUpdating || isDeleting;
  // --- Handlers ---
  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
    setActiveActionIndex(null);
  };

  const toggleActionMenu = (index) => {
    setActiveActionIndex(activeActionIndex === index ? null : index);
  };

  // Modal Handlers
  const handleConfirmDelete = async () => {
    setIsLoadingGlobal(true);
    try {
      await deleteProduct(deleteModal.id).unwrap();
      toast.success("Product deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Error deleting product");
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  const handleConfirmUpdate = async (productId, formData) => {
    setIsLoadingGlobal(true);
    try {
      let updatedData = { ...formData };

      if (formData.imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", formData.imageFile);

        const uploadRes = await axios.post("/api/upload", uploadFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        updatedData.image = [uploadRes.data.image];

        delete updatedData.imageFile;
      }

      await updateProduct({ productId, formData: updatedData }).unwrap();

      toast.success("Product Updated Successfully!");
      setUpdateModal({ open: false, product: null });
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.message || "Update failed");
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  const handleCreateNewProduct = async (productData) => {
    setIsLoadingGlobal(true);
    try {
      let finalProductData = { ...productData };
      let uploadedImageUrls = [];

      if (productData.imageFiles && productData.imageFiles.length > 0) {
        const uploadPromises = productData.imageFiles.map((file) => {
          const uploadFormData = new FormData();
          uploadFormData.append("image", file);

          return axios.post("/api/upload", uploadFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        });

        const responses = await Promise.all(uploadPromises);

        uploadedImageUrls = responses.map((res) => res.data.image);

        delete finalProductData.imageFiles;
      }

      finalProductData.images = uploadedImageUrls;

      await newProduct(finalProductData).unwrap();

      toast.success("New Product Added!");
      setCreatNewProductModal({ open: false, product: null });
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error adding new item");
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      {/* --- Modals --- */}
      <DeleteConfirmationModal
        isOpen={deleteModal.open}
        itemName={deleteModal.name}
        onClose={() => setDeleteModal({ ...deleteModal, open: false })}
        isLoading={globalLoading}
        onConfirm={handleConfirmDelete}
      />

      <UpdateProductModal
        isOpen={updateModal.open}
        product={updateModal.product}
        onClose={() => setUpdateModal({ ...updateModal, open: false })}
        isLoading={globalLoading}
        onUpdate={handleConfirmUpdate}
      />

      <CreateProductModal
        isOpen={createNewProductModal.open}
        onClose={() =>
          setCreatNewProductModal({ ...createNewProductModal, open: false })
        }
        isLoading={globalLoading}
        onCreate={handleCreateNewProduct}
      />

      {/* --- Header --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Products
        </h1>
      </div>

      {/* --- Main Card --- */}
      <div className="pb-4 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Toolbar --- */}
        <div className="flex flex-col justify-between gap-4 p-4 bg-white border-b border-gray-100 lg:flex-row lg:items-center">
          {/* Filters */}
          <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Category
              </span>
              <div className="relative">
                <select
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c._id}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Stock</span>
              <div className="relative">
                <select
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {stockStatus?.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-2 top-3" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                setCreatNewProductModal({
                  ...createNewProductModal,
                  open: true,
                })
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* --- Table Content --- */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || "Error loading products"}
          </Message>
        ) : (
          <>
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="w-10 p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      SKU
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Stock
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
                  {data.products?.map((product, index) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      isOpen={activeActionIndex === index}
                      onToggle={() => toggleActionMenu(index)}
                      onDelete={() => {
                        setDeleteModal({
                          open: true,
                          id: product._id,
                          name: product.name,
                        });
                        setActiveActionIndex(null);
                      }}
                      onUpdate={() => {
                        setUpdateModal({ open: true, product: product });
                        console.log(product);
                        setActiveActionIndex(null);
                      }}
                    />
                  ))}
                  {data.products?.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-gray-500">
                        No products found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- Pagination --- */}
            {data?.pages > 1 && (
              <div className="bg-white border-t border-gray-100">
                <Pagination
                  setItemPages={(num) =>
                    setFilter((prev) => ({ ...prev, page: num }))
                  }
                  page={filter.page}
                  pages={data?.pages}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsScreen;
