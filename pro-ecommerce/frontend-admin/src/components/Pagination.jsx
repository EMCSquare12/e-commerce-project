import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ page, pages, setItemPages }) => {
  const maxButtons = 5; 
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  if (endPage > pages) {
    endPage = pages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Base style for all buttons
  const btnBase =
    "flex items-center justify-center w-9 h-9 text-sm font-semibold border rounded-lg transition-all active:scale-95";

  // Styles for inactive buttons
  const btnInactive =
    "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  // Styles for the active button
  const btnActive = "border-blue-600 bg-blue-600 text-white shadow-sm";

  return (
    <div className="flex justify-center mt-6 mb-8">
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          disabled={page === 1}
          className={`${btnBase} ${btnInactive} disabled:opacity-40 disabled:cursor-not-allowed`}
          onClick={() => setItemPages(page - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* First page + ellipsis if needed */}
        {startPage > 1 && (
          <>
            <button
              className={`${btnBase} ${btnInactive}`}
              onClick={() => setItemPages(1)}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="flex items-end justify-center w-4 text-gray-400 h-9">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`${btnBase} ${num === page ? btnActive : btnInactive}`}
            onClick={() => setItemPages(num)}
          >
            {num}
          </button>
        ))}

        {/* Last page + ellipsis if needed */}
        {endPage < pages && (
          <>
            {endPage < pages - 1 && (
              <span className="flex items-end justify-center w-4 text-gray-400 h-9">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            )}
            <button
              className={`${btnBase} ${btnInactive}`}
              onClick={() => setItemPages(pages)}
            >
              {pages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          disabled={page === pages}
          className={`${btnBase} ${btnInactive} disabled:opacity-40 disabled:cursor-not-allowed`}
          onClick={() => setItemPages(page + 1)}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
