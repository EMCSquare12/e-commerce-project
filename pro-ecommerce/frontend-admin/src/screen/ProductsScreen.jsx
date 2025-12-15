import { useState } from "react";
import { Download, MoreHorizontal } from "lucide-react";
import {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
  useGetProductStatusQuery,
  useDeleteProductMutation,
} from "../slices/productsApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

const ProductsScreen = () => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [actionId, setAcionId] = useState(0);
  const { data, isLoading, error } = useGetProductsQuery({
    category,
    status,
    pageNumber,
  });
  const { data: categories } = useGetProductCategoriesQuery();
  const { data: stockStatus } = useGetProductStatusQuery();
  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();
  console.log(data);

  const checkStatus = {
    "Out of Stock": "bg-red-100 text-red-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "In Stock": "bg-green-100 text-green-700",
  };

  const handleAction = (index) => {
    setIsOpenAction(!isOpenAction);
    setAcionId(index);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId).unwrap();

        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || "Error deleting product");
      }
    }
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
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none overflow-y-scroll bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8"
                >
                  <option value="">All</option>

                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category._id}
                    </option>
                  ))}
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
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  className="appearance-none overflow-y-scroll bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8"
                >
                  <option value="">All</option>

                  {stockStatus?.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
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
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                <tr>
                  <th className="w-10 px-6 py-4">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="p-4">Product Image</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm divide-y divide-gray-100">
                {data.products?.map((product, index) => (
                  <tr
                    key={product.name}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-10 h-10 overflow-hidden bg-gray-100 border border-gray-200 rounded-md ">
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {product.sku}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {product.category}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {product.price}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {product.countInStock}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1  rounded-full text-xs font-medium whitespace-nowrap ${
                          checkStatus[product.status]
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="relative p-4 text-right">
                      <button
                        onClick={() => handleAction(index)}
                        className="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      {isOpenAction && actionId === index && (
                        <ul className="absolute left-0 z-20 bg-white rounded shadow-md">
                          <li className="px-4 py-2 font-medium text-gray-600 cursor-pointer text-md hover:bg-blue-200 hover:text-blue-600">
                            Update
                          </li>
                          <li
                            onClick={() => handleDelete(product._id)}
                            className="px-4 py-2 font-medium text-gray-600 cursor-pointer text-md hover:bg-red-200 hover:text-red-600"
                          >
                            {isLoading ? "Deleting..." : "Delete"}
                          </li>
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- Pagination Footer --- */}
      </div>
      <Pagination
        setItemPages={(num) => setPageNumber(num)}
        page={pageNumber}
        pages={data?.pages}
      />
    </div>
  );
};

export default ProductsScreen;
