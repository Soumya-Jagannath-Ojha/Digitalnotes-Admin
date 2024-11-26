import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaStar, FaToggleOn, FaToggleOff, FaTrash, FaSpinner } from 'react-icons/fa';
import { MdRateReview } from 'react-icons/md';
import { getAllReviews, toggleReviewVisibility, deleteReview, getFilteredReviews } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ show: false, reviewId: null });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const toggleReviewVisibilityHandler = async (id) => {
    try {
      await toggleReviewVisibility(id);
      const updatedReviews = reviews.map(review =>
        review._id === id ? { ...review, isVisible: !review.isVisible } : review
      );
      setReviews(updatedReviews);
      toast.success(`Review visibility updated successfully!`);
    } catch (error) {
      toast.error('Failed to toggle review visibility');
    }
  };

  const deleteReviewHandler = async () => {
    try {
      await deleteReview(deleteModal.reviewId);
      setReviews(reviews.filter(review => review._id !== deleteModal.reviewId));
      toast.success('Review deleted successfully!', {
        icon: '🗑️',
      });
      closeDeleteModal();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleFilterChange = async (rating) => {
    setFilterRating(rating);
    try {
      let filteredData;
      if (rating === 0) {
        filteredData = await getAllReviews();
        toast.success('Showing all reviews');
      } else {
        filteredData = await getFilteredReviews(rating);
        toast.success(`Showing ${rating}-star reviews`);
      }
      setReviews(filteredData);
    } catch (error) {
      toast.error('Failed to filter reviews');
    }
  };

  const openDeleteModal = (id) => {
    setDeleteModal({ show: true, reviewId: id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, reviewId: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
        Customer Reviews
      </h2>

      {isAuthenticated && (
        <div className="flex justify-center mb-6 gap-2">
          <button
            onClick={() => handleFilterChange(0)}
            className={`px-4 py-2 rounded ${filterRating === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleFilterChange(rating)}
              className={`flex items-center gap-1 px-4 py-2 rounded ${filterRating === rating ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {rating} <FaStar className="text-yellow-400" />
            </button>
          ))}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg mx-auto max-w-md">
          <MdRateReview className="text-6xl md:text-7xl text-blue-600 mb-4 animate-bounce" />
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 text-center mb-2">
            No Reviews Yet
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{review.user.name}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              <p className="mb-4">{review.content}</p>
              {isAuthenticated && (
                <div className="flex justify-between">
                  <button
                    onClick={() => toggleReviewVisibilityHandler(review._id)}
                    className="flex items-center"
                  >
                    {review.isVisible ? (
                      <>
                        <FaToggleOn className="mr-1 text-green-500" />
                        <span className="text-green-500">Show</span>
                      </>
                    ) : (
                      <>
                        <FaToggleOff className="mr-1 text-red-500" />
                        <span className="text-red-500">Hide</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => openDeleteModal(review._id)}
                    className="flex items-center text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Delete Review</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={deleteReviewHandler}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-all duration-200 flex items-center gap-2"
              >
                <FaTrash className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
