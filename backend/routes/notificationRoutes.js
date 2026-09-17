import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markNotificationAsRead);
router.patch('/read-all', markAllNotificationsAsRead);

export default router;
