import React from "react";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { PiFunnel } from "react-icons/pi";
import { openDrawer } from "../slices/toggleSlice";

const HomeScreen = () => {
  // This hook automatically fetches data from /api/products
  const dispatch = useDispatch();
  const { keyword, pageNumber, category } = useSelector(
    (state) => state.filter
  );
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
  });

  console.log(data);

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
      <div className="flex flex-row items-center justify-between p-2 mb-2 bg-gray-100">
        <button
          onClick={() => dispatch(openDrawer())}
          className="flex flex-row items-center gap-2 px-4 font-normal text-gray-500 bg-white border border-gray-500 text-md hover:bg-gray-100 hover:text-gray-700"
        >
          Filter
          <PiFunnel className="text-sm" />
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
      <Pagination page={pageNumber} pages={data?.pages} />
    </>
  );
};

export default HomeScreen;
