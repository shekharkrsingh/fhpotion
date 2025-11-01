import { apiConnector } from "@/newService/apiConnector";
import { authEndpoints, doctorEndpoints } from "@/newService/config/apiEndpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "@reduxjs/toolkit";
import {
  setLoading,
  setSuccess,
  setError,
  setSignupData,
} from "@/redux/slices/signupSlice";

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
  doctorId: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * SIGNUP
 */
export const signupDoctor = async (
  dispatch: Dispatch,
  payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string;
  }
): Promise<boolean> => {
  dispatch(setLoading(true));

  try {
    const response = await apiConnector<ApiResponse<DoctorData>>({
      method: "POST",
      url: authEndpoints.createDoctor,
      bodyData: payload,
      tokenRequired: false,
    });

    if (!response.data?.data) {
      dispatch(setError(response.data?.message || "Signup failed"));
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
 * SEND OTP
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
      console.error("Failed to send OTP:", response.data?.message);
      return false;
    }

    console.log("OTP sent successfully:", response.data?.message);
    return true;
  } catch (error: any) {
    console.error(
      "Error sending OTP:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * LOGIN
 */
export const loginDoctor = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<LoginResponse>>({
      method: "POST",
      url: authEndpoints.login,
      bodyData: { username: email, password },
      tokenRequired: false,
    });

    if (!response.data?.data?.token) {
      console.error("Login failed:", response.data?.message);
      return false;
    }

    await AsyncStorage.setItem("token", response.data.data.token);
    console.log("Login successful, token stored");
    return true;
  } catch (error: any) {
    console.error(
      "Error logging in:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * FORGOT PASSWORD
 */
export const forgotPassword = async (
  email: string,
  newPassword: string,
  otp: string
): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<null>>({
      method: "POST",
      url: authEndpoints.forgotPassword,
      bodyData: { email, newPassword, otp },
      tokenRequired: false,
    });

    if (response.status !== 200) {
      console.error("Failed to reset password:", response.data?.message);
      return false;
    }

    console.log("Password reset successful");
    return true;
  } catch (error: any) {
    console.error(
      "Error resetting password:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};


export const changeDoctorPassword = async (
  oldPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {

    const response = await apiConnector<ApiResponse<null>>({
      method: "POST",
      url: doctorEndpoints.changeDoctorPassword,
      bodyData: { oldPassword, newPassword },
    });

    if (response.status !== 200) {
      console.error("Failed to change password:", response.data?.message);
      return false;
    }

    console.log("Password changed successfully");
    return true;
  } catch (error: any) {
    console.error(
      "Error changing password:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

export const changeDoctorEmail = async (
  newEmail: string,
  otp: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await apiConnector<ApiResponse<null>>({
      method: "POST",
      url: doctorEndpoints.updateDoctorEmail,
      bodyData: { newEmail, otp, password },
    });

    if (response.status !== 200) {
      console.error("Failed to change email:", response.data?.message);
      return false;
    }

    console.log("Email changed successfully");
    return true;
  } catch (error: any) {
    console.error(
      "Error changing email:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return false;
  }
};

/**
 * LOGOUT
 */
export const logoutDoctor = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("token");
    console.log("Logged out successfully");
  } catch (error: any) {
    console.error(
      "Error logging out:",
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
};
