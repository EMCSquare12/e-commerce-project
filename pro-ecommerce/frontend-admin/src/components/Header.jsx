import { Search, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 z-10 flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 left-64">
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <button className="relative p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
          <span className="sr-only">View notifications</span>
          <Bell className="w-6 h-6" />
          {/* Red Dot Badge */}
          <span className="absolute block w-2 h-2 bg-red-500 rounded-full top-1 right-1 ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 cursor-pointer">
          {/* Placeholder Avatar Image */}
          <img
            className="object-cover w-8 h-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User profile"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
