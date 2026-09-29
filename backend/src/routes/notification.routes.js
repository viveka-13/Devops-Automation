import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { listNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/notifications', authenticate, listNotifications);
router.patch('/notifications/:id/read', authenticate, markNotificationRead);
router.patch('/notifications/read-all', authenticate, markAllNotificationsRead);

export default router;
