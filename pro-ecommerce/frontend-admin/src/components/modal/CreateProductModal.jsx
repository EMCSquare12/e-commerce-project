import React, { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import axios from "axios";

const CreateProductModal = ({ isOpen, onClose, onCreate, isLoading }) => {
  const initialData = {
    name: "",
    price: 0,
    countInStock: 0,
    category: "",
    brand: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialData);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the payload
    const newProductData = {
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
    };

    if (selectedFile) {
      newProductData.imageFile = selectedFile;
    }

    onCreate(newProductData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Add New Product</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <form id="create-form" onSubmit={handleSubmit} className="space-y-5">
            {/* --- Image Upload Section --- */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product Image
              </label>

              <div className="relative w-full">
                <label
                  htmlFor="create-dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    preview
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {preview ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-contain w-full h-full p-2 transition-opacity rounded-lg opacity-100 group-hover:opacity-40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md">
                          <UploadCloud className="w-4 h-4" /> Change Image
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 mb-3 bg-white rounded-full shadow-sm">
                        <UploadCloud className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        SVG, PNG, JPG or WEBP
                      </p>
                    </div>
                  )}

                  <input
                    id="create-dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
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
                  value={formData.name}
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
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. WM-001"
                />
              </div>
            </div>

            {/* Row 2: Brand & Category */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  required
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Logitech"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Electronics"
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
                  value={formData.price}
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
                  value={formData.countInStock}
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
                value={formData.description}
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
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-form"
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
