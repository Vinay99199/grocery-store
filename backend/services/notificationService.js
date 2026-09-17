import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, message, type = 'system') => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error);
    return null;
  }
};
