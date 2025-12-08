import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setItemPages } from "../slices/filterSlice";

const Pagination = ({ page, pages }) => {
  const dispatch = useDispatch();
  //   const location = useLocation();
  //   const queryParams = new URLSearchParams(location.search);

  if (pages <= 1) return null; // No pagination needed

  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => {
            dispatch(setItemPages(page - 1));
          }}
        >
          Prev
        </button>

        {/* Page numbers */}
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() => {
              dispatch(setItemPages(x + 1));
            }}
            className={`px-3 py-1 border rounded 
              ${page === x + 1 ? "bg-amber-500 text-white" : ""}
            `}
          >
            {x + 1}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={page === pages}
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => {
            dispatch(setItemPages(page + 1));
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
