import { AppDispatch } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { doctorEndpoints } from "@/newService/config/apiEndpoints";
import {
  setLoading,
  setSuccess,
  setError,
  setStatistics,
} from "@/newStore/slices/statisticsSlice";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface TreatedData {
  date: string;
  count: number;
}

interface DoctorStatistics {
  totalAppointment: number;
  totalUntreatedAppointmentAndNotAvailable: number;
  totalTreatedAppointment: number;
  totalAvailableAtClinic: number;
  lastWeekTreatedData: TreatedData[];
  lastActiveDayAppointments: number;
  lastActiveDayTreatedAppointments: number;
}

export const fetchDoctorStatistics = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await apiConnector<ApiResponse<DoctorStatistics>>({
      method: "GET",
      url: doctorEndpoints.doctorStatistics,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.data) {
      dispatch(setStatistics(response.data.data));
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to fetch statistics"));
    return false;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401
        ? "Unauthorized. Please log in again."
        : "Something went wrong while fetching statistics.");
    dispatch(setError(message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};