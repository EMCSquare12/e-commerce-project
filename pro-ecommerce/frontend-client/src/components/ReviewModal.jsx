import React, { useState } from "react";
import { X, Star, Send } from "lucide-react";
import { toast } from "react-toastify";
import { useSubmitRatingMutation } from "../slices/ratingsApiSlice";
import Loader from "./Loader";

const ReviewModal = ({ isOpen, onClose, product, userInfo }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const [createReview, { isLoading }] = useSubmitRatingMutation();

  console.log("ReviewModal - product:", product?.product);
  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      return toast.error("Please write a comment");
    }

    try {
      const productId = product.product;
      await createReview({
        productId,
        rating,
        review,
      }).unwrap();
      toast.success("Review submitted successfully");
      setReview("");
      setRating(5);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to submit review");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Write a Review</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-200 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-50">
          <div className="flex-shrink-0 w-12 h-12 overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 line-clamp-1">
              {product.name}
            </p>
            <p className="text-xs text-gray-500">
              Share your experience with this product
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Star Rating Input */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-amber-600">
              {hoveredStar || rating} out of 5 stars
            </p>
          </div>

          {/* Comment Input */}
          <div>
            <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase">
              Review
            </label>
            <textarea
              rows="4"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like or dislike?"
              className="w-full p-3 text-sm text-gray-700 transition-all bg-white border border-gray-200 outline-none resize-none rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all shadow-md bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader size="sm" color="white" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
