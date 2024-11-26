import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaBars, FaUsers, FaFileAlt, FaComments } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Users from './Users';
import Documents from './Documents';
import Reviews from './Reviews';

const DashboardHome = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Link to="/dashboard/users" className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative border border-blue-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">User Management</h2>
      <p className="text-blue-600/80 leading-relaxed">This section allows administrators to view detailed user information, including profile data and activity history. Administrators can also manage user accounts by blocking or unblocking users as needed to maintain platform integrity and user compliance.</p>
      <div className="flex justify-end">
        <div className="bg-blue-500/10 p-3 rounded-full">
          <FaUsers className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </Link>

    <Link to="/dashboard/documents" className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative border border-emerald-200">
      <h2 className="text-2xl font-bold mb-4 text-emerald-700">Document Management</h2>
      <p className="text-emerald-600/80 leading-relaxed">The document management system provides comprehensive control over digital assets. Administrators can add new documents, edit existing document, and remove documents. This ensures that the document repository remains current and valuable to users.</p>
      <div className="flex justify-end">
        <div className="bg-emerald-500/10 p-3 rounded-full">
          <FaFileAlt className="w-8 h-8 text-emerald-600" />
        </div>
      </div>
    </Link>

    <Link to="/dashboard/reviews" className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative border border-purple-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Review Management</h2>
      <p className="text-purple-600/80 leading-relaxed">Review management functionality enables administrators to oversee user-generated content. They can view all submitted reviews, approve or reject them based on content guidelines, and delete inappropriate or spam reviews.</p>
      <div className="flex justify-end">
        <div className="bg-purple-500/10 p-3 rounded-full">
          <FaComments className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </Link>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex flex-col md:flex-row bg-gray-200 h-screen pt-16">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden w-fit">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          toggleCollapse={toggleCollapse}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={true}
        />

        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          toggleCollapse={toggleCollapse}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={false}
        />

        {/* Main content */}
        <div className={`flex-1 overflow-x-hidden overflow-y-auto p-4 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-200`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/documents" element={<Documents />} />
            <Route path="/dashboard/reviews" element={<Reviews />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
