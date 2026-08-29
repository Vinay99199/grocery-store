import api from './api';

export const createOrder = (orderData) => api.post('/api/orders', orderData);
export const getUserOrders = () => api.get('/api/orders/my-orders');
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status`, { status });
export const verifyDeliveryOTP = (orderId, otp) => api.post(`/api/orders/${orderId}/verify-otp`, { otp });
