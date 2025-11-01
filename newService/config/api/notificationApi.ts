import { apiConnector } from "@/newService/apiConnector";
import { notificationEndpoints } from "@/newService/config/apiEndpoints";
import { store } from "@/newStore";
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
  setLoading,
  setSuccess,
  setError,
} from "@/newStore/slices/notificationSlice";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const {dispatch}=store;

/**
 * FETCH ALL NOTIFICATIONS
 */
export const fetchAllNotifications = async (): Promise<boolean> => {
  dispatch(setLoading(true));

  try {
    const response = await apiConnector<ApiResponse<Notification[]>>({
      method: "GET",
      url: notificationEndpoints.getAllNotification,
      tokenRequired: true,
    });

    if (response.status !== 200 || !response.data?.data) {
      dispatch(setError(response.data?.message || "Failed to fetch notifications"));
      dispatch(setLoading(false));
      return false;
    }

    dispatch(setNotifications(response.data.data));
    dispatch(setSuccess(true));
    dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong while fetching notifications";
    dispatch(setError(message));
    dispatch(setLoading(false));
    return false;
  }
};

/**
 * FETCH UNREAD NOTIFICATIONS
 */
export const fetchUnreadNotifications = async (): Promise<boolean> => {
  dispatch(setLoading(true));

  try {
    const response = await apiConnector<ApiResponse<Notification[]>>({
      method: "GET",
      url: notificationEndpoints.getUnreadNotifications,
      tokenRequired: true,
    });

    if (response.status !== 200 || !response.data?.data) {
      dispatch(setError(response.data?.message || "Failed to fetch unread notifications"));
      dispatch(setLoading(false));
      return false;
    }

    dispatch(setNotifications(response.data.data));
    dispatch(setSuccess(true));
    dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong while fetching unread notifications";
    dispatch(setError(message));
    dispatch(setLoading(false));
    return false;
  }
};

/**
 * MARK A SINGLE NOTIFICATION AS READ
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<boolean> => {
  dispatch(setLoading(true));

  try {
    const response = await apiConnector<ApiResponse<null>>({
      method: "PUT",
      url: notificationEndpoints.markNotificationAsRead(notificationId),
      tokenRequired: true,
    });

    if (response.status !== 200) {
      dispatch(setError(response.data?.message || "Failed to mark notification as read"));
      dispatch(setLoading(false));
      return false;
    }

    dispatch(markAsRead(notificationId));
    dispatch(setSuccess(true));
    dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong while marking as read";
    dispatch(setError(message));
    dispatch(setLoading(false));
    return false;
  }
};

/**
 * MARK ALL NOTIFICATIONS AS READ
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  dispatch(setLoading(true));

  try {
    const response = await apiConnector<ApiResponse<null>>({
      method: "PUT",
      url: notificationEndpoints.markAllNotificationAsRead,
      tokenRequired: true,
    });

    if (response.status !== 200) {
      dispatch(setError(response.data?.message || "Failed to mark all as read"));
      dispatch(setLoading(false));
      return false;
    }

    dispatch(markAllAsRead());
    dispatch(setSuccess(true));
    dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong while marking all as read";
    dispatch(setError(message));
    dispatch(setLoading(false));
    return false;
  }
};
