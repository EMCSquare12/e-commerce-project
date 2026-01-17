import React from "react";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { Funnel } from "lucide-react";
import { toggleDrawer } from "../slices/toggleSlice";
import { clearFilter } from "../slices/filterSlice";

const HomeScreen = () => {
  const dispatch = useDispatch();

  // Redux: Get Filter State
  const { keyword, pageNumber, category, brand } = useSelector(
    (state) => state.filter
  );
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: category.length > 0 ? category : undefined,
    brand: brand.length > 0 ? brand : undefined,
  });

  const handleToggleFilter = () => {
    dispatch(toggleDrawer());
    dispatch(clearFilter());
  };
  return (
    <>
      {/* Hero Section */}
      <div className="p-10 mb-10 text-center text-white shadow-lg bg-slate-800 rounded-xl">
        <h1 className="mb-4 text-5xl font-bold">Welcome to ProShop</h1>
        <p className="mb-6 text-xl text-slate-300">
          The best place to find the latest electronics
        </p>
        <Link
          to="/"
          className="px-6 py-3 font-bold transition rounded-full bg-amber-500 text-slate-900 hover:bg-amber-400"
        >
          Shop Now
        </Link>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Latest Products
      </h1>

      {keyword !== "" &&
      !isLoading &&
      !error &&
      data?.products?.length === 0 ? (
        // Better "Not Found" handling
        <div className="p-4 mb-4 text-center text-gray-500 bg-gray-100 rounded">
          No items found matching "{keyword}"
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="flex flex-row items-center justify-between p-2 mb-4 bg-gray-100 rounded">
            <button
              onClick={() => handleToggleFilter()}
              className="flex flex-row items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
            >
              <Funnel />
              All Categories
            </button>
            {(category.length > 0 || brand.length > 0) && (
              <button
                onClick={() => dispatch(clearFilter())}
                className="text-sm font-semibold text-red-500 hover:text-red-600"
              >
                Clear Filter ({brand.length + category.length})
              </button>
            )}
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              <Pagination page={pageNumber} pages={data?.pages} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomeScreen;
