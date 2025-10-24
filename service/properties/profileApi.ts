import { setProfileData, setLoading, setSuccess, setError } from "@/redux/slices/profileSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiConnector } from "@/service/apiConnector";
import { apiEndpoints } from "@/apiFactory";

interface updateProfile {

}

export const getProfile = async (dispatch: any): Promise<boolean> => {
    try {
        dispatch(setLoading(true)); // Start loading

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            dispatch(setError("Authentication token not found"));
            dispatch(setLoading(false));
            return false;
        }

        const response = await apiConnector("GET", apiEndpoints.getDoctorProfile, null, {
            Authorization: `Bearer ${token}`,
        });

        if (response.status === 200) {
            console.log("Profile fetched successfully");
            dispatch(setProfileData(response.data.data));
            dispatch(setSuccess(true));
            dispatch(setLoading(false));
            return true;
        } else {
            console.error("Failed to fetch profile:", response.data);
            dispatch(setError("Failed to fetch profile"));
            dispatch(setLoading(false));
            return false;
        }
    } catch (error) {
        console.error("Error in getProfile API:", error);
        dispatch(setError("Something went wrong"));
        dispatch(setLoading(false));
        return false;
    }
};

export const updateProfile= async (dispatch:any, updateProfile: any):Promise<boolean>=>{
    try {
        dispatch(setLoading(true)); // Start loading

        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found.");
            dispatch(setError("Authentication token not found"));
            dispatch(setLoading(false));
            return false;
        }
        const response = await apiConnector("PUT", apiEndpoints.updateDoctor, updateProfile, {
            Authorization: `Bearer ${token}`,
        });

        if (response.status === 200) {
            console.log("_______________________________________")
            console.log(response)
            console.log("Profile fetched successfully");
            dispatch(setProfileData(response.data.data));
            dispatch(setSuccess(true));
            dispatch(setLoading(false));
            return true;
        } else {
            console.error("Failed to fetch profile:", response.data);
            dispatch(setError("Failed to fetch profile"));
            dispatch(setLoading(false));
            return false;
        }
    } catch (error) {
        console.error("Error in getProfile API:", error);
        dispatch(setError("Something went wrong"));
        dispatch(setLoading(false));
        return false;
    }
}
