import { AppDispatch } from "@/newStore";
import { apiConnector } from "@/newService/apiConnector";
import { doctorEndpoints } from "@/newService/config/apiEndpoints";
import {
  setProfileData,
  setLoading,
  setSuccess,
  setError,
} from "@/newStore/slices/profileSlice";

export const getProfile = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await apiConnector({
      method: "GET",
      url: doctorEndpoints.getDoctorProfile,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.data) {
      dispatch(setProfileData(response.data.data));
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to fetch profile"));
    return false;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      (error?.response?.status === 401
        ? "Unauthorized. Please log in again."
        : "Something went wrong while fetching profile.");
    dispatch(setError(message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProfile =
  (updateData: Record<string, any>) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    console.log(updateData); // this now works correctly
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await apiConnector({
        method: "PUT",
        url: doctorEndpoints.updateDoctor,
        bodyData: updateData,
        tokenRequired: true,
      });

      if (response.status === 200 && response.data?.data) {
        dispatch(setProfileData(response.data.data));
        dispatch(setSuccess(true));
        return true;
      }

      dispatch(setError(response.data?.message || "Failed to update profile"));
      return false;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Something went wrong while updating profile.");
      dispatch(setError(message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
