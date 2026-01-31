import React, { useEffect } from "react";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import HeroSlider from "../components/HeroSlider";
import { useDispatch, useSelector } from "react-redux";
import { Filter } from "lucide-react";
import { toggleDrawer } from "../slices/toggleSlice";
import { clearFilter, setItemPages } from "../slices/filterSlice";

const HomeScreen = () => {
  const dispatch = useDispatch();

  // Redux: Get Filter State
  const { keyword, pageNumber, category, brand } = useSelector(
    (state) => state.filter,
  );
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: category.length > 0 ? category : undefined,
    brand: brand.length > 0 ? brand : undefined,
  });

  //reset filter on unmount
  useEffect(() => {
    return () => {
      dispatch(clearFilter());
    };
  }, [dispatch]);

  const fetchMoreData = () => {
    if (data && pageNumber < data.pages) {
      dispatch(setItemPages(pageNumber + 1));
    }
  };

  const handleToggleFilter = () => {
    dispatch(toggleDrawer());
    dispatch(clearFilter());
  };
  

  return (
    <>
      <HeroSlider />

      <h1 className="mb-6 text-xl font-bold md:text-3xl text-slate-800">
        Latest Products
      </h1>

      {keyword !== "" &&
      !isLoading &&
      !error &&
      data?.products?.length === 0 ? (
        <div className="p-4 mb-4 text-center text-gray-500 bg-gray-100 rounded">
          No items found matching "{keyword}"
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center justify-between mb-4 rounded">
            <button
              onClick={() => handleToggleFilter()}
              className="flex-row items-center hidden gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded shadow-sm md:flex hover:bg-gray-50"
            >
              <Filter />
              All Categories
            </button>

            {(category.length > 0 || brand.length > 0) && (
              <button
                onClick={() => dispatch(clearFilter())}
                className="ml-auto text-sm font-semibold text-red-500 hover:text-red-600 md:ml-0"
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
            <InfiniteScroll
              dataLength={data?.products?.length || 0}
              next={fetchMoreData}
              hasMore={pageNumber < (data?.pages || 0)}
              loader={<Loader />}
              endMessage={
                <p className="py-10 font-medium text-center text-gray-500">
                  You have seen all products!
                </p>
              }
              scrollThreshold={0.9}
            >
              <div className="grid grid-cols-2 gap-3 px-1 md:gap-8 md:grid-cols-3 lg:grid-cols-4">
                {data?.products?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </>
      )}
    </>
  );
};

export default HomeScreen;
