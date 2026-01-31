import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import {
  Download,
  ChevronDown,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
  useGetProductStatusQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
} from "../slices/productsApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import DeleteConfirmationModal from "../components/modal/DeleteConfirmationModal";
import UpdateProductModal from "../components/modal/UpdateProductModal";
import CreateProductModal from "../components/modal/CreateProductModal";
import ProductRow from "../components/ProductRow";
import { useDispatch, useSelector } from "react-redux";
import {
  filterChange,
  setDeleteModal,
  setLoadingGlobal,
  setUpdateModal,
  setCreateNewProductModal,
} from "../slices/productSlice";
import { BASE_URL } from "../constants";

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const { filter, createNewProductModal } = useSelector(
    (state) => state.product,
  );
  const { userInfo } = useSelector((state) => state.auth);

  // Separate state for mobile menu toggles
  const [activeActionIndex, setActiveActionIndex] = useState(null);

  // --- API Hooks ---
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    category: filter.category,
    status: filter.status,
    pageNumber: filter.page,
  });

  const { data: categories } = useGetProductCategoriesQuery();
  const { data: stockStatus } = useGetProductStatusQuery();

  const [updateProduct] = useUpdateProductMutation();
  const [newProduct] = useCreateProductMutation();

  useEffect(() => {
    const socket = io(`${BASE_URL}`);

    socket.on("stockUpdated", () => {
      refetch();
    });

    return () => socket.disconnect();
  }, [refetch]);
  // --- Handlers ---
  const handleFilterChange = (key, value) => {
    dispatch(filterChange({ key, value }));
    setActiveActionIndex(null);
  };

  const toggleActionMenu = (index, e) => {
    e.stopPropagation();
    setActiveActionIndex(activeActionIndex === index ? null : index);
  };

  // Close menu when clicking outside (handled by backdrop in render)
  const closeMenu = () => setActiveActionIndex(null);

  const handleConfirmUpdate = async (productId, formData) => {
    dispatch(setLoadingGlobal(true));
    try {
      let updatedData = { ...formData };

      if (formData.imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", formData.imageFile);

        const uploadRes = await axios.post(
          `${BASE_URL}/api/upload`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );

        updatedData.image = [uploadRes.data.image];
        delete updatedData.imageFile;
      }

      await updateProduct({ productId, formData: updatedData }).unwrap();
      toast.success("Product Updated Successfully!");
      dispatch(setUpdateModal({ open: false, product: null }));
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.message || "Update failed");
    } finally {
      dispatch(setLoadingGlobal(false));
    }
  };

  const handleCreateNewProduct = async (productData) => {
    dispatch(setLoadingGlobal(true));
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
      dispatch(
        setCreateNewProductModal({ ...createNewProductModal, open: false }),
      );
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error adding new item");
    } finally {
      dispatch(setLoadingGlobal(false));
    }
  };

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

  const StatusBadge = ({ status }) => {
    const styles = {
      "Out of Stock": "bg-red-100 text-red-700 border-red-200",
      "Low Stock": "bg-amber-100 text-amber-700 border-amber-200",
      "In Stock": "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    const currentStyle =
      styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${currentStyle}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="pb-24 mx-auto space-y-6 max-w-7xl md:pb-8">
      <DeleteConfirmationModal />
      <UpdateProductModal onUpdate={handleConfirmUpdate} />
      <CreateProductModal onCreate={handleCreateNewProduct} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Products
        </h1>
        {/* Mobile: Add Button at top */}
        <button
          onClick={() =>
            dispatch(
              setCreateNewProductModal({
                ...createNewProductModal,
                open: true,
              }),
            )
          }
          className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-bold text-white transition-all shadow-md bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-95 md:hidden"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* --- Filter Bar --- */}
      <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">
                Category
              </label>
              <div className="relative">
                <select
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent block p-2.5 pr-8 outline-none cursor-pointer transition-all"
                >
                  <option value="">All Categories</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c._id}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-3 top-3" />
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex-1">
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <div className="relative">
                <select
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent block p-2.5 pr-8 outline-none cursor-pointer transition-all"
                >
                  <option value="">All Statuses</option>
                  {stockStatus?.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-3 top-3" />
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden gap-3 pt-4 border-t border-gray-100 md:flex lg:pt-0 lg:border-t-0">
            <button
              onClick={() =>
                dispatch(
                  setCreateNewProductModal({
                    ...createNewProductModal,
                    open: true,
                  }),
                )
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      {data.products?.length > 0 ? (
        <>
          {/* --- View 1: Mobile List (Actions Hidden in Dropdown) --- */}
          <div className="flex flex-col gap-4 md:hidden">
            {data.products.map((product, index) => (
              <div
                key={product._id}
                className="relative p-4 bg-white border border-gray-200 shadow-sm rounded-xl"
              >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 border border-gray-200 rounded-lg">
                      {product.image?.[0] ? (
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Action Menu Trigger */}
                  <div className="relative">
                    <button
                      onClick={(e) => toggleActionMenu(index, e)}
                      className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-slate-600"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Mobile Dropdown (Hidden Actions) */}
                    {activeActionIndex === index && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={closeMenu}
                        />
                        <div className="absolute right-0 z-20 w-40 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl animate-in fade-in zoom-in-95">
                          <div className="p-1">
                            <button
                              onClick={() => {
                                dispatch(
                                  setUpdateModal({ open: true, product }),
                                );
                                closeMenu();
                              }}
                              className="flex items-center w-full gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4 text-blue-600" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                dispatch(
                                  setDeleteModal({
                                    open: true,
                                    id: product._id,
                                    name: product.name,
                                  }),
                                );
                                closeMenu();
                              }}
                              className="flex items-center w-full gap-2 px-3 py-2.5 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile Card Details */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Price
                    </p>
                    <p className="font-bold text-slate-900">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Stock
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {product.countInStock} units
                    </p>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={product.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- View 2: Desktop Table --- */}
          <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl md:block">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      SKU
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Stock
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
                  {data.products.map((product, index) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      isOpen={activeActionIndex === index}
                      onToggle={() =>
                        toggleActionMenu(index, { stopPropagation: () => {} })
                      }
                      onDelete={() => {
                        dispatch(
                          setDeleteModal({
                            open: true,
                            id: product._id,
                            name: product.name,
                          }),
                        );
                        setActiveActionIndex(null);
                      }}
                      onUpdate={() => {
                        dispatch(
                          setUpdateModal({ open: true, product: product }),
                        );
                        setActiveActionIndex(null);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center bg-white border border-gray-300 border-dashed rounded-xl">
          <div className="flex flex-col items-center justify-center">
            <Search className="w-10 h-10 mb-3 text-gray-300" />
            <p className="font-medium text-gray-500">
              No products found matching your filters.
            </p>
            <button
              onClick={() =>
                dispatch(filterChange({ key: "category", value: "" }))
              }
              className="mt-2 text-sm font-bold text-amber-600 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* --- Pagination --- */}
      {data?.pages > 1 && (
        <div className="mt-6">
          <Pagination
            setItemPages={(num) =>
              dispatch(filterChange({ key: "page", value: num }))
            }
            page={filter.page}
            pages={data?.pages}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsScreen;
