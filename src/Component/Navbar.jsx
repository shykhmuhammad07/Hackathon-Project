// Navbar.jsx - Updated with unified styling
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
    <nav className="bg-slate-950 shadow-2xl shadow-cyan-500/20 sticky top-0 z-50 border-b border-cyan-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <Link className="text-3xl font-extrabold text-cyan-400 tracking-wider hover:text-cyan-300 transition-colors" to="/">
            NeonChat
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link 
              to="/dash" 
              className="text-cyan-400 hover:text-cyan-200 font-medium px-4 py-2 rounded-xl transition-all hover:bg-slate-800 border border-transparent hover:border-cyan-400/30"
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-fuchsia-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50"
            >
              Logout
            </button>
            
            {/* Cart Icon */}
            <Link to="/cart" className="text-cyan-400 hover:text-cyan-200 text-xl transition-colors p-2 rounded-lg hover:bg-slate-800">
              <i className="fa-solid fa-cart-shopping"></i>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-cyan-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 border border-cyan-400/20"
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
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-slate-900 pb-2 border-t border-cyan-400/20`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
          <Link to="/dash" className="text-cyan-400 hover:bg-slate-800 hover:text-white block px-3 py-3 rounded-xl text-base font-medium w-11/12 text-center border border-transparent hover:border-cyan-400/30">
            Dashboard
          </Link>
          <button 
            onClick={handleLogout} 
            className="bg-fuchsia-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-500/30 w-11/12 mt-2"
          >
            Logout
          </button>
          <Link to="/cart" className="text-cyan-400 hover:text-cyan-200 text-lg py-3 transition-colors w-11/12 text-center rounded-xl hover:bg-slate-800">
            <i className="fa-solid fa-cart-shopping mr-2"></i> Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;