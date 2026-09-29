import { notifications } from '../data/store.js';

export const listNotifications = (req, res) => {
  const userNotifications = notifications.filter((notification) => notification.userId === req.user.id);
  return res.status(200).json({ success: true, data: userNotifications, total: userNotifications.length });
};

export const markNotificationRead = (req, res) => {
  const notification = notifications.find((item) => item.id === Number(req.params.id));

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notification.isRead = true;
  return res.status(200).json({ success: true, data: notification });
};

export const markAllNotificationsRead = (req, res) => {
  notifications.forEach((notification) => {
    if (notification.userId === req.user.id) {
      notification.isRead = true;
    }
  });

  return res.status(200).json({ success: true, message: 'All notifications marked as read' });
};
