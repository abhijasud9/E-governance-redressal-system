import api from './api';

export const notificationService = {
    getNotifications: () => api.get('/notifications'),
    getUnreadNotifications: () => api.get('/notifications/unread'),
    getUnreadCount: () => api.get('/notifications/unread/count'),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.post('/notifications/read-all'),
};
