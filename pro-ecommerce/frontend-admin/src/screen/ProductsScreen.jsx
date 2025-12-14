import { useState } from "react";
import {
  Search,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useGetProductsQuery } from "../slices/productsApiSlice";

const ProductsScreen = () => {
  const { data, isLoading, error } = useGetProductsQuery({});
  console.log(data);

  const checkStatus = {
    "Out of Stock": "bg-red-100 text-red-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "In Stock": "bg-green-100 text-green-700",
  };
  return (
    <div className="space-y-6">
      {/* --- Page Title --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
      </div>

      {/* --- Main Content Card --- */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* --- Toolbar Section (Filters & Search) --- */}
        <div className="flex flex-col justify-between gap-4 p-4 border-b border-gray-100 lg:flex-row lg:items-center">
          {/* Left Side: Filter Dropdowns */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Category
              </span>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8">
                  <option>All, Electronics, Clothing, Home...</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Home</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Stock Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Stock Status
              </span>
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8">
                  <option>All, In Stock, Low...</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Search & Export */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              {/* <input
                type="text"
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Search Product Name, SKU"
              /> */}
            </div>

            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="w-10 px-6 py-4">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-6 py-4">Product Image</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {data?.map((product) => (
                <tr
                  key={product.name}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 overflow-hidden bg-gray-100 border border-gray-200 rounded-md">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.countInStock}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        checkStatus[product.status]
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer --- */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-200 rounded-md bg-blue-50">
            1
          </button>

          <button className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsScreen;
