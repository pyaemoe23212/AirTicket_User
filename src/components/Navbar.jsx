// src/components/NavBar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import SignIn from "../Pages/SignIn";

const NavBar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount and when modal state changes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [isLoginOpen]); // Re-check when modal opens/closes

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    // Optional: Redirect to home or close modals
    // window.location.href = "/"; // Uncomment if you want to redirect
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">Logo</span>
            </Link>
          </div>

          {/* Conditional: Signup/Login Button or Profile Icon + Logout */}
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Profile Icon */}
                <Link
                  to="/profile"
                  className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-700 hover:bg-gray-100"
                  title="Profile" // Tooltip for accessibility
                >
                  {/* Simple user icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </Link>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              // Before login: Show Signup/Login button
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition hidden md:block"
              >
                Signup/Login
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* MODAL */}
      <SignIn open={isLoginOpen} setOpen={setIsLoginOpen} />
    </header>
  );
};

export default NavBar;
