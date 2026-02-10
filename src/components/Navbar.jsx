// src/components/NavBar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "../Pages/SignIn";

const NavBar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className=" sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 ">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">Logo</span>
            </Link>
          </div>

          {/* Sign In / Register Button */}
          {/* Sign In / Register + Profile */}
<nav className="flex items-center space-x-4">
  <Link
    to="/profile"
    className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100 text-sm"
  >
    Profile
  </Link>

  <button
    onClick={() => setIsLoginOpen(true)}
    className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition hidden md:block"
  >
    Sign In / Register
  </button>
</nav>

        </div>
      </div>
      
      {/* MODAL */}
      <SignIn open={isLoginOpen} setOpen={setIsLoginOpen} />
    </header>
  );
};

export default NavBar;
