import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSearch, FaFilePdf, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getAllDocuments, uploadDocument, deleteDocument, editDocument, searchDocuments, getDocumentsBySemester } from '../services/api';

const Documents = () => {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: '', file: null, semester: '', branch: '', image: null });
  const [editingDocument, setEditingDocument] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsPageLoading(true);
      try {
        const data = await getAllDocuments();
        setDocuments(data);
      } catch (error) {
        toast.error('Failed to fetch documents');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const searchDocs = async () => {
      if (searchQuery) {
        try {
          const results = await searchDocuments(searchQuery);
          setDocuments(results);
        } catch (error) {
          toast.error('Search failed');
        }
      } else {
        const data = await getAllDocuments();
        setDocuments(data);
      }
    };

    if (isAuthenticated) {
      const debounceTimer = setTimeout(() => {
        searchDocs();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, isAuthenticated]);

  useEffect(() => {
    const fetchBySemester = async () => {
      if (selectedSemester) {
        try {
          const results = await getDocumentsBySemester(selectedSemester);
          setDocuments(results);
        } catch (error) {
          toast.error('Failed to filter by semester');
        }
      } else {
        const data = await getAllDocuments();
        setDocuments(data);
      }
    };

    if (isAuthenticated) {
      fetchBySemester();
    }
  }, [selectedSemester, isAuthenticated]);

  
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleAddDocument = () => {
    setShowAddModal(true);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setNewDocument({ name: '', file: null, semester: '', branch: '', image: null });
    setEditingDocument(null);
    setImagePreview(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal) {
      setEditingDocument({ ...editingDocument, [name]: value });
    } else {
      setNewDocument({ ...newDocument, [name]: value });
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        if (showEditModal) {
          setEditingDocument({ ...editingDocument, image: file });
        } else {
          setNewDocument({ ...newDocument, image: file });
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      toast.success('Image selected!');
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= 5 * 1024 * 1024) {
        if (showEditModal) {
          setEditingDocument({ ...editingDocument, file: file });
        } else {
          setNewDocument({ ...newDocument, file: file });
        }
        toast.success('PDF selected!');
      } else {
        toast.error('File size should be less than 5MB');
      }
    } else {
      toast.error('Please select a PDF document only');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (showEditModal) {
        formData.append('name', editingDocument.name);
        formData.append('semester', editingDocument.semester);
        formData.append('branch', editingDocument.branch);

        if (editingDocument.file) {
          formData.append('file', editingDocument.file);
        }

        if (editingDocument.image) {
          formData.append('image', editingDocument.image);
        }

        const updatedDoc = await editDocument(editingDocument._id, formData);
        setDocuments(docs => docs.map(doc =>
          doc._id === editingDocument._id ? updatedDoc : doc
        ));
        toast.success('Document updated successfully!');
      } else {
        formData.append('name', newDocument.name);
        formData.append('semester', newDocument.semester);
        formData.append('branch', newDocument.branch);
        
        if (newDocument.file) {
          formData.append('file', newDocument.file);
        }

        if (newDocument.image) {
          formData.append('image', newDocument.image);
        }

        const response = await uploadDocument(formData);
        setDocuments(prev => [...prev, response]);
        toast.success('Document added successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setImagePreview(doc.image);
    setShowEditModal(true);
  };

  const handleDelete = (doc) => {
    setDocumentToDelete(doc);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDocument(documentToDelete._id);
      setDocuments(docs => docs.filter(doc => doc._id !== documentToDelete._id));
      toast.success('Document deleted successfully!');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col items-center mb-8 px-4">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-2">
          Document Management
        </h2>
        <div className="flex flex-col md:flex-row w-full max-w-2xl gap-4 justify-end items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Search by name or semester..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <select
            className="w-full md:w-64 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSemester}
            onChange={handleSemesterChange}
          >
            <option value="">Filter by Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
              <option key={semester} value={semester.toString()}>
                Semester {semester}
              </option>
            ))}
          </select>
          <button
            className="w-full md:w-auto bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:from-green-500 hover:to-green-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
            onClick={handleAddDocument}
          >
            <FaPlus className="text-lg" />
            <span>Add New Document</span>
          </button>
        </div>
      </div>

      {isPageLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        documents.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Sl No</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Size</th>
                <th className="py-3 px-6 text-left">Semester</th>
                <th className="py-3 px-6 text-left">Branch</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {documents.map((doc, index) => (
                <tr key={doc._id} className="border-b border-gray-200 hover:bg-gray-100 flex flex-col md:table-row">
                  <td className="py-2 px-6 text-left whitespace-nowrap md:table-cell">
                    <span className="font-bold md:hidden">Sl No: </span>{index + 1}
                  </td>
                  <td className="py-2 px-6 text-left md:table-cell">
                    <div className="flex items-center">
                      <span className="font-bold md:hidden mr-2">Name: </span>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {doc.image ? (
                            <img
                              src={doc.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shadow-sm"
                            />
                          ) : (
                            <FaFilePdf className="w-10 h-10 text-red-500" />
                          )}
                        </div>
                        <a
                          href={doc.driveViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          {doc.name}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-6 text-left md:table-cell">
                    <span className="font-bold md:hidden">Size: </span>{doc.size}
                  </td>
                  <td className="py-2 px-6 text-left md:table-cell">
                    <span className="font-bold md:hidden">Semester: </span>{doc.semester}
                  </td>
                  <td className="py-2 px-6 text-left md:table-cell">
                    <span className="font-bold md:hidden">Branch: </span>{doc.branch}
                  </td>
                  <td className="py-2 px-6 text-left md:text-center md:table-cell">
                    <div className="flex items-center md:justify-center">
                      <span className="font-bold md:hidden mr-4">Actions: </span>
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transition duration-200 flex items-center"
                          onClick={() => handleEdit(doc)}
                        >
                          <FaEdit className="mr-1" /> <span>Edit</span>
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-200 flex items-center"
                          onClick={() => handleDelete(doc)}
                        >
                          <FaTrash className="mr-1" /> <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
              <div className="mb-6">
                <FaFileAlt className="mx-auto h-24 w-24 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Documents Found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : "Get started by adding your first document"}
              </p>
              { !searchQuery && (<button
                onClick={handleAddDocument}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Add Your First Document
              </button>)}
            </div>
          </div>
        )
      )}

      {(showAddModal || showEditModal) && !isLoading && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-modalIn">
            <div className="border-b p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {showEditModal ? 'Edit Document' : 'Add New Document'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Document Name</label>
                <input
                  type="text"
                  name="name"
                  value={showEditModal ? editingDocument.name : newDocument.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Document Thumbnail</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all duration-200 cursor-pointer"
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative flex-shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Upload File (Max 5MB)</label>
                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all duration-200 cursor-pointer"
                  required={!showEditModal}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Semester</label>
                  <select
                    name="semester"
                    value={showEditModal ? editingDocument.semester : newDocument.semester}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem.toString()}>Sem {sem}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Branch</label>
                  <select
                    name="branch"
                    value={showEditModal ? editingDocument.branch : newDocument.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select</option>
                    {['All', 'CSE', 'EE', 'EEE', 'CE', 'ME'].map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
                >
                  {showEditModal ? 'Update' : 'Add'} Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 p-6 animate-modalIn">
            <div className="text-center p-4">
              <FaSpinner className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">
                {showEditModal ? 'Updating Document...' : 'Adding New Document...'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {showEditModal ? 'Please wait while update your document.' : 'Please wait while upload your document.'}
              </p>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 p-6 animate-modalIn">

            {isDeleting ? (
              <div className="text-center p-4">
                <FaSpinner className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Deleting...</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <FaTrash className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Delete Document</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaTrash className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
