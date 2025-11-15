import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";

export type NotificationType = "SYSTEM" | "INFO" | "UPDATE" | "ALERT" | "EMERGENCY";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  success: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.success = true;
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) notification.isRead = true;
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetNotifications: () => initialState,
  },
});

export const selectNotifications = (state: RootState) => state.notification.notifications;
export const selectUnreadCount = (state: RootState) =>
  state.notification.notifications.filter((n) => !n.isRead).length;
export const selectNotificationLoading = (state: RootState) => state.notification.isLoading;
export const selectNotificationError = (state: RootState) => state.notification.error;

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setLoading,
  setSuccess,
  setError,
  resetNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
