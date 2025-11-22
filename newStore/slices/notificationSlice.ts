import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { notificationEndpoints } from "@/newService/config/apiEndpoints";

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

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success?: boolean;
}

export const fetchAllNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>(
  "notification/fetchAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Notification[]>>({
        method: "GET",
        url: notificationEndpoints.getAllNotification,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to fetch notifications"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while fetching notifications.");
      return rejectWithValue(message);
    }
  }
);

export const fetchUnreadNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>(
  "notification/fetchUnreadNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Notification[]>>({
        method: "GET",
        url: notificationEndpoints.getUnreadNotifications,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to fetch unread notifications"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while fetching unread notifications.");
      return rejectWithValue(message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "notification/markNotificationAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<null>>({
        method: "PATCH",
        url: notificationEndpoints.markNotificationAsRead(notificationId),
        tokenRequired: true,
      });

      if (response.status === 200) {
        return notificationId;
      }

      return rejectWithValue(
        response.data?.message || "Failed to mark notification as read"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while marking as read.");
      return rejectWithValue(message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "notification/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<null>>({
        method: "PATCH",
        url: notificationEndpoints.markAllNotificationAsRead,
        tokenRequired: true,
      });

      if (response.status === 200) {
        return;
      }

      return rejectWithValue(
        response.data?.message || "Failed to mark all as read"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while marking all as read.");
      return rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    resetNotifications: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch notifications";
        state.success = false;
      })
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch unread notifications";
        state.success = false;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        );
        if (notification) notification.isRead = true;
        state.success = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to mark notification as read";
        state.success = false;
      })
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.success = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to mark all as read";
        state.success = false;
      });
  },
});

export const selectNotifications = (state: RootState) => state.notification.notifications;
export const selectUnreadCount = (state: RootState) =>
  state.notification.notifications.filter((n) => !n.isRead).length;
export const selectNotificationLoading = (state: RootState) => state.notification.isLoading;
export const selectNotificationError = (state: RootState) => state.notification.error;

export const {
  addNotification,
  removeNotification,
  resetNotifications,
  clearError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
