import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearCategories } from "../slices/categorySlice";

const SubHeader = ({ onClick }) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dispatch = useDispatch();

  const isCategoriesOpen = (onClick) => {
    onClick(onClick);
    setCategoriesOpen(!categoriesOpen);
    dispatch(clearCategories());
  };
  return (
    <div>
      <nav className="flex items-center gap-6 text-sm font-medium tracking-wider uppercase">
        <Link
          to="/"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Home
        </Link>
        {/* <Link
          to="/cart"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Products
        </Link> */}
        <Link
          to="/cart"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Blog
        </Link>
        <Link
          to="/cart"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Contact
        </Link>
        <div className="relative flex flex-row items-center justify-center w-fit">
          <input
            type="text"
            className="w-full px-10 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <IoSearch className="absolute text-xl text-gray-500 left-2 " />
          <IoFilter
            className={`absolute text-xl  cursor-pointer right-2 hover:text-amber-500 ${
              categoriesOpen ? "text-amber-500" : "text-gray-500"
            }`}
            onClick={() => isCategoriesOpen(onClick)}
          />
        </div>
      </nav>
    </div>
  );
};

export default SubHeader;
