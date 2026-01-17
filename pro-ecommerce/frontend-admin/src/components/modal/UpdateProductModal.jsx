import React, { useState, useEffect } from "react";
import {
  X,
  UploadCloud,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setUpdateModal,
  setLoadingGlobal,
  setUpdateFormData,
} from "../../slices/productSlice";

const UpdateProductModal = ({ onUpdate }) => {
  const {
    isLoadingGlobal,
    updateModal: { open, product },
    updateFormData,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [imageList, setImageList] = useState([]);
  const [imageToRemove, setImageToRemove] = useState([]);

  useEffect(() => {
    if (product) {
      dispatch(
        setUpdateFormData({
          name: product.name || "",
          price: product.price || 0,
          category: product.category || "",
          countInStock: product.countInStock || 0,
          sku: product.sku || "",
        }),
      );
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
        })),
      );
    }
  }, [product, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setUpdateFormData({ [name]: value }));
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

  const handleRemoveImage = (indexToRemove, newImageToRemove) => {
    setImageList((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImageToRemove([...imageToRemove, newImageToRemove]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoadingGlobal) return;
    dispatch(setLoadingGlobal(true));
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
      dispatch(setLoadingGlobal(false));
    }

    onUpdate(product._id, {
      name: updateFormData.name,
      price: Number(updateFormData.price),
      countInStock: Number(updateFormData.countInStock),
      image: finalImageUrls,
      imageToDelete: imageToRemove,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      {/* Modal Box */}
      <div className="w-full sm:max-w-lg bg-white sm:rounded-xl rounded-t-xl shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 fade-in flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Update Product</h3>
          <button
            onClick={() => dispatch(setUpdateModal({ open: false }))}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          <form id="update-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Image Section */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-700">
                <ImageIcon className="w-4 h-4 text-blue-500" /> Product Images
              </label>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                      className="absolute p-1.5 text-white bg-red-500 rounded-full shadow-sm -top-2 -right-2 hover:bg-red-600 focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center w-full h-full transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer aspect-square hover:bg-blue-50 hover:border-blue-400 group bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-1.5 mb-1 transition-colors bg-white rounded-full shadow-sm group-hover:text-blue-600">
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-600">
                      Add New
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
              <p className="mt-2 text-xs text-gray-400">
                Tap the red X to mark images for deletion.
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block mb-1.5 text-sm font-bold text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={updateFormData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={updateFormData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="countInStock"
                  value={updateFormData.countInStock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Read-Only Info Block */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/80">
              <div>
                <label className="block mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Category
                </label>
                <div className="text-sm font-semibold text-gray-700 truncate">
                  {updateFormData.category || "N/A"}
                </div>
              </div>
              <div>
                <label className="block mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  SKU
                </label>
                <div className="text-sm font-semibold text-gray-700 truncate">
                  {updateFormData.sku || "N/A"}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-100 bg-gray-50 sm:rounded-b-xl pb-safe">
          <button
            type="button"
            onClick={() => dispatch(setUpdateModal({ open: false }))}
            disabled={isLoadingGlobal}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="update-form"
            disabled={isLoadingGlobal}
            className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoadingGlobal ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
