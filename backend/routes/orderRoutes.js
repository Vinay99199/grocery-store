import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Customer routes
router.use(authMiddleware);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.delete('/:id', cancelOrder);

// Admin routes
router.put('/:id/status', adminMiddleware, updateOrderStatus);

export default router;
