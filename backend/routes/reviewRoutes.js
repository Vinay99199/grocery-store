import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

// Get all reviews for a product
router.get('/', getReviews);

// Protected routes
router.use(authMiddleware);

// Add review
router.post('/', addReview);

// Update review
router.put('/', updateReview);

// Delete review
router.delete('/', deleteReview);

export default router;
