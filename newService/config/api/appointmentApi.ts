import { AppDispatch } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { appointmentEndpoints } from "@/newService/config/apiEndpoints/appointmentEndpoints";
import {
  setAppointments,
  setLoading,
  setError,
  setSuccess,
  updateAppointment as updateAppointmentInStore,
  addAppointment as addAppointmentInStore,
} from "@/newStore/slices/appointmentSlice";
import { Appointment } from "@/newStore/slices/appointmentSlice";

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
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401
        ? "Unauthorized. Please log in again."
        : "Something went wrong while fetching appointments.");
    dispatch(setError(message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateAppointment =
  (appointmentId: string, updateData: Partial<Appointment>) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

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
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while updating appointment.");
      dispatch(setError(message));
      return false;
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
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while creating appointment.");
      dispatch(setError(message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
