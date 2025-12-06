import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useMemo } from "react";
import Loader from "./Loader";

const Categories = () => {
  const { data, isLoading } = useGetProductsQuery({});

  // Extract unique categories safely
  const categories = useMemo(() => {
    if (!data?.products) return [];
    return [...new Set(data.products.map((p) => p.category))];
  }, [data]);

  if (isLoading) return <Loader />;
  return (
    <div className="absolute flex flex-col w-full gap-4 px-20 py-4 bg-white shadow">
      {/* Select All */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          id="select-all"
          className="w-4 h-4 accent-amber-500"
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium text-gray-500"
        >
          Select all
        </label>
      </div>

      {/* Categories List */}
      <ul className="grid grid-cols-3 gap-y-4 gap-x-20">
        {categories.map((category) => (
          <li key={category} className="flex items-center gap-2">
            <input
              id={category}
              type="checkbox"
              className="w-4 h-4 accent-amber-500"
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
    </div>
  );
};

export default Categories;
