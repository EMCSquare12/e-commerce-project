import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Home, Menu, ShoppingCart, User, Bell } from "lucide-react";
import { toggleDrawer } from "../slices/toggleSlice";
import { useGetNotificationsQuery } from "../slices/notificationsApiSlice";

const BottomNavigation = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Get Global State
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { category, brand } = useSelector((state) => state.filter);

  // Fetch Notifications for Badge
  const { data: notifications } = useGetNotificationsQuery();

  // Counters for badges
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const categoryCount = category.length + brand.length;

  // Helper to check active route for styling
  const isActive = (path) => location.pathname === path;
  const activeClass = "text-amber-500";
  const inactiveClass = "text-gray-500 hover:text-gray-900";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white ... md:hidden">
      <div className="flex items-center justify-around h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/") ? activeClass : inactiveClass}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>

        <button
          onClick={() => dispatch(toggleDrawer())}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${inactiveClass}`}
        >
          <div className="relative">
            <Menu className="w-6 h-6" />
            {categoryCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                {categoryCount}
              </span>
            )}
          </div>
        </button>

        <Link
          to="/cart"
          className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/cart") ? activeClass : inactiveClass}`}
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Cart</span>
        </Link>

        <Link
          to="/notifications"
          className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/notifications") ? activeClass : inactiveClass}`}
        >
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Updates</span>
        </Link>

        <Link
          to={userInfo ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/profile") || isActive("/login") ? activeClass : inactiveClass}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
