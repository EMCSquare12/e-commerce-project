const Categories = () => {
  const categories = [
    "Computers & Laptops",
    "Mobile Phones & Tablets",
    "Wearables",
    "Home Appliances",
    "Audio Devices",
    "Televisions & Displays",
    "Gaming",
    "Cameras & Photography",
    "Networking Devices",
    "Smart Home Devices",
    "PC Components",
    "Computer Peripherals",
    "Drones & RC Electronics",
    "Car Electronics",
    "Industrial Electronics",
  ];

  return (
    <div className="absolute flex flex-col items-start w-full h-auto gap-4 px-20 py-4 bg-white shadow ">
      <div className="flex flex-row items-start justify-start gap-2 mb-2 w-fit">
        <input
          type="checkbox"
          className="w-4 h-4 border-amber-500 accent-amber-500"
          id="select-all"
        />
        <label
          htmlFor="select-all"
          className="flex flex-row gap-2 text-sm font-medium text-gray-500"
        >
          Select all
        </label>
      </div>
      <ul className="grid grid-cols-3 gap-y-4 gap-x-20 grid-row-5 w-fit h-fit">
        {categories.map((category, index) => (
          <li
            className="flex flex-row gap-2 text-sm font-medium text-gray-500"
            key={index}
          >
            <input
              id={category}
              type="checkbox"
              className="w-4 h-4 border-amber-500 accent-amber-500"
            />
            <label htmlFor={category}>{category}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Categories;
