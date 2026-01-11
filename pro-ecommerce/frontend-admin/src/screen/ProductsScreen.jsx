import React, { useState } from "react";
import axios from "axios";

import { Download, ChevronDown, Plus, Trash2 } from "lucide-react";
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

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const { filter, createNewProductModal } = useSelector(
    (state) => state.product
  );

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
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [newProduct, { isLoading: isCreating }] = useCreateProductMutation();

  // --- Handlers ---
  const handleFilterChange = (key, value) => {
    dispatch(filterChange({ key, value }));
    setActiveActionIndex(null);
  };

  const toggleActionMenu = (index) => {
    setActiveActionIndex(activeActionIndex === index ? null : index);
  };

  const handleConfirmUpdate = async (productId, formData) => {
    dispatch(setLoadingGlobal(true));
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
      setCreateNewProductModal({ open: false, product: null });
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error adding new item");
    } finally {
      dispatch(setLoadingGlobal(false));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || error.error || "Something went wrong"}
      </Message>
    );
  }

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      <DeleteConfirmationModal />

      <UpdateProductModal onUpdate={handleConfirmUpdate} />

      <CreateProductModal onCreate={handleCreateNewProduct} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Products
        </h1>
      </div>

      <div className="pb-4 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col justify-between gap-4 p-4 bg-white border-b border-gray-100 lg:flex-row lg:items-center">
          <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
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

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Stock</span>
              <div className="relative">
                <select
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 outline-none cursor-pointer"
                >
                  <option value="">All</option>
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

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                dispatch(
                  setCreateNewProductModal({
                    ...createNewProductModal,
                    open: true,
                  })
                )
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
        <>
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
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
                      dispatch(
                        setDeleteModal({
                          open: true,
                          id: product._id,
                          name: product.name,
                        })
                      );

                      setActiveActionIndex(null);
                    }}
                    onUpdate={() => {
                      dispatch(
                        setUpdateModal({ open: true, product: product })
                      );
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
                  dispatch(filterChange({ key: "page", value: num }))
                }
                page={filter.page}
                pages={data?.pages}
              />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default ProductsScreen;
