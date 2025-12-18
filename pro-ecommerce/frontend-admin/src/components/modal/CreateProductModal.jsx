import React, { useState } from "react";
import { X } from "lucide-react";

const CreateProductModal = ({ isOpen, onClose, onCreate, isLoading }) => {
  const initialData = {
    name: "",
    price: 0,
    countInStock: 0,
    category: "",
    brand: "",
    description: "",
    image: "", // We take a single string here, backend wraps it in []
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
    });
    setFormData(initialData); // Reset form after submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-2xl my-8 bg-white rounded-lg shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Add New Product
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: Name & Brand */}
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
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-blue-500"
                placeholder="e.g. Wireless Mouse"
              />
            </div>
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
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-blue-500"
                placeholder="e.g. Logitech"
              />
            </div>
          </div>

          {/* Row 2: Price, Stock, Category */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-blue-500"
                min="0"
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
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-blue-500"
                placeholder="e.g. Electronics"
              />
            </div>
          </div>

          {/* Row 3: Image URL */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              required
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-blue-500"
              placeholder="/images/sample.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a single image URL.
            </p>
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
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-blue-500"
              placeholder="Product details..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
