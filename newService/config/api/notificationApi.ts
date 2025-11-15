/**
 * Notification API
 * Re-exports notification-related thunks and types from notificationSlice
 */
export {
  fetchAllNotifications,
  fetchUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/newStore/slices/notificationSlice";

export type { Notification, NotificationType } from "@/newStore/slices/notificationSlice";
