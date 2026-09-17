import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { getAdminAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get('/admin-summary', getAdminAnalytics);

export default router;
