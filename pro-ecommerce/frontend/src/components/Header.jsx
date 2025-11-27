import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import {
  FaCaretDown,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import SubHeader from "./SubHeader";

const Header = () => {
  // 1. Get cart info from Redux
  const { cartItems } = useSelector((state) => state.cart);

  // 2. Get user info from Redux (This checks if you are logged in)
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hook for the logout API call
  const [logoutApiCall] = useLogoutMutation();

  // State for the dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // 1. Call backend to destroy cookie
      dispatch(logout()); // 2. Clear local Redux state
      navigate("/login"); // 3. Redirect to login page
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 text-white shadow-md bg-slate-900">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-wide"
        >
          <i className="fa-solid fa-shop text-amber-500"></i>
          <span>ProShop</span>
        </Link>
        <SubHeader/>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium tracking-wider uppercase">
          <Link
            to="/cart"
            className="relative flex items-center gap-1 transition hover:text-amber-500"
          >
            <FaShoppingCart /> Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-amber-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* 3. Conditional Rendering: Check if userInfo exists */}
          {userInfo ? (
            // LOGGED IN VIEW: Show Name & Dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 transition hover:text-amber-500 focus:outline-none"
              >
                {userInfo.name} <FaCaretDown />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-20 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="flex items-center block w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUserCircle /> Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center block w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // LOGGED OUT VIEW: Show Sign In Link
            <Link
              to="/login"
              className="flex items-center gap-1 transition hover:text-amber-500"
            >
              <FaUser /> Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
