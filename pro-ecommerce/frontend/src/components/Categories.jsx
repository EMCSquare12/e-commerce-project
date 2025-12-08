import { useGetProductCategoriesQuery } from "../slices/productsApiSlice";
import Loader from "./Loader";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../slices/filterSlice";
import { useEffect, useRef } from "react";

const Categories = () => {
  const selectedCategory = useSelector((state) => state.filter.category);
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetProductCategoriesQuery();
  const categoryRef = useRef(null);

  const handleCategories = (category) => {
    dispatch(setCategory(category)); // toggle add/remove
  };

  useEffect(() => {}, []);

  return (
    <div className="absolute flex flex-col w-full gap-4 px-20 py-4 bg-white shadow">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <ul className="grid grid-cols-3 gap-y-4 gap-x-20">
          {data?.map((category) => (
            <li key={category} className="flex items-center gap-2">
              <input
                id={category}
                type="checkbox"
                className="w-4 h-4 accent-amber-500"
                checked={selectedCategory?.includes(category)}
                onChange={() => handleCategories(category)}
              />
              <label
                htmlFor={category}
                className="text-sm font-medium text-gray-500"
              >
                {category}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;
