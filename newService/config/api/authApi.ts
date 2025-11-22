import { apiConnector } from "@/newService/apiConnector";
import { authEndpoints, doctorEndpoints } from "@/newService/config/apiEndpoints";
import {
  setLoading,
  setSuccess,
  setError,
  setSignupData,
} from "@/newStore/slices/signupSlice";
import { store } from "@/newStore";
import { setToken, removeToken } from "@/utils/tokenService";
import logger from "@/utils/logger";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface DoctorData {
  doctorId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
}

const { dispatch } = store;

/**
 * Signup a new doctor
 * @param firstName - Doctor's first name
 * @param lastName - Doctor's last name
 * @param email - Doctor's email address
 * @param password - Doctor's password
 * @param otp - OTP verification code
 * @returns Promise<boolean> - true if signup successful, false otherwise
 */
export const signupDoctor = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  otp: string,
): Promise<boolean> => {
  dispatch(setLoading(true));

  try {
    const response = await apiConnector<ApiResponse<DoctorData>>({
      method: "POST",
      url: authEndpoints.createDoctor,
      bodyData: { firstName, lastName, email, password, otp },
      tokenRequired: false,
    });

    if (!response.data?.data) {
      const errorMessage = response.data?.message || "Signup failed";
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return false;
    }

    dispatch(setSignupData(response.data.data));
    dispatch(setSuccess(true));
    dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong during signup";
    dispatch(setError(message));
    dispatch(setLoading(false));
    return false;
  }
};

/**
 * Send OTP to doctor's email
 * @param email - Doctor's email address
 * @returns Promise<boolean> - true if OTP sent successfully, false otherwise
 */
export const sendOtp = async (email: string): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<null>>({
      method: "POST",
      url: authEndpoints.sendOtp,
      bodyData: { email },
      tokenRequired: false,
    });

    if (response.status !== 200) {
      logger.error("Failed to send OTP:", response.data?.message);
      return false;
    }

    logger.log("OTP sent successfully:", response.data?.message);
    return true;
  } catch (error: any) {
    logger.error(
      "Error sending OTP:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * Login a doctor
 * @param email - Doctor's email address
 * @param password - Doctor's password
 * @returns Promise<boolean> - true if login successful, false otherwise
 */
export const loginDoctor = async (
  email: string,
  password: string,
): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<LoginResponse>>({
      method: "POST",
      url: authEndpoints.login,
      bodyData: { username: email, password },
      tokenRequired: false,
    });

    if (!response.data?.data?.token) {
      logger.error("Login failed:", response.data?.message);
      return false;
    }

    const tokenStored = await setToken(response.data.data.token);
    if (!tokenStored) {
      logger.error("Failed to store token securely");
      return false;
    }

    logger.log("Login successful, token stored securely");
    return true;
  } catch (error: any) {
    logger.error(
      "Error logging in:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * Reset password for forgot password flow
 * @param email - Doctor's email address
 * @param newPassword - New password to set
 * @param otp - OTP verification code
 * @returns Promise<boolean> - true if password reset successful, false otherwise
 */
export const forgotPassword = async (
  email: string,
  newPassword: string,
  otp: string,
): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<null>>({
      method: "POST",
      url: authEndpoints.forgotPassword,
      bodyData: { email, newPassword, otp },
      tokenRequired: false,
    });

    if (response.status !== 200) {
      logger.error("Failed to reset password:", response.data?.message);
      return false;
    }

    logger.log("Password reset successful");
    return true;
  } catch (error: any) {
    logger.error(
      "Error resetting password:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * Change doctor's password
 * @param oldPassword - Current password
 * @param newPassword - New password to set
 * @returns Promise<boolean> - true if password changed successfully, false otherwise
 */
export const changeDoctorPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<null>>({
      method: "POST",
      url: doctorEndpoints.changeDoctorPassword,
      bodyData: { oldPassword, newPassword },
      tokenRequired: true,
    });

    if (response.status !== 200) {
      logger.error("Failed to change password:", response.data?.message);
      return false;
    }

    logger.log("Password changed successfully");
    return true;
  } catch (error: any) {
    logger.error(
      "Error changing password:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * Change doctor's email address
 * @param newEmail - New email address
 * @param otp - OTP verification code
 * @param password - Current password for verification
 * @returns Promise<boolean> - true if email changed successfully, false otherwise
 */
export const changeDoctorEmail = async (
  newEmail: string,
  otp: string,
  password: string,
): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<string>>({
      method: "POST",
      url: doctorEndpoints.updateDoctorEmail,
      bodyData: { newEmail, otp, password },
      tokenRequired: true,
    });

    if (response.status !== 200) {
      logger.error("Failed to change email:", response.data?.message);
      return false;
    }

    const tokenStored = await setToken(response.data.data);
    if (!tokenStored) {
      logger.error("Failed to store new token securely after email change");
      return false;
    }

    return true;
  } catch (error: any) {
    logger.error(
      "Error changing email:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * Logout doctor (removes token from secure storage)
 * @returns Promise<void>
 */
export const logoutDoctor = async (): Promise<void> => {
  try {
    await removeToken();
    logger.log("Logged out successfully, token removed from secure storage");
  } catch (error: any) {
    logger.error(
      "Error logging out:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

/**
 * Sign out doctor (removes token from secure storage)
 * @returns Promise<boolean> - true if sign out successful, false otherwise
 */
export const signOutDoctor = async (): Promise<boolean> => {
  try {
    await removeToken();
    logger.log("Signed out successfully - token removed from secure storage");
    return true;
  } catch (error: any) {
    logger.error(
      "Error signing out:",
      error?.message || "Something went wrong"
    );
    return false;
  }
};