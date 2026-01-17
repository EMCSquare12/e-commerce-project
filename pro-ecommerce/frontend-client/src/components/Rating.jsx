import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center gap-0.5 md:gap-1 mb-1 md:mb-2">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} className="text-amber-500 text-[10px] md:text-sm">
          {value >= index ? (
            <FaStar />
          ) : value >= index - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}

      {text && (
        <span className="ml-1 text-xs font-medium md:ml-2 md:text-sm text-slate-500">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;
