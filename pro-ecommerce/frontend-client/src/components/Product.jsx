import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden transition-shadow duration-300 bg-white border rounded-lg shadow-md hover:shadow-xl border-slate-200">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image[1]}
          alt={product.name}
          className="object-cover object-center w-full h-64"
        />
      </Link>

      <div className="flex flex-col flex-grow p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="mb-2 text-lg font-semibold truncate transition text-slate-800 hover:text-amber-600">
            {product.name}
          </h3>
        </Link>

        <Rating value={product.rating} text={`${product.numReviews} reviews`} />

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100">
          <span className="text-2xl font-bold text-slate-900">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
