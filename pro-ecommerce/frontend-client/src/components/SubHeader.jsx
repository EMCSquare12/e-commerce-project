import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { searchItem } from "../slices/filterSlice";

const SubHeader = () => {
  const search = useSelector((state) => state.filter.keyword);
  const dispatch = useDispatch();
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
            value={search}
            onChange={(e) => dispatch(searchItem(e.target.value))}
            type="text"
            className="py-2 pl-4 pr-10 leading-tight text-gray-700 border rounded appearance-none w-80 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {!search ? (
            <IoSearch className="absolute text-xl text-gray-500 right-2 " />
          ) : (
            <IoCloseSharp
              onClick={() => dispatch(searchItem(""))}
              className="absolute text-xl text-gray-500 right-2 hover:text-gray-600"
            />
          )}
        </div>
      </nav>
    </div>
  );
};

export default SubHeader;
