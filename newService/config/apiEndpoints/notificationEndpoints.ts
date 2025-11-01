import { API_BASE_URL } from "../apiConfig";

export const notificationEndpoints = {
  getAllNotification: `${API_BASE_URL}api/v1/notification`,
  getUnreadNotifications: `${API_BASE_URL}api/v1/notification/unread`,
  markNotificationAsRead: (id: string) => `${API_BASE_URL}api/v1/notification/${id}/read`,
  markAllNotificationAsRead: `${API_BASE_URL}api/v1/notification/read-all`,
};
