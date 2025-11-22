import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { doctorEndpoints } from "@/newService/config/apiEndpoints";

interface TreatedData {
  date: string;
  count: number;
}

export interface DoctorStatistics {
  totalAppointment: number;
  totalUntreatedAppointmentAndNotAvailable: number;
  totalTreatedAppointment: number;
  totalAvailableAtClinic: number;
  lastWeekTreatedData: TreatedData[];
  lastActiveDayAppointments: number;
  lastActiveDayTreatedAppointments: number;
  lastActiveDayPercentageTreatedAppointments: number;
}

interface StatisticsState {
  data: DoctorStatistics | null;
  isLoading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  data: null,
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

export const fetchDoctorStatistics = createAsyncThunk<
  DoctorStatistics,
  void,
  { rejectValue: string }
>(
  "statistics/fetchDoctorStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<DoctorStatistics>>({
        method: "GET",
        url: doctorEndpoints.doctorStatistics,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to fetch statistics"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while fetching statistics.");
      return rejectWithValue(message);
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setStatistics: (state, action: PayloadAction<DoctorStatistics>) => {
      state.data = action.payload;
      state.success = true;
      state.error = null;
      state.isLoading = false;
    },
    resetStatistics: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchDoctorStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchDoctorStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch statistics";
        state.success = false;
      });
  },
});

export const selectStatistics = (state: RootState) => state.statistics;
export const selectStatisticsData = (state: RootState) => state.statistics.data;
export const selectStatisticsLoading = (state: RootState) => state.statistics.isLoading;
export const selectStatisticsError = (state: RootState) => state.statistics.error;

export const {
  setStatistics,
  resetStatistics,
  clearError,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
