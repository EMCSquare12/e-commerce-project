import React, { useState } from "react";
import {
  useGetProductCategoriesQuery,
  useGetProductBrandsQuery,
} from "../slices/productsApiSlice";
import { ChevronUp, ChevronDown, X, Check } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setCategory, clearFilter, setBrand } from "../slices/filterSlice";
import { closeDrawer } from "../slices/toggleSlice";
import Loader from "./Loader";
import Message from "./Message";

const Drawer = () => {
  const dispatch = useDispatch();

  // --- Data Fetching ---
  const {
    data: filteredCategory,
    isLoading: isLoadingCategory,
    error: errorCategory,
  } = useGetProductCategoriesQuery();

  const {
    data: filteredBrand,
    isLoading: isLoadingBrand,
    error: errorBrand,
  } = useGetProductBrandsQuery();

  // --- Global State ---
  const { category: selectedCategory, brand: selectedBrand } = useSelector(
    (state) => state.filter
  );

  // --- Local State ---
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  // --- Handlers ---
  const handleCategories = (category) => {
    dispatch(setCategory(category));
  };

  const handleBrand = (brand) => {
    dispatch(setBrand(brand));
  };

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={handleCloseDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 z-[70] flex flex-col h-full bg-white shadow-2xl transition-transform w-full md:w-80">
        {/* --- Header --- */}
        <div className="flex flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Filters</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(clearFilter())}
              className="text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Reset
            </button>
            <button
              onClick={handleCloseDrawer}
              className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 pb-24 overflow-y-auto scrollbar-hide">
          {/* Category Section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex flex-row items-center justify-between w-full p-6 text-left transition-colors hover:bg-gray-50"
            >
              <span className="font-bold text-gray-800">Categories</span>
              {isCategoryOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isCategoryOpen &&
              (isLoadingCategory ? (
                <div className="px-6 pb-6">
                  <Loader />
                </div>
              ) : errorCategory ? (
                <div className="px-6 pb-6">
                  <Message variant="danger">
                    {errorCategory?.filteredCategory?.Message ||
                      errorCategory.error}
                  </Message>
                </div>
              ) : (
                <ul className="flex flex-col px-2 pb-6">
                  {filteredCategory?.map((category) => (
                    <li
                      key={category._id}
                      onClick={() => handleCategories(category._id)}
                      className="flex items-center justify-between px-4 py-3 transition-colors rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        {/* Custom Checkbox Look */}
                        <div
                          className={`w-5 h-5 flex items-center justify-center border rounded ${
                            selectedCategory.includes(category._id)
                              ? "bg-amber-500 border-amber-500 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selectedCategory.includes(category._id) && (
                            <Check size={14} strokeWidth={3} />
                          )}
                        </div>

                        <span
                          className={`text-sm md:text-base ${
                            selectedCategory.includes(category._id)
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {category._id}
                        </span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 rounded-full">
                        {category.count}
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
          </div>

          {/* Brand Section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setIsBrandOpen(!isBrandOpen)}
              className="flex flex-row items-center justify-between w-full p-6 text-left transition-colors hover:bg-gray-50"
            >
              <span className="font-bold text-gray-800">Brands</span>
              {isBrandOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isBrandOpen &&
              (isLoadingBrand ? (
                <div className="px-6 pb-6">
                  <Loader />
                </div>
              ) : errorBrand ? (
                <div className="px-6 pb-6">
                  <Message variant="danger">
                    {errorBrand?.filteredBrand?.message || errorBrand.error}
                  </Message>
                </div>
              ) : (
                <ul className="flex flex-col px-2 pb-6">
                  {filteredBrand?.map((brand) => (
                    <li
                      key={brand._id}
                      onClick={() => handleBrand(brand._id)}
                      className="flex items-center justify-between px-4 py-3 transition-colors rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 flex items-center justify-center border rounded ${
                            selectedBrand.includes(brand._id)
                              ? "bg-amber-500 border-amber-500 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selectedBrand.includes(brand._id) && (
                            <Check size={14} strokeWidth={3} />
                          )}
                        </div>

                        <span
                          className={`text-sm md:text-base ${
                            selectedBrand.includes(brand._id)
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {brand._id}
                        </span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 rounded-full">
                        {brand.count}
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom">
          <button
            onClick={handleCloseDrawer}
            className="w-full py-3.5 text-sm font-bold tracking-wider text-white uppercase bg-slate-900 rounded-lg shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            View Results
          </button>
        </div>
      </div>
    </>
  );
};

export default Drawer;
