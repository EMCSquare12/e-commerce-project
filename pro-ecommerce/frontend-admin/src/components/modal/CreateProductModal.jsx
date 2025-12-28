import React, { useEffect, useState } from "react";
import { X, UploadCloud, Plus } from "lucide-react";
import CreatableSelect from "../CreatableSelect";
import {
  useGetProductBrandsQuery,
  useGetProductCategoriesQuery,
} from "../../slices/productsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateNewProductModal,
  setCreateFormData,
  clearCreateFormData,
} from "../../slices/productSlice";

const CreateProductModal = ({ onCreate }) => {
  const { isLoadingGlobal, createNewProductModal, createFormData } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [newImages, setNewImages] = useState([]);

  //Api Query
  const { data: categoriesData } = useGetProductCategoriesQuery();
  const { data: brandsdData } = useGetProductBrandsQuery();

  const categoryOptions =
    categoriesData?.map((category) => category._id || category.name) || [];

  const brandOptions =
    brandsdData?.map((brand) => brand._id || brand.name) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setCreateFormData({ [name]: value }));
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageItem = {
        file: file,
        preview: URL.createObjectURL(file),
      };
      setNewImages((prev) => [...prev, newImageItem]);
    }
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    if (!createNewProductModal.open) {
      dispatch(clearCreateFormData());
      setNewImages([]);
    }
  }, [createNewProductModal.open, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProductData = {
      ...createFormData,
      price: Number(createFormData.price),
      countInStock: Number(createFormData.countInStock),
    };

    if (newImages.length > 0) {
      newProductData.imageFiles = newImages.map((img) => img.file);
    }

    const success = await onCreate(newProductData);

    if (success) {
      dispatch(clearCreateFormData());
      setNewImages([]);
    }
  };

  if (!createNewProductModal.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-screen p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Add New Product</h3>
          <button
            onClick={() =>
              dispatch(
                setCreateNewProductModal({
                  ...createNewProductModal,
                  open: false,
                })
              )
            }
            className="p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
            {/* --- Image Grid Section --- */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Product Images
              </label>

              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {newImages.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={img.preview}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-full border border-gray-200 rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute p-1 text-white transition-colors bg-red-500 rounded-full shadow-md opacity-100 -top-2 -right-2 hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center w-full h-full transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer aspect-square hover:bg-gray-50 hover:border-blue-400 group">
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <div className="p-2 mb-1 transition-colors bg-gray-100 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600">
                      {newImages.length === 0 ? (
                        <UploadCloud className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-center text-gray-500 group-hover:text-blue-600">
                      {newImages.length === 0 ? "Upload" : "Add More"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAddImage}
                  />
                </label>
              </div>
            </div>

            {/* Row 1: Name & SKU */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={createFormData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  required
                  type="text"
                  name="sku"
                  value={createFormData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. WM-001"
                />
              </div>
            </div>

            {/* --- Row 2: Brand & Category (UPDATED) --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <CreatableSelect
                  label="Brand"
                  name="brand"
                  value={createFormData.brand}
                  onChange={handleChange}
                  options={brandOptions}
                  placeholder="Select or type..."
                />
              </div>
              <div>
                <CreatableSelect
                  label="Category"
                  name="category"
                  value={createFormData.category}
                  onChange={handleChange}
                  options={categoryOptions}
                  placeholder="Select or type..."
                />
              </div>
            </div>

            {/* Row 3: Price & Stock */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={createFormData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  required
                  type="number"
                  name="countInStock"
                  value={createFormData.countInStock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            {/* Row 4: Description */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                name="description"
                value={createFormData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Product details..."
              ></textarea>
            </div>
          </form>
        </div>

        {/* Footer / Actions */}
        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={() =>
              dispatch(
                setCreateNewProductModal({
                  ...createNewProductModal,
                  open: false,
                })
              )
            }
            disabled={isLoadingGlobal}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-form"
            disabled={isLoadingGlobal}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoadingGlobal ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
