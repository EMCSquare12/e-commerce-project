import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { searchItem } from "../slices/filterSlice";
const SubHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const search = useSelector((state) => state.filter.keyword);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleClear = () => {
    dispatch(searchItem(""));
  };

  return (
    <>
      {isSearchOpen && (
        <div className="absolute inset-0 z-50 flex items-center w-full h-full px-4 bg-slate-900 lg:hidden animate-fade-in">
          <Search className="mr-3 text-xl text-gray-400" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => dispatch(searchItem(e.target.value))}
            type="text"
            placeholder="Search products..."
            className="flex-grow text-white placeholder-gray-500 bg-transparent border-none outline-none focus:ring-0"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 ml-2 text-gray-400 rounded-full hover:bg-slate-800 hover:text-white"
          >
            <X className="text-xl" />
          </button>
        </div>
      )}

      <div
        className={`flex-1 px-4 lg:px-8 ${
          isSearchOpen ? "invisible lg:visible" : ""
        }`}
      >
        <nav className="flex items-center justify-end gap-6 text-sm font-medium tracking-wider uppercase lg:justify-between">
          <div className="hidden gap-6 lg:flex">
            <Link to="/" className="transition hover:text-amber-500">
              Home
            </Link>
            <Link to="/blog" className="transition hover:text-amber-500">
              Blog
            </Link>
            <Link to="/contact" className="transition hover:text-amber-500">
              Contact
            </Link>
          </div>

          <div className="relative flex-row items-center justify-center hidden w-fit lg:flex">
            <input
              value={search}
              onChange={(e) => dispatch(searchItem(e.target.value))}
              type="text"
              placeholder="Search products..."
              className="w-64 py-2 pl-4 pr-10 leading-tight text-gray-900 bg-white border border-gray-300 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {!search ? (
              <Search className="absolute text-xl text-gray-500 right-3" />
            ) : (
              <X
                onClick={handleClear}
                className="absolute text-xl text-gray-500 cursor-pointer right-3 hover:text-gray-700"
              />
            )}
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-2xl text-white transition lg:hidden hover:text-amber-500"
          >
            <Search />
          </button>
        </nav>
      </div>
    </>
  );
};

export default SubHeader;
