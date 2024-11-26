import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaFileAlt, FaComments, FaTimes, FaChartBar, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Sidebar = ({ sidebarCollapsed, toggleCollapse, sidebarOpen, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  const renderNavLink = (icon, text, path, exact = false) => {
    const handleClick = () => {
      if (isMobile) {
        toggleSidebar();
      }
    };

    if (path === '/logout') {
      return (
        <button
          data-tooltip-id="sidebar-tooltip"
          data-tooltip-content={sidebarCollapsed && !isMobile ? text : ''}
          onClick={() => {
            handleLogout();
            if (isMobile) toggleSidebar();
          }}
          className={`
            flex items-center w-full py-3 px-4 rounded-lg transition-all duration-300
            text-gray-100 hover:bg-indigo-600 hover:shadow-lg
            ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}
          `}
        >
          {icon} {(!sidebarCollapsed || isMobile) && <span className="font-semibold">{text}</span>}
        </button>
      );
    }

    return (
      <NavLink
        to={path}
        end={exact}
        onClick={handleClick}
        data-tooltip-id="sidebar-tooltip"
        data-tooltip-content={sidebarCollapsed && !isMobile ? text : ''}
        className={({ isActive }) => `
          flex items-center w-full py-3 px-4 rounded-lg transition-all duration-300
          hover:bg-indigo-600 hover:shadow-lg
          ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-100'} 
          ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}
        `}
      >
        {icon} {(!sidebarCollapsed || isMobile) && <span className="font-semibold">{text}</span>}
      </NavLink>
    );
  };

  const sidebarContent = (
    <nav className="space-y-2">
      {renderNavLink(<FaChartBar className={`inline-block ${sidebarCollapsed && !isMobile ? 'text-xl' : 'mr-3 text-lg'}`} />, 'Dashboard', '/dashboard', true)}
      {renderNavLink(<FaUsers className={`inline-block ${sidebarCollapsed && !isMobile ? 'text-xl' : 'mr-3 text-lg'}`} />, 'Users', '/dashboard/users')}
      {renderNavLink(<FaFileAlt className={`inline-block ${sidebarCollapsed && !isMobile ? 'text-xl' : 'mr-3 text-lg'}`} />, 'Documents', '/dashboard/documents')}
      {renderNavLink(<FaComments className={`inline-block ${sidebarCollapsed && !isMobile ? 'text-xl' : 'mr-3 text-lg'}`} />, 'Reviews', '/dashboard/reviews')}
      {renderNavLink(<FaSignOutAlt className={`inline-block ${sidebarCollapsed && !isMobile ? 'text-xl' : 'mr-3 text-lg'}`} />, 'Logout', '/logout')}
      <Tooltip
        id="sidebar-tooltip"
        place="right"
        className="z-50"
        style={{
          backgroundColor: '#4F46E5',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      />
    </nav>
  );

  const sidebarClasses = `
    bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-700
    text-white shadow-xl transition-all duration-300 ease-in-out z-20
    ${sidebarCollapsed && !isMobile ? 'w-16' : 'w-64'} space-y-6 py-7 px-2 fixed top-16 left-0 bottom-0
  `;

  return isMobile ? (
    <div className={`${sidebarClasses} transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button onClick={toggleSidebar} className="absolute top-3 right-3 p-2 rounded-full hover:bg-indigo-600 transition-colors duration-200">
        <FaTimes className="w-5 h-5" />
      </button>
      {sidebarContent}
    </div>
  ) : (
    <div className={`hidden md:block ${sidebarClasses} transform translate-x-0`}>
      {sidebarContent}
      <button
        onClick={toggleCollapse}
        className="absolute bottom-4 right-4 bg-indigo-600 p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
      >
        {sidebarCollapsed ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default Sidebar;
