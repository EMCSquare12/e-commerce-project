import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  FileText,
  Tag,
  Users,
  BarChart2,
  Megaphone,
  Settings,
  X,
  Store,
} from "lucide-react";
import { toggleSidebar } from "../slices/toggleSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { openSidebar } = useSelector((state) => state.toggle);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Orders", icon: FileText, path: "/admin/orders" },
    { name: "Products", icon: Tag, path: "/admin/products" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Analytics", icon: BarChart2, path: "/admin/analytics" },
    { name: "Marketing", icon: Megaphone, path: "/admin/marketing" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  // Helper to close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar(true));
    }
  };

  return (
    <>
      {/* --- Mobile Backdrop --- */}
      {/* Only visible on mobile when sidebar is open */}
      <div
        onClick={() => dispatch(toggleSidebar(false))}
        className={`fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* --- Sidebar Aside --- */}
      <aside
        className={`fixed top-0 left-0 z-40 flex flex-col w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-amber-500 transition-colors">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              ProShop
            </span>
          </Link>

          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => dispatch(toggleSidebar(false))}
            className="p-1 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive
                      ? "text-amber-400"
                      : "text-gray-400 group-hover:text-amber-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Optional Footer Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
            <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full bg-amber-500">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@proshop.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
