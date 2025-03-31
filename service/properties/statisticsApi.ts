import { apiConnector } from "@/service/apiConnector";
import { apiEndpoints } from "@/apiFactory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "@/redux/store";
import {
  fetchStatisticsStart,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
} from "@/redux/slices/statisticsSlice";

export const fetchDoctorStatistics = async (): Promise<boolean> => {
  try {
    // Retrieve authentication token
    const token = await AsyncStorage.getItem("authToken");
    
    // Check if token is available
    if (!token) {
      const errorMessage = "No authentication token found.";
      console.error("❌", errorMessage);
      store.dispatch(fetchStatisticsFailure(errorMessage));
      return false;
    }

    // Dispatch action to indicate the start of fetching process
    store.dispatch(fetchStatisticsStart());

    // Make the API request to fetch doctor statistics
    const response = await apiConnector("GET", apiEndpoints.doctorStatistics, null, {
      Authorization: `Bearer ${token}`,
    });

    // Handle success response
    if (response.status === 200 && response.data.success) {
      console.log("✅ Doctor statistics fetched successfully:", response.data.data);
      store.dispatch(fetchStatisticsSuccess(response.data.data));
      return true;
    }

    // Handle failure response
    const failureMessage = response.data.message || "Unknown error";
    console.error("❌ Failed to fetch doctor statistics:", response.data);
    store.dispatch(fetchStatisticsFailure(failureMessage));
    return false;

  } catch (error) {
    // Catch any unexpected errors
    console.error("❌ Error in fetchDoctorStatistics API:", error);
    store.dispatch(fetchStatisticsFailure("Failed to fetch statistics"));
    return false;
  }
};
