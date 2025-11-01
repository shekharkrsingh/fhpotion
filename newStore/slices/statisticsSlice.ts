import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";

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

interface StatisticsState {
  data: DoctorStatistics | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: StatisticsState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStatistics: (state, action: PayloadAction<DoctorStatistics>) => {
      state.data = action.payload;
      state.success = true;
      state.error = null;
      state.loading = false;
    },
    resetStatistics: () => initialState,
  },
});

export const {
  setLoading,
  setSuccess,
  setError,
  setStatistics,
  resetStatistics,
} = statisticsSlice.actions;

export const selectStatistics = (state: RootState) => state.statistics;
export const selectStatisticsData = (state: RootState) => state.statistics.data;
export const selectStatisticsLoading = (state: RootState) => state.statistics.loading;
export const selectStatisticsError = (state: RootState) => state.statistics.error;

export default statisticsSlice.reducer;
