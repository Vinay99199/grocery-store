import api from './api';

export const createProductRequest = (data) => api.post('/api/product-requests', data);
export const getProductRequests = () => api.get('/api/product-requests');
export const replyToRequest = (id, message) => api.post(`/api/product-requests/${id}/reply`, { message });
