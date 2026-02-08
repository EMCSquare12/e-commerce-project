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
import { ChevronLeft, ChevronRight, ArrowLeft, User } from "lucide-react";

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
    "fixed top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg text-slate-600 hover:text-amber-500 hover:scale-110 transition-all duration-200";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Message variant="danger">
          {error?.data?.message || error.error || "Something went wrong"}
        </Message>
      </div>
    );
  }
  return (
    <div className="pb-24 md:pb-8">
      {navigation?.prev ? (
        <Link
          to={`/product/${navigation.prev._id}`}
          className={`${arrowBtnStyle} left-6`}
          title="Previous Product"
        >
          <ChevronLeft size={28} />
        </Link>
      ) : (
        <button
          className={`${arrowBtnStyle} left-6 opacity-30 cursor-not-allowed`}
          disabled
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {navigation?.next ? (
        <Link
          to={`/product/${navigation.next._id}`}
          className={`${arrowBtnStyle} right-6`}
          title="Next Product"
        >
          <ChevronRight size={28} />
        </Link>
      ) : (
        <button
          className={`${arrowBtnStyle} right-6 opacity-30 cursor-not-allowed`}
          disabled
        >
          <ChevronRight size={28} />
        </button>
      )}

      <Link
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold transition bg-gray-100 rounded-lg hover:bg-gray-200 text-slate-700"
        to="/"
      >
        <ArrowLeft size={16} /> Go Back
      </Link>

      <>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="relative w-full mb-4 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl aspect-square">
              <img
                src={selectedImage || product.image[0]}
                alt={product.name}
                className="object-contain object-center w-full h-full p-4"
              />
            </div>
            {product.image.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.image.map((imgUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative aspect-square bg-white border rounded-lg overflow-hidden transition-all ${
                      selectedImage === imgUrl
                        ? "ring-2 ring-amber-500 border-transparent"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`View ${index + 1}`}
                      className="object-contain w-full h-full p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-2 text-2xl font-bold md:text-3xl text-slate-800">
              {product.name}
            </h3>

            <div className="py-3 border-b border-gray-100">
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </div>

            <div className="py-4 border-b border-gray-100">
              <p className="text-xl font-bold md:text-2xl text-slate-900">
                ${product.price}
              </p>
            </div>

            <div className="py-4">
              <h4 className="mb-2 font-semibold text-gray-900">Description:</h4>
              <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                {product.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <span className="text-gray-600">Price:</span>
                <span className="text-xl font-bold text-slate-900">
                  ${product.price}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-bold px-2 py-1 rounded text-sm ${
                    product.countInStock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-600">Quantity:</span>
                  <div className="relative">
                    <select
                      className="block w-20 py-2 pl-3 pr-8 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                </div>
              )}

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`w-full py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition-all transform active:scale-95 ${
                  product.countInStock === 0
                    ? "bg-gray-200 cursor-not-allowed text-gray-400"
                    : "bg-slate-900 hover:bg-amber-500 text-white shadow-md hover:shadow-lg"
                }`}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* --- Reviews Section --- */}
        <div className="mt-12 md:mt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}

          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="font-semibold text-slate-900">
                      {review.name || review.user?.name || "Customer"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <div className="mb-2">
                  <Rating value={review.rating} />
                </div>

                <p className="text-sm leading-relaxed text-gray-600">
                  {review.review || review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    </div>
  );
};

export default ProductScreen;
