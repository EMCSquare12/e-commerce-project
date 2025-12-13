import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Tag,
  Users,
  BarChart2,
  Megaphone,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Orders", icon: FileText, path: "/admin/orders" },
    { name: "Products", icon: Tag, path: "/admin/products" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Analytics", icon: BarChart2, path: "/admin/analytics" },
    { name: "Marketing", icon: Megaphone, path: "/admin/marketing" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-64 h-screen bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center h-16 px-8 border-b border-gray-100">
        {/* <div className="p-1 mr-3 text-white bg-blue-600 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div> */}
        <span className="flex items-center gap-2 text-2xl font-bold tracking-wide">
          ProShop
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600" // Active State (Blue bg, Blue text)
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" // Inactive State
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
