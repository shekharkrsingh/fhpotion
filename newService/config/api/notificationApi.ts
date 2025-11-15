import { AppDispatch } from "@/newStore/index";
import { apiConnector } from "@/newService/apiConnector";
import { notificationEndpoints } from "@/newService/config/apiEndpoints";
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
  setLoading,
  setSuccess,
  setError,
  Notification,
} from "@/newStore/slices/notificationSlice";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Re-export Notification type from slice for backward compatibility
export type { Notification };

export const fetchAllNotifications = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await apiConnector<ApiResponse<Notification[]>>({
      method: "GET",
      url: notificationEndpoints.getAllNotification,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.data) {
      dispatch(setNotifications(response.data.data));
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to fetch notifications"));
    return false;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401
        ? "Unauthorized. Please log in again."
        : "Something went wrong while fetching notifications.");
    dispatch(setError(message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchUnreadNotifications = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await apiConnector<ApiResponse<Notification[]>>({
      method: "GET",
      url: notificationEndpoints.getUnreadNotifications,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.data) {
      dispatch(setNotifications(response.data.data));
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to fetch unread notifications"));
    return false;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401
        ? "Unauthorized. Please log in again."
        : "Something went wrong while fetching unread notifications.");
    dispatch(setError(message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const markNotificationAsRead = (notificationId: string) => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await apiConnector<ApiResponse<null>>({
      method: "PATCH",
      url: notificationEndpoints.markNotificationAsRead(notificationId),
      tokenRequired: true,
    });

    if (response.status === 200) {
      dispatch(markAsRead(notificationId));
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to mark notification as read"));
    return false;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401
        ? "Unauthorized. Please log in again."
        : "Something went wrong while marking as read.");
    dispatch(setError(message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const markAllNotificationsAsRead = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await apiConnector<ApiResponse<null>>({
      method: "PATCH",
      url: notificationEndpoints.markAllNotificationAsRead,
      tokenRequired: true,
    });

    if (response.status === 200) {
      dispatch(markAllAsRead());
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to mark all as read"));
    return false;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401
        ? "Unauthorized. Please log in again."
        : "Something went wrong while marking all as read.");
    dispatch(setError(message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};