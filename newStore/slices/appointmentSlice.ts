import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";

export interface Appointment {
  appointmentId: string;
  doctorId: string;
  patientName: string;
  contact: string;
  description: string | null;
  appointmentDateTime: string;
  bookingDateTime: string;
  availableAtClinic: boolean;
  treated: boolean;
  treatedDateTime: string | null;
  status: string;
  appointmentType: string;
  paymentStatus: boolean;
  isEmergency: boolean;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  success: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      state.success = true;
      state.error = null;
    },
   addAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (a) => a.appointmentId === action.payload.appointmentId
      );

      if (index !== -1) {
        state.appointments[index] = action.payload;
      } else {
        state.appointments.push(action.payload);
      }
    },

    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (a) => a.appointmentId === action.payload.appointmentId
      );
      if (index !== -1) state.appointments[index] = action.payload;
    },
    removeAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (a) => a.appointmentId !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.success = false;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetAppointments: () => initialState,
  },
});

export const selectAppointments = (state: RootState) =>
  state.appointments.appointments;
export const selectAppointmentsLoading = (state: RootState) =>
  state.appointments.loading;
export const selectAppointmentsError = (state: RootState) =>
  state.appointments.error;

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  removeAppointment,
  setLoading,
  setError,
  setSuccess,
  resetAppointments,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
