import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUsers, FaFileAlt, FaComments, FaHeart } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-16">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 md:pt-20 pb-8 md:pb-12">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 md:mb-6 px-2">
            AdminDigiNotes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6">
            Your comprehensive administrative hub for managing digital content, users, and system operations with powerful tools and intuitive controls.
          </p>
          <div className="mt-6 md:mt-8 space-y-4 sm:space-y-0 sm:space-x-4 px-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Dashboard
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 px-4">
          <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mb-4 md:mb-6">
              <FaUsers className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">User Management</h3>
            <p className="text-sm md:text-base text-gray-600">
              Efficiently manage user accounts, permissions, and access controls with advanced administrative tools.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mb-4 md:mb-6">
              <FaFileAlt className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Document Control</h3>
            <p className="text-sm md:text-base text-gray-600">
              Comprehensive document management system for organizing and maintaining digital assets.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mb-4 md:mb-6">
              <FaComments className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Review System</h3>
            <p className="text-sm md:text-base text-gray-600">
              Monitor and manage user reviews and feedback with powerful moderation tools.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 mx-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="p-3 md:p-4">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-sm md:text-base text-gray-600">Secure Access</div>
            </div>
            <div className="p-3 md:p-4">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm md:text-base text-gray-600">System Monitoring</div>
            </div>
            <div className="p-3 md:p-4">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-sm md:text-base text-gray-600">Uptime Guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 md:py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 text-white">
            <span className="text-base md:text-lg">Made with</span>
            <FaHeart className="w-4 h-4 md:w-5 md:h-5 text-red-400 animate-[heartbeat_1.5s_ease-in-out_infinite] transition-transform duration-300" />
            <span className="text-base md:text-lg">by</span>
            <span className="text-base md:text-lg font-semibold text-yellow-300 transition-transform duration-300 animate-pulse hover:scale-110">
              shining 5stars
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;