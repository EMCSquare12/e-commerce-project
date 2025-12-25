import React, { useState, useEffect } from "react";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
const UpdateProductModal = ({
  isOpen,
  onClose,
  product,
  onUpdate,
  isLoading,
}) => {
  // 1. Local state for form fields
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    countInStock: 0,
    sku: "",
    image: [],
  });

  // New State for Image Handling
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 2. Populate form when product data changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || 0,
        category: product.category || "",
        countInStock: product.countInStock || 0,
        sku: product.sku || "",
        image: product.image || [],
      });

      if (product.image && product.image.length > 0) {
        const img = Array.isArray(product.image)
          ? product.image[0]
          : product.image;
        setPreview(img);
      } else {
        setPreview(null);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle File Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a local preview URL
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = product.image[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.image;
      } catch (err) {
        console.log(err);
        toast.error("Image upload failed");
        return;
      }
    }

    onUpdate(product._id, {
      name: formData.name,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
      image: [imageUrl],
    });
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Update Product</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <form id="update-form" onSubmit={handleSubmit} className="space-y-5">
            {/* --- Image Upload Section (Redesigned) --- */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product Image
              </label>

              <div className="relative w-full">
                <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    preview
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {preview ? (
                    <div className="relative w-full h-full group">
                      {/* Preview Image */}
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-contain w-full h-full p-2 transition-opacity rounded-lg opacity-100 group-hover:opacity-40"
                      />
                      {/* Hover Overlay */}
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
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              {/* Stock Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Count In Stock
                </label>
                <input
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Read Only Fields */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
              <div>
                <label className="block mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Category
                </label>
                <div className="text-sm font-medium text-gray-700">
                  {formData.category || "N/A"}
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  SKU
                </label>
                <div className="text-sm font-medium text-gray-700">
                  {formData.sku || "N/A"}
                </div>
              </div>
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
            form="update-form"
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
