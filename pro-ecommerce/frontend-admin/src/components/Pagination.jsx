const Pagination = ({ page, pages, setItemPages }) => {
  const maxButtons = 5; // Maximum page buttons to show at once
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

  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setItemPages(page - 1)}
        >
          Prev
        </button>

        {/* First page + ellipsis if needed */}
        {startPage > 1 && (
          <>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setItemPages(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded ${
              num === page ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setItemPages(num)}
          >
            {num}
          </button>
        ))}

        {/* Last page + ellipsis if needed */}
        {endPage < pages && (
          <>
            {endPage < pages - 1 && <span className="px-2">...</span>}
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setItemPages(pages)}
            >
              {pages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          disabled={page === pages}
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setItemPages(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
