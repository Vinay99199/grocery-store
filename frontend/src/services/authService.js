import api from './api';

export const registerUser = (userData) => api.post('/api/auth/register', userData);
export const loginUser = (credentials) => api.post('/api/auth/login', credentials);
export const logoutUser = () => api.post('/api/auth/logout');
export const getCurrentUser = () => api.get('/api/auth/me');
