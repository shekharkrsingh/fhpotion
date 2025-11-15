import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { appointmentEndpoints } from "@/newService/config/apiEndpoints/appointmentEndpoints";

export type AppointmentStatus = "BOOKED" | "ACCEPTED" | "CANCELLED";
export type AppointmentType = "IN_PERSON" | "ONLINE";

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
  status: AppointmentStatus;
  appointmentType: AppointmentType;
  paymentStatus: boolean;
  isEmergency: boolean;
}

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  success: boolean;
  error: string | null;
  updatingIds: string[];
}

const initialState: AppointmentState = {
  appointments: [],
  isLoading: false,
  success: false,
  error: null,
  updatingIds: [],
};

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success?: boolean;
}

export const getAppointments = createAsyncThunk<
  Appointment[],
  void,
  { rejectValue: string }
>(
  "appointments/getAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Appointment[]>>({
        method: "GET",
        url: appointmentEndpoints.getTodaysAppointments,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        return response.data.data || [];
      }

      return rejectWithValue(
        response.data?.message || "Failed to fetch appointments"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while fetching appointments.");
      return rejectWithValue(message);
    }
  }
);

export const addAppointment = createAsyncThunk<
  Appointment,
  Omit<Appointment, "appointmentId">,
  { rejectValue: string }
>(
  "appointments/addAppointment",
  async (newAppointment, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Appointment>>({
        method: "POST",
        url: appointmentEndpoints.bookAppointment,
        bodyData: newAppointment,
        tokenRequired: true,
      });

      if (response.status >= 200 && response.status < 300 && response.data?.success) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to create appointment"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while creating appointment.");
      return rejectWithValue(message);
    }
  }
);

export const updateAppointment = createAsyncThunk<
  Appointment,
  { appointmentId: string; updateData: Partial<Appointment> },
  { rejectValue: string; state: RootState }
>(
  "appointments/updateAppointment",
  async ({ appointmentId, updateData }, { rejectWithValue, getState }) => {
    try {
      const response = await apiConnector<ApiResponse<Appointment>>({
        method: "PUT",
        url: appointmentEndpoints.updateAppointmentById(appointmentId),
        bodyData: updateData,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to update appointment"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while updating appointment.");
      return rejectWithValue(message);
    }
  }
);

export const updateEmergencyStatus = createAsyncThunk<
  Appointment,
  { appointmentId: string; isEmergency: boolean },
  { rejectValue: string }
>(
  "appointments/updateEmergencyStatus",
  async ({ appointmentId, isEmergency }, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Appointment>>({
        method: "PATCH",
        url: appointmentEndpoints.updateEmergencyStatus(appointmentId),
        bodyData: { isEmergency },
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to update emergency status"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while updating emergency status.");
      return rejectWithValue(message);
    }
  }
);

export const cancelAppointmentThunk = createAsyncThunk<
  Appointment,
  string,
  { rejectValue: string }
>(
  "appointments/cancelAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Appointment>>({
        method: "PATCH",
        url: appointmentEndpoints.cancelAppointment(appointmentId),
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to cancel appointment"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while canceling appointment.");
      return rejectWithValue(message);
    }
  }
);

export const getAppointmentById = createAsyncThunk<
  Appointment,
  string,
  { rejectValue: string }
>(
  "appointments/getAppointmentById",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Appointment>>({
        method: "GET",
        url: appointmentEndpoints.getAppointmentById(appointmentId),
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        return response.data.data;
      }

      return rejectWithValue(
        response.data?.message || "Failed to fetch appointment"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while fetching appointment.");
      return rejectWithValue(message);
    }
  }
);

export const getAppointmentsByDate = createAsyncThunk<
  Appointment[],
  string,
  { rejectValue: string }
>(
  "appointments/getAppointmentsByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await apiConnector<ApiResponse<Appointment[]>>({
        method: "GET",
        url: `${appointmentEndpoints.getAppointmentsByDate}?date=${date}`,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        return response.data.data || [];
      }

      return rejectWithValue(
        response.data?.message || "Failed to fetch appointments by date"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while fetching appointments by date.");
      return rejectWithValue(message);
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    updateAppointmentLocal: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (a) => a.appointmentId === action.payload.appointmentId
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      state.success = true;
      state.error = null;
    },
    removeAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (a) => a.appointmentId !== action.payload
      );
      state.success = true;
      state.error = null;
    },
    resetAppointments: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch appointments";
        state.success = false;
      })
      .addCase(addAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.appointments.findIndex(
          (a) => a.appointmentId === action.payload.appointmentId
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        } else {
          state.appointments.push(action.payload);
        }
        state.success = true;
        state.error = null;
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create appointment";
        state.success = false;
      })
      .addCase(updateAppointment.pending, (state, action) => {
        if (!state.updatingIds.includes(action.meta.arg.appointmentId)) {
          state.updatingIds.push(action.meta.arg.appointmentId);
        }
        state.error = null;
        state.success = false;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg.appointmentId
        );
        const index = state.appointments.findIndex(
          (a) => a.appointmentId === action.payload.appointmentId
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg.appointmentId
        );
        state.error = action.payload || "Failed to update appointment";
        state.success = false;
      })
      .addCase(updateEmergencyStatus.pending, (state, action) => {
        if (!state.updatingIds.includes(action.meta.arg.appointmentId)) {
          state.updatingIds.push(action.meta.arg.appointmentId);
        }
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmergencyStatus.fulfilled, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg.appointmentId
        );
        const index = state.appointments.findIndex(
          (a) => a.appointmentId === action.payload.appointmentId
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateEmergencyStatus.rejected, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg.appointmentId
        );
        state.error = action.payload || "Failed to update emergency status";
        state.success = false;
      })
      .addCase(cancelAppointmentThunk.pending, (state, action) => {
        if (!state.updatingIds.includes(action.meta.arg)) {
          state.updatingIds.push(action.meta.arg);
        }
        state.error = null;
        state.success = false;
      })
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg
        );
        const index = state.appointments.findIndex(
          (a) => a.appointmentId === action.payload.appointmentId
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(cancelAppointmentThunk.rejected, (state, action) => {
        state.updatingIds = state.updatingIds.filter(
          (id) => id !== action.meta.arg
        );
        state.error = action.payload || "Failed to cancel appointment";
        state.success = false;
      })
      .addCase(getAppointmentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.appointments.findIndex(
          (a) => a.appointmentId === action.payload.appointmentId
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        } else {
          state.appointments.push(action.payload);
        }
        state.success = true;
        state.error = null;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch appointment";
        state.success = false;
      })
      .addCase(getAppointmentsByDate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAppointmentsByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(getAppointmentsByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch appointments by date";
        state.success = false;
      });
  },
});

export const selectAppointments = (state: RootState) => state.appointments.appointments;
export const selectAppointmentsLoading = (state: RootState) => state.appointments.isLoading;
export const selectAppointmentsError = (state: RootState) => state.appointments.error;
export const selectUpdatingAppointmentIds = (state: RootState) => state.appointments.updatingIds;

export const {
  updateAppointmentLocal,
  removeAppointment,
  resetAppointments,
  clearError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
