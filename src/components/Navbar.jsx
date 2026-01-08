// src/components/NavBar.jsx
import { useState } from 'react';
import { Link } from 'react-router';

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
          <nav className="flex items-center md:flex space-x-8">
            <Link to="/sign-in" className="flex items-center">
              <button
                onClick={() => setIsLoginOpen(true)}
                className=" bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition hidden md:block"
              >
                Sign In/Register
              </button>
            </Link>
          </nav>          
        </div> 
      </div>

      {/* Simple Login Modal Placeholder (you'll replace with real SignIn/SignUp later) */}
      {/* {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Sign In / Register</h3>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-center text-gray-600 mb-6">
              Login/Register popup will go here
            </p>
            <button
              onClick={() => setIsLoginOpen(false)}
              className="w-full bg-gray-300 py-3 rounded-lg font-medium"
            >
              Close (Demo)
            </button>
          </div>
        </div> */}
      {/* )} */}
    </header>
  );
};

export default NavBar;