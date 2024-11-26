import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold tracking-wider hover:text-gray-200 transition duration-300 ease-in-out">
              DigiNotes
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex">
            <div className="ml-10 flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-100 hover:bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium tracking-wide uppercase hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-100 hover:bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium tracking-wide uppercase hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <MdDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-100 hover:bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium tracking-wide uppercase hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-indigo-600 focus:outline-none transition"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 z-40 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block text-gray-100 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-100 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-gray-100 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
