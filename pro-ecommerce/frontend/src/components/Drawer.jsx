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

  console.log(filteredBrand);
  const { category: selectedCategory, brand: selectedBrand } = useSelector(
    (state) => state.filter
  );
  const dispatch = useDispatch();
  // --- State Management ---
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  const handleCategories = (category) => {
    dispatch(setCategory(category)); // toggle add/remove
  };

  const handleBrand = (brand) => {
    dispatch(setBrand(brand)); // toggle add/remove
  };

  //   if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => dispatch(closeDrawer())}
      />

      {/* Drawer Container */}
      <div className="fixed top-0 left-0 z-50 flex flex-col h-screen transition-transform transform bg-white shadow-2xl w-80 sm:w-96">
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
              onClick={() => dispatch(closeDrawer())}
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
          <div className="border-b border-gray-100">
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

            {isBrandOpen && (
              <div className="px-6 pb-6">
                {/* Brand Search Input */}
                <div className="relative mb-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FaSearch className="text-xs" />
                  </span>
                  <input
                    type="text"
                    placeholder="Find a brand..."
                    // value={brandSearch}
                    // onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full py-2 pr-4 text-sm text-gray-700 transition-colors border border-gray-200 rounded-lg pl-9 bg-gray-50 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Brand List */}
                <ul className="flex flex-col gap-3 pr-2 overflow-y-auto max-h-60 custom-scrollbar">
                  {
                    filteredBrand?.map((brand) => (
                      <li
                        key={brand}
                        className="flex flex-row items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          id={`brand-${brand}`}
                          checked={selectedBrand.includes(brand)}
                          onChange={() => handleBrand(brand)}
                          className="w-5 h-5 border-gray-300 rounded cursor-pointer text-amber-600 focus:ring-amber-500"
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                        >
                          {brand}
                        </label>
                      </li>
                    ))

                    // <li className="py-2 text-sm italic text-gray-400">
                    //   No brands found
                    // </li>
                  }
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* --- Sticky Footer --- */}
        <div className="p-6 bg-white border-t border-gray-100">
          <button className="flex items-center justify-center w-full gap-2 text-white transition-colors bg-gray-900 rounded-lg shadow-lg py-3.5 hover:bg-gray-800 font-bold">
            {/* Show {totalResults} Results */}
          </button>
        </div>
      </div>
    </>
  );
};

export default Drawer;
