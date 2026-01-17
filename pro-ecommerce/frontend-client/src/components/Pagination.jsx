import { useDispatch } from "react-redux";
import { setItemPages } from "../slices/filterSlice";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ page, pages }) => {
  const dispatch = useDispatch();

  if (pages <= 1) return null;

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

  const baseBtnStyle =
    "flex items-center justify-center w-9 h-9 md:w-10 md:h-10 text-sm font-semibold border rounded-lg transition-all active:scale-95";

  const inactiveBtnStyle =
    "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300";

  const activeBtnStyle = "border-amber-500 bg-amber-500 text-white shadow-md";

  return (
    <div className="flex justify-center mt-8 mb-8">
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Prev Button */}
        <button
          disabled={page === 1}
          className={`${baseBtnStyle} ${inactiveBtnStyle} disabled:opacity-40 disabled:cursor-not-allowed`}
          onClick={() => dispatch(setItemPages(page - 1))}
          aria-label="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* First page + ellipsis if needed */}
        {startPage > 1 && (
          <>
            <button
              className={`${baseBtnStyle} ${inactiveBtnStyle}`}
              onClick={() => dispatch(setItemPages(1))}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="flex items-end justify-center w-4 text-gray-400 h-9">
                <MoreHorizontal size={16} />
              </span>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`${baseBtnStyle} ${
              num === page ? activeBtnStyle : inactiveBtnStyle
            }`}
            onClick={() => dispatch(setItemPages(num))}
          >
            {num}
          </button>
        ))}

        {/* Last page + ellipsis if needed */}
        {endPage < pages && (
          <>
            {endPage < pages - 1 && (
              <span className="flex items-end justify-center w-4 text-gray-400 h-9">
                <MoreHorizontal size={16} />
              </span>
            )}
            <button
              className={`${baseBtnStyle} ${inactiveBtnStyle}`}
              onClick={() => dispatch(setItemPages(pages))}
            >
              {pages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          disabled={page === pages}
          className={`${baseBtnStyle} ${inactiveBtnStyle} disabled:opacity-40 disabled:cursor-not-allowed`}
          onClick={() => dispatch(setItemPages(page + 1))}
          aria-label="Next Page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
