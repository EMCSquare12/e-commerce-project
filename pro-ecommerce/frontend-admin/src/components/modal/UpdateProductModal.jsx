import React, { useState, useEffect } from "react";
import { X, UploadCloud, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const UpdateProductModal = ({
  isOpen,
  onClose,
  product,
  onUpdate,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    countInStock: 0,
    sku: "",
  });

  const [imageList, setImageList] = useState([]);
  const [imageToRemove, setImageToRemove] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || 0,
        category: product.category || "",
        countInStock: product.countInStock || 0,
        sku: product.sku || "",
      });
      let existingImages = [];
      if (product.image) {
        existingImages = Array.isArray(product.image)
          ? product.image
          : [product.image];
      }

      setImageList(
        existingImages.map((url) => ({
          url: url,
          isNew: false,
        }))
      );
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageItem = {
        url: URL.createObjectURL(file),
        file: file,
        isNew: true,
      };
      setImageList((prev) => [...prev, newImageItem]);
    }
    e.target.value = "";
  };

  // 3. Handle Removing an Image
  const handleRemoveImage = (indexToRemove, newImageToRemove) => {
    setImageList((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImageToRemove([...imageToRemove, newImageToRemove]);
    console.log("Image to Remove: ", imageToRemove);
  };

  // 4. Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isLoading) return;
    setIsSubmitting(true);
    let finalImageUrls = [];

    try {
      const processingImages = imageList.map(async (imgItem) => {
        if (imgItem.isNew && imgItem.file) {
          const uploadFormData = new FormData();
          uploadFormData.append("image", imgItem.file);

          const uploadRes = await axios.post("/api/upload", uploadFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return uploadRes.data.image;
        } else {
          return imgItem.url;
        }
      });

      finalImageUrls = await Promise.all(processingImages);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
      return;
    } finally {
      setIsSubmitting(false);
    }

    onUpdate(product._id, {
      name: formData.name,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
      image: finalImageUrls,
      imageToDelete: imageToRemove,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-screen p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
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

        <div className="p-6 overflow-y-auto">
          <form id="update-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Product Images
              </label>

              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {imageList.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={img.url}
                      alt={`Product ${index}`}
                      className="object-cover w-full h-full border border-gray-200 rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, img)}
                      className="absolute p-1 text-white transition-colors bg-red-500 rounded-full shadow-md opacity-100 -top-2 -right-2 hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center w-full h-full transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer aspect-square hover:bg-gray-50 hover:border-blue-400 group">
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <div className="p-2 mb-1 transition-colors bg-gray-100 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Plus className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                    </div>
                    <p className="text-xs text-center text-gray-500 group-hover:text-blue-600">
                      Add New
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
              <p className="mt-2 text-xs text-gray-400">
                Supported formats: JPG, PNG, WEBP.
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="update-form"
            disabled={isLoading || isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading || isSubmitting ? "Saving..." : "Save Changes"}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
