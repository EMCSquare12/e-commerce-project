import React, { useState, useMemo } from "react";
import { FaChevronUp, FaChevronDown, FaSearch, FaTimes } from "react-icons/fa";
import {
  useGetProductCategoriesQuery,
  useGetProductBrandsQuery,
} from "../slices/productsApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { setCategory, clearFilter, setBrand } from "../slices/filterSlice";
import { closeDrawer } from "../slices/toggleSlice";
import Loader from "./Loader";
import Message from "./Message";

const Drawer = () => {
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

  const { category: selectedCategory, brand: selectedBrand } = useSelector(
    (state) => state.filter
  );
  const dispatch = useDispatch();
  // --- State Management ---
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [filterResult, setFilterResult] = useState(0);

  const handleCategories = (category) => {
    dispatch(setCategory(category)); // toggle add/remove
  };

  const handleBrand = (brand) => {
    dispatch(setBrand(brand)); // toggle add/remove
  };

  const handleCloseDrawer = () => {
    dispatch(clearFilter());
    dispatch(closeDrawer());
  };

  return (
    <>
      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 z-50 flex flex-col h-screen transition-transform transform bg-white border-r border-gray-200 w-80 sm:w-80">
        {/* --- Header --- */}
        <div className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Filters</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(clearFilter())}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
            <button
              onClick={() => handleCloseDrawer()}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* --- Scrollable Content Body --- */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Category Section */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex flex-row items-center justify-between w-full p-6 text-left hover:bg-gray-50"
            >
              <span className="font-bold text-gray-700">Category</span>
              {isCategoryOpen ? (
                <FaChevronUp className="text-xs text-gray-400" />
              ) : (
                <FaChevronDown className="text-xs text-gray-400" />
              )}
            </button>

            {isCategoryOpen &&
              (isLoadingCategory ? (
                <Loader />
              ) : errorCategory ? (
                <Message variant="danger">
                  {errorCategory?.filteredCategory?.Message ||
                    errorCategory.error}
                </Message>
              ) : (
                <ul className="flex flex-col gap-1 px-3 pb-6">
                  {filteredCategory?.map((category) => (
                    <li
                      key={category._id}
                      className="flex flex-row items-center justify-between px-3 py-1 hover:bg-gray-100"
                      onClick={() => handleCategories(category._id)}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <input
                          type="checkbox"
                          id={category._id}
                          checked={selectedCategory.includes(category._id)}
                          onChange={() => handleCategories(category._id)}
                          className="w-5 h-5 border-gray-300 rounded cursor-pointer text-amber-600 focus:ring-amber-500"
                        />
                        <label
                          htmlFor={category._id}
                          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                        >
                          {category._id}
                        </label>
                      </div>
                      <span className="text-xs text-gray-400">
                        ({category.count})
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
          </div>

          {/* Brand Section */}
          <div className="-mt-6 border-b border-gray-100">
            <button
              onClick={() => setIsBrandOpen(!isBrandOpen)}
              className="flex flex-row items-center justify-between w-full p-6 text-left hover:bg-gray-50"
            >
              <span className="font-bold text-gray-700">Brand</span>
              {isBrandOpen ? (
                <FaChevronUp className="text-xs text-gray-400" />
              ) : (
                <FaChevronDown className="text-xs text-gray-400" />
              )}
            </button>

            {isBrandOpen &&
              (isLoadingBrand ? (
                <Loader />
              ) : errorBrand ? (
                <Message variant="danger">
                  {errorBrand?.filteredBrand?.message || errorBrand.error}
                </Message>
              ) : (
                <div className="pb-6 ">
                  {/* Brand List */}
                  <ul className="flex flex-col gap-1 px-3 pb-6">
                    {filteredBrand?.map((brand) => (
                      <li
                        key={brand._id}
                        className="flex flex-row items-center justify-between px-3 py-1 hover:bg-gray-100"
                        onClick={() => handleBrand(brand._id)}
                      >
                        <div className="flex flex-row items-center gap-3">
                          <input
                            type="checkbox"
                            id={brand._id}
                            checked={selectedBrand.includes(brand._id)}
                            onChange={() => handleBrand(brand._id)}
                            className="w-5 h-5 border-gray-300 rounded cursor-pointer text-amber-600 focus:ring-amber-500"
                          />
                          <label
                            htmlFor={brand._id}
                            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                          >
                            {brand._id}
                          </label>
                        </div>
                        <span className="text-xs text-gray-400">
                          ({brand.count})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
