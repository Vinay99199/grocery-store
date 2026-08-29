import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);
router.put('/profile', authMiddleware, updateProfile);

export default router;
