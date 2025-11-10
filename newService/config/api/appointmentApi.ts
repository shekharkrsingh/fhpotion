// appointmentApi.ts - Fixed version
import { AppDispatch, RootState } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { appointmentEndpoints } from "@/newService/config/apiEndpoints/appointmentEndpoints";
import {
  setAppointments,
  setLoading,
  setError,
  setSuccess,
  updateAppointment as updateAppointmentInStore,
  addAppointment as addAppointmentInStore,
  revertAppointmentUpdate,
} from "@/newStore/slices/appointmentSlice";
import { Appointment } from "@/newStore/slices/appointmentSlice";

// Helper function to handle API errors without state changes
const handleApiError = (error: any, dispatch: AppDispatch, originalAppointment?: Appointment) => {
  const message =
    error?.response?.data?.message ||
    (error?.response?.status === 401
      ? "Unauthorized. Please log in again."
      : "Something went wrong.");
  
  dispatch(setError(message));
  
  // Revert state if we have original appointment data
  if (originalAppointment) {
    dispatch(revertAppointmentUpdate(originalAppointment));
  }
  
  return false;
};

export const getAppointments = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const response = await apiConnector({
      method: "GET",
      url: appointmentEndpoints.getTodaysAppointments,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.success) {
      dispatch(setAppointments(response.data.data || []));
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to fetch appointments"));
    return false;
  } catch (error: any) {
    return handleApiError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateAppointment =
  (appointmentId: string, updateData: Partial<Appointment>) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
    let originalAppointment: Appointment | undefined;
    
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Get current state and store original appointment for rollback
      const state = getState();
      originalAppointment = state.appointments.appointments.find(
        (appt: Appointment) => appt.appointmentId === appointmentId
      );

      const response = await apiConnector({
        method: "PUT",
        url: appointmentEndpoints.updateAppointmentById(appointmentId),
        bodyData: updateData,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        dispatch(updateAppointmentInStore(response.data.data));
        dispatch(setSuccess(true));
        return true;
      }

      dispatch(setError(response.data?.message || "Failed to update appointment"));
      return false;
    } catch (error: any) {
      return handleApiError(error, dispatch, originalAppointment);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateEmergencyStatus =
  (appointmentId: string, isEmergency: boolean) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
    let originalAppointment: Appointment | undefined;
    
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Get current state and store original appointment for rollback
      const state = getState();
      originalAppointment = state.appointments.appointments.find(
        (appt: Appointment) => appt.appointmentId === appointmentId
      );

      const response = await apiConnector({
        method: "PATCH",
        url: appointmentEndpoints.updateEmergencyStatus(appointmentId),
        bodyData: { isEmergency },
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        dispatch(updateAppointmentInStore(response.data.data));
        dispatch(setSuccess(true));
        return true;
      }

      dispatch(setError(response.data?.message || "Failed to update emergency status"));
      return false;
    } catch (error: any) {
      return handleApiError(error, dispatch, originalAppointment);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const cancelAppointment =
  (appointmentId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
    let originalAppointment: Appointment | undefined;
    
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Get current state and store original appointment for rollback
      const state = getState();
      originalAppointment = state.appointments.appointments.find(
        (appt: Appointment) => appt.appointmentId === appointmentId
      );

      const response = await apiConnector({
        method: "PATCH",
        url: appointmentEndpoints.cancelAppointment(appointmentId),
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        dispatch(updateAppointmentInStore(response.data.data));
        dispatch(setSuccess(true));
        return true;
      }

      dispatch(setError(response.data?.message || "Failed to cancel appointment"));
      return false;
    } catch (error: any) {
      return handleApiError(error, dispatch, originalAppointment);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const addAppointment =
  (newAppointment: Omit<Appointment, "appointmentId">) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await apiConnector({
        method: "POST",
        url: appointmentEndpoints.bookAppointment,
        bodyData: newAppointment,
        tokenRequired: true,
      });

      if (response.status >= 200 && response.status < 300 && response.data?.success) {
        dispatch(addAppointmentInStore(response.data.data));
        dispatch(setSuccess(true));
        return true;
      }

      dispatch(setError(response.data?.message || "Failed to create appointment"));
      return false;
    } catch (error: any) {
      return handleApiError(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  };

// Get appointment by ID
export const getAppointmentById =
  (appointmentId: string) =>
  async (dispatch: AppDispatch): Promise<Appointment | null> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await apiConnector({
        method: "GET",
        url: appointmentEndpoints.getAppointmentById(appointmentId),
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        dispatch(setSuccess(true));
        return response.data.data;
      }

      dispatch(setError(response.data?.message || "Failed to fetch appointment"));
      return null;
    } catch (error: any) {
      return handleApiError(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  };

// Get appointments by specific date
export const getAppointmentsByDate =
  (date: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await apiConnector({
        method: "GET",
        url: `${appointmentEndpoints.getAppointmentsByDate}?date=${date}`,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.success) {
        dispatch(setAppointments(response.data.data || []));
        dispatch(setSuccess(true));
        return true;
      }

      dispatch(setError(response.data?.message || "Failed to fetch appointments by date"));
      return false;
    } catch (error: any) {
      return handleApiError(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  };