import React, { useEffect, useState } from "react";
import { X, UploadCloud, Plus, Image as ImageIcon } from "lucide-react";
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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-white sm:rounded-xl rounded-t-xl shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 fade-in flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Add New Product</h3>
          <button
            onClick={() =>
              dispatch(
                setCreateNewProductModal({
                  ...createNewProductModal,
                  open: false,
                }),
              )
            }
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          <form id="create-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Product Images
              </label>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                      className="absolute p-1 text-white bg-red-500 rounded-full shadow-sm -top-2 -right-2 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center w-full h-full transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer aspect-square hover:bg-blue-50 hover:border-blue-400 group bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-1.5 mb-1 transition-colors bg-white rounded-full shadow-sm group-hover:text-blue-600">
                      {newImages.length === 0 ? (
                        <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">
                      {newImages.length === 0 ? "Upload" : "Add"}
                    </span>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={createFormData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">
                  SKU
                </label>
                <input
                  required
                  type="text"
                  name="sku"
                  value={createFormData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. WM-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={createFormData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">
                  Stock
                </label>
                <input
                  required
                  type="number"
                  name="countInStock"
                  value={createFormData.countInStock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea
                required
                name="description"
                value={createFormData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Product details..."
              ></textarea>
            </div>
          </form>
        </div>

        {/* Footer / Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-100 bg-gray-50 sm:rounded-b-xl pb-safe">
          <button
            type="button"
            onClick={() =>
              dispatch(
                setCreateNewProductModal({
                  ...createNewProductModal,
                  open: false,
                }),
              )
            }
            disabled={isLoadingGlobal}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-form"
            disabled={isLoadingGlobal}
            className="flex-1 px-4 py-3 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoadingGlobal ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
