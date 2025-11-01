import { apiConnector } from "@/newService/apiConnector";
import { doctorEndpoints } from "@/newService/config/apiEndpoints/index";
import { store } from "@/newStore";
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

export const fetchDoctorStatistics = async (): Promise<boolean> => {
  const { dispatch } = store;
  dispatch(setLoading(true));

  try {
    const response = await apiConnector<ApiResponse<DoctorStatistics>>({
      method: "GET",
      url: doctorEndpoints.doctorStatistics,
      tokenRequired: true,
    });

    if (response.status !== 200 || !response.data?.data) {
      dispatch(setError(response.data?.message || "Failed to fetch statistics"));
      dispatch(setLoading(false));
      return false;
    }

    dispatch(setStatistics(response.data.data));
    dispatch(setSuccess(true));
    dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong while fetching statistics";
    dispatch(setError(message));
    dispatch(setLoading(false));
    return false;
  }
};
