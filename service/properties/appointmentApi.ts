import { setAppointments, setLoading, setError, setSuccess } from "@/redux/slices/appointmentSlice";
import { apiConnector } from "@/service/apiConnector";
import { apiEndpoints } from "@/apiFactory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "@reduxjs/toolkit";
import { Appointment } from "@/redux/slices/appointmentSlice";

export const getAppointments = async (dispatch: Dispatch): Promise<boolean> => {
    try {
        dispatch(setLoading(true)); // Start loading

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            dispatch(setError("Authentication token not found"));
            dispatch(setLoading(false));
            return false;
        }

        const response = await apiConnector("GET", apiEndpoints.getTodaysAppointments, null, {
            Authorization: `Bearer ${token}`,
        });
        
        console.log(response)

        if (response.status === 200 && response.data.success) {
            console.log("Appointments fetched successfully");
            const appointments: Appointment[] = response.data.data;
            dispatch(setAppointments(appointments));
            dispatch(setSuccess(true));
            dispatch(setLoading(false));
            return true;
        } else {
            console.error("Failed to fetch appointments:", response.data);
            dispatch(setError("Failed to fetch appointments"));
            dispatch(setLoading(false));
            return false;
        }
    } catch (error) {
        console.error("Error in getAppointments API:", error);
        dispatch(setError("Something went wrong"));
        dispatch(setLoading(false));
        return false;
    }
};


export const updateAppointment = async (
    dispatch: Dispatch,
    id: string,
    updatedDetails: Partial<Appointment>
): Promise<boolean> => {
    try {
        console.log(id)
        console.log(updatedDetails)

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            dispatch(setError("Authentication token not found"));
            return false;
        }

        const response = await apiConnector("PUT", `${apiEndpoints.updateAppointmentById(id)}`, updatedDetails, {
            Authorization: `Bearer ${token}`,
        });
        console.log(response)
        if (response.status === 200 && response.data.success) {
            return true;
        } else {
            console.error("Failed to update appointment:", response.data);
            dispatch(setError("Failed to update appointment"));
            return false;
        }
    } catch (error) {
        console.error("Error in updateAppointment API:", error);
        dispatch(setError("Something went wrong"));
        return false;
    }
};


export const addAppointment = async (newAppointment: any): Promise<boolean> => {
    try {

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            return false;
        }

        const response = await apiConnector("POST", apiEndpoints.bookAppointment, newAppointment, {
            Authorization: `Bearer ${token}`,
        });

        if (response.status >= 200 && response.status<300 && response.data.success) {
            console.log("Appointment added successfully");
            return true;
        } else {
            console.error("Failed to add appointment:", response.data);
            return false;
        }
    } catch (error) {
        console.error("Error in addAppointment API:", error);
        return false;
    }
};

