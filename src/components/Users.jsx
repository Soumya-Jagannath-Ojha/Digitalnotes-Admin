import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaUserLock, FaUserCheck, FaInfoCircle, FaSearch, FaTimes, FaCircle, FaSpinner, FaUsers } from 'react-icons/fa';
import { getAllUsers, searchUsers, toggleUserBlock } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).split('/').join('-');
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    try {
      if (value.trim()) {
        const results = await searchUsers(value);
        setUsers(results);
      } else {
        fetchUsers();
      }
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await toggleUserBlock(userId);
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, block: !user.block };
        }
        return user;
      }));
      toast[response.user.block ? 'error' : 'success'](response.message);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const UserDetailsModal = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
          >
            <FaTimes size={24} />
          </button>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pr-8">
            User Details
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Name', value: user.name },
              { label: 'Email', value: user.email },
              { label: 'Registration No', value: user.regdNo },
              { label: 'Date of Birth', value: formatDate(user.dob) },
              { label: 'Gender', value: user.gender },
              { label: 'Phone Number', value: user.phno },
              { label: 'Branch', value: user.branch },
              { label: 'Semester', value: user.sem }
            ].map((detail, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-row justify-between items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">{detail.label}:</span>
                  <span className="text-sm font-semibold text-gray-800">{detail.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 z-10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-2">
          Users Management
        </h2>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name or registration number..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute right-3 top-4 text-gray-400" />
        </div>
      </div>

      <div className="shadow-lg rounded-lg overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-4 px-6 text-left font-semibold">Sl No</th>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Regd No</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {users.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium flex items-center">
                      <FaCircle className={`mr-2 text-xs ${user.block ? 'text-red-500' : 'text-green-500'}`} />
                      {user.name}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{user.regdNo}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className={`${user.block ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} 
                                text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center min-w-[100px]`}
                          onClick={() => handleBlockUser(user._id)}
                        >
                          {user.block ? (
                            <><FaUserCheck className="mr-1" /> Unblock</>
                          ) : (
                            <><FaUserLock className="mr-1" /> Block</>
                          )}
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-300 flex items-center"
                          onClick={() => setSelectedUser(user)}
                        >
                          <FaInfoCircle className="mr-1" /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] py-8 sm:py-12 md:py-16 px-4">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
              <div className="mb-4 sm:mb-6">
                <FaUsers className="mx-auto text-6xl sm:text-7xl md:text-8xl text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                No Users Found
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6 px-2 sm:px-4">
                {searchTerm ?
                  `No users found matching "${searchTerm}"` :
                  "There are no users registered in the system yet."
                }
              </p>
              { !searchTerm && (<div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm md:text-base text-gray-500">
                  New users will appear here once they register in the system.
                </p>
              </div>)}
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Users;
