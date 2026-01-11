import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetProductDetailsQuery,
  useGetProductNavigationQuery,
} from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const { data: navigation } = useGetProductNavigationQuery(productId);
  useEffect(() => {
    if (product?.image?.length > 0) {
      setSelectedImage(product.image[0]);
    }
    setQty(1);
  }, [product, productId]);

  useEffect(() => {
    const handleArrowKey = (e) => {
      if (e.key === "ArrowRight" && navigation?.next) {
        navigate(`/product/${navigation?.next._id}`);
      }
      if (e.key === "ArrowLeft" && navigation?.prev) {
        navigate(`/product/${navigation?.prev._id}`);
      }
    };

    window.addEventListener("keydown", handleArrowKey);

    return () => {
      window.removeEventListener("keydown", handleArrowKey);
    };
  }, [navigation]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const arrowBtnStyle =
    "fixed top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-16 h-16  transition  text-3xl text-gray-300 hover:text-gray-400 hover:bg-gray-100 hover:shadow-lg";

  return (
    <>
      {navigation?.prev ? (
        <Link
          to={`/product/${navigation.prev._id}`}
          className={`${arrowBtnStyle} left-4`}
          title="Previous Product"
        >
          <FaChevronLeft />
        </Link>
      ) : (
        <button
          className={`${arrowBtnStyle} left-4 opacity-30 cursor-not-allowed`}
          disabled
        >
          <FaChevronLeft />
        </button>
      )}

      {navigation?.next ? (
        <Link
          to={`/product/${navigation.next._id}`}
          className={`${arrowBtnStyle} right-4`}
          title="Next Product"
        >
          <FaChevronRight />
        </Link>
      ) : (
        <button
          className={`${arrowBtnStyle} right-4 opacity-30 cursor-not-allowed`}
          disabled
        >
          <FaChevronRight />
        </button>
      )}

      <Link
        className="inline-block px-4 py-2 mb-6 transition rounded bg-slate-200 hover:bg-slate-300 text-slate-800"
        to="/"
      >
        <i className="mr-2 fas fa-arrow-left"></i> Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Image Section */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="relative w-full mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-square">
              <img
                src={selectedImage || product.image[0]}
                alt={product.name}
                className="object-cover object-center w-full h-full"
              />
            </div>
            {product.image.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image.map((imgUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ring-2 ring-offset-2 transition-all ${
                      selectedImage === imgUrl
                        ? "ring-slate-900 ring-offset-white"
                        : "ring-transparent hover:ring-gray-300"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${index + 1}`}
                      className="object-cover object-center w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="mb-3 text-3xl font-bold text-slate-800">
              {product.name}
            </h3>
            <div className="py-2 border-b border-gray-200">
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </div>
            <div className="py-4 border-b border-gray-200">
              <p className="text-2xl font-bold text-slate-900">
                Price: ${product.price}
              </p>
            </div>
            <div className="py-4">
              <p className="leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>
          </div>

          {/* Cart Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <span className="text-gray-600">Price:</span>
                <span className="text-xl font-bold text-slate-900">
                  ${product.price}
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-bold ${
                    product.countInStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-600">Qty:</span>
                  <select
                    className="p-2 bg-white border border-gray-300 rounded"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`w-full py-3 rounded font-bold uppercase tracking-wider transition ${
                  product.countInStock === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductScreen;
