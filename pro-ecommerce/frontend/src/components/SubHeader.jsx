import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const SubHeader = () => {
  return (
    <div>
      <nav className="flex items-center gap-6 text-sm font-medium tracking-wider uppercase">
        <Link
          to="/cart"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Home
        </Link>
        <Link
          to="/cart"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Products
        </Link>
        {/* <Link
          to="/cart"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Blog
        </Link> */}
        <Link
          to="/cart"
          className="relative flex items-center gap-1 transition hover:text-amber-500"
        >
          Contact
        </Link>
        <div className="relative flex flex-row items-center justify-center w-fit">
          <input
            type="text"
            className="w-full py-2 pl-3 pr-8 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <IoSearch className="absolute text-xl text-gray-700 right-2 hover:text-gray-500" />
        </div>
      </nav>
    </div>
  );
};

export default SubHeader;
