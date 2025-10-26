import { setLoading, setSuccess, setError, setNotification } from "@/redux/slices/notificationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiConnector } from "../apiConnector";
import apiEndpoints from "@/apiFactory";
import { store } from "@/redux/store";

export const getAllNotification = async (dispatch: any): Promise<boolean> => {
    try {
        dispatch(setLoading(true));

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            dispatch(setError("Authentication token not found"));
            dispatch(setLoading(false));
            return false;
        }

        const response = await apiConnector("GET", apiEndpoints.getAllNotification, null, {
            Authorization: `Bearer ${token}`,
        });

        console.log("Get All Notification Response:", response);

        if (response.status === 200) {
            console.log("Notification fetched successfully");
            console.log("Response data:", response.data);
            
            // Make sure we're setting the correct data structure
            if (response.data && response.data.data) {
                dispatch(setNotification(response.data.data));
            } else if (response.data) {
                dispatch(setNotification(response.data));
            } else {
                console.error("Invalid response structure:", response);
                dispatch(setError("Invalid response format"));
                dispatch(setLoading(false));
                return false;
            }
            
            dispatch(setSuccess(true));
            dispatch(setLoading(false));
            return true;
        } else {
            console.error("Failed to fetch Notification:", response.data);
            dispatch(setError("Failed to fetch Notification"));
            dispatch(setLoading(false));
            return false;
        }
    } catch (error) {
        console.error("Error in getAllNotification API:", error);
        dispatch(setError("Something went wrong"));
        dispatch(setLoading(false));
        return false;
    }
};

export const markAllNotificationAsRead = async (dispatch: any): Promise<boolean> => {
    try {
        dispatch(setLoading(true));

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            dispatch(setError("Authentication token not found"));
            dispatch(setLoading(false));
            return false;
        }

        const response = await apiConnector("PATCH", apiEndpoints.markAllNotificationAsRead, null, {
            Authorization: `Bearer ${token}`,
        });

        console.log("Mark All As Read Response:", response);

        if (response.status === 200) {
            console.log("All notifications marked as read successfully");
            
            // Get current notifications from store FIRST
            const currentNotifications = store.getState().notification.notifications;
            console.log("Current notifications before update:", currentNotifications);
            
            if (currentNotifications && currentNotifications.length > 0) {
                // Update all notifications to be read
                const updatedNotifications = currentNotifications.map(notification => ({
                    ...notification,
                    isRead: true
                }));
                
                console.log("Updated notifications:", updatedNotifications);
                
                // Dispatch the updated notifications array
                dispatch(setNotification(updatedNotifications));
                dispatch(setSuccess(true));
                dispatch(setLoading(false));
                return true;
            } else {
                console.log("No current notifications to update");
                // If no current notifications, just set success and return
                dispatch(setSuccess(true));
                dispatch(setLoading(false));
                return true;
            }
        } else {
            console.error("Failed to mark all notifications as read:", response.data);
            dispatch(setError("Failed to mark all notifications as read"));
            dispatch(setLoading(false));
            return false;
        }
    } catch (error) {
        console.error("Error in markAllNotificationAsRead API:", error);
        dispatch(setError("Something went wrong"));
        dispatch(setLoading(false));
        return false;
    }
};

export const markNotificationAsRead = async (dispatch: any, notificationId: string): Promise<boolean> => {
    try {
        dispatch(setLoading(true));

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            dispatch(setError("Authentication token not found"));
            dispatch(setLoading(false));
            return false;
        }

        const response = await apiConnector("PATCH", apiEndpoints.markNotificationAsRead(notificationId), null, {
            Authorization: `Bearer ${token}`,
        });

        console.log("Mark Notification As Read Response:", response);

        if (response.status === 200) {
            console.log("Notification marked as read successfully");
            
            // Get current notifications from store FIRST
            const currentNotifications = store.getState().notification.notifications;
            console.log("Current notifications before update:", currentNotifications);
            
            if (currentNotifications && currentNotifications.length > 0) {
                // Update specific notification to be read
                const updatedNotifications = currentNotifications.map(notification =>
                    notification.id === notificationId 
                        ? { ...notification, isRead: true }
                        : notification
                );
                
                console.log("Updated notifications:", updatedNotifications);
                
                // Dispatch the updated notifications array
                dispatch(setNotification(updatedNotifications));
                dispatch(setSuccess(true));
                dispatch(setLoading(false));
                return true;
            } else {
                console.log("No current notifications to update");
                dispatch(setSuccess(true));
                dispatch(setLoading(false));
                return true;
            }
        } else {
            console.error("Failed to mark notification as read:", response.data);
            dispatch(setError("Failed to mark notification as read"));
            dispatch(setLoading(false));
            return false;
        }
    } catch (error) {
        console.error("Error in markNotificationAsRead API:", error);
        dispatch(setError("Something went wrong"));
        dispatch(setLoading(false));
        return false;
    }
};