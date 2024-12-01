import axios from 'axios';

const api = axios.create({
    baseURL: 'https://diginotebackend.netlify.app',
    withCredentials: true
});

// Authentication routes
export const verifyAuth = async () => {
    const response = await api.get('/auth/verify');
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const sendVerificationEmail = async () => {
    const response = await api.post('/auth/send-resetcode');
    return response.data;
};

export const verifyVerificationCode = async (code) => {
    const response = await api.post('/auth/codeverify', code);
    return response.data;
};

export const resetPassword = async (resetPassword) => {
    const response = await api.patch('/auth/resetpassword', resetPassword);
    return response.data;
};

// User routes
export const getAllUsers = async () => {
    const response = await api.get('/users/allusers');
    return response.data;
};

export const searchUsers = async (query) => {
    const response = await api.get(`/users/search?query=${query}`);
    return response.data;
};

export const getUserDetails = async (userId) => {
    const response = await api.get(`/users/details/${userId}`);
    return response.data;
};

export const toggleUserBlock = async (userId) => {
    const response = await api.patch(`/users/${userId}/toggle-block`);
    return response.data;
};

// Document routes
export const getAllDocuments = async () => {
    const response = await api.get('/documents/alldocuments');
    return response.data;
};

export const uploadDocument = async (formData, options = {}) => {
    const response = await api.post('/documents/upload', formData, {
        headers: { 
            'Content-Type': 'multipart/form-data'
        },
        ...options
    });
    return response.data;
};

export const editDocument = async (id, formData) => {
    const response = await api.patch(`/documents/edit/${id}`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteDocument = async (id) => {
    const response = await api.delete(`/documents/delete/${id}`);
    return response.data;
};

export const searchDocuments = async (query) => {
    const response = await api.get(`/documents/search?q=${query}`);
    return response.data;
};

export const getDocumentsBySemester = async (semester) => {
    const response = await api.get(`/documents/${semester}`);
    return response.data;
};

// Review routes
export const getAllReviews = async () => {
    const response = await api.get('/reviews/allreviews');
    return response.data;
};

export const toggleReviewVisibility = async (reviewId) => {
    const response = await api.patch(`/reviews/${reviewId}/toggleshowhide`);
    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/reviews/delete/${reviewId}`);
    return response.data;
};

export const getFilteredReviews = async (rating) => {
    const response = await api.get(`/reviews/${rating}`);
    return response.data;
};

export default api;
