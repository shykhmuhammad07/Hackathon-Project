// Updated Navbar.jsx with new theme
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Config/Firebase";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut(auth)
        .then(() => {
          alert("Logged Out! You have been logged out successfully.");
          navigate("/login");
        })
        .catch((error) => {
          alert("Error during logout: " + error.message);
        });
    }
  };

  return (
    <nav className="bg-gray-900 shadow-2xl shadow-purple-500/20 sticky top-0 z-50 border-b border-purple-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <Link className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider hover:from-purple-300 hover:to-pink-300 transition-all" to="/">
            PitchCraft
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link 
              to="/dash" 
              className="text-purple-300 hover:text-white font-medium px-4 py-2 rounded-xl transition-all hover:bg-gray-800 border border-transparent hover:border-purple-400/30"
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className="text-purple-300 hover:text-white font-medium px-4 py-2 rounded-xl transition-all hover:bg-gray-800 border border-transparent hover:border-purple-400/30"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-purple-300 hover:text-white font-medium px-4 py-2 rounded-xl transition-all hover:bg-gray-800 border border-transparent hover:border-purple-400/30"
            >
              Contact
            </Link>
            <Link 
              to="/create" 
              className="text-purple-300 hover:text-white font-medium px-4 py-2 rounded-xl transition-all hover:bg-gray-800 border border-transparent hover:border-purple-400/30"
            >
              Create
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-5 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Logout
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-purple-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-400 border border-purple-400/20"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800 pb-2 border-t border-purple-400/20`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
          <Link to="/dash" className="text-purple-300 hover:bg-gray-700 hover:text-white block px-3 py-3 rounded-xl text-base font-medium w-11/12 text-center border border-transparent hover:border-purple-400/30">
            Dashboard
          </Link>
          <Link to="/about" className="text-purple-300 hover:bg-gray-700 hover:text-white block px-3 py-3 rounded-xl text-base font-medium w-11/12 text-center border border-transparent hover:border-purple-400/30">
            About
          </Link>
          <Link to="/contact" className="text-purple-300 hover:bg-gray-700 hover:text-white block px-3 py-3 rounded-xl text-base font-medium w-11/12 text-center border border-transparent hover:border-purple-400/30">
            Contact
          </Link>
          <Link to="/create" className="text-purple-300 hover:bg-gray-700 hover:text-white block px-3 py-3 rounded-xl text-base font-medium w-11/12 text-center border border-transparent hover:border-purple-400/30">
            Create
          </Link>
          <button 
            onClick={handleLogout} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 w-11/12 mt-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;