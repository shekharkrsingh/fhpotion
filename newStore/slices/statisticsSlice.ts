import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";

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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetStatistics: () => initialState,
  },
});

export const selectStatistics = (state: RootState) => state.statistics;
export const selectStatisticsData = (state: RootState) => state.statistics.data;
export const selectStatisticsLoading = (state: RootState) => state.statistics.isLoading;
export const selectStatisticsError = (state: RootState) => state.statistics.error;

export const {
  setStatistics,
  setLoading,
  setSuccess,
  setError,
  resetStatistics,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
