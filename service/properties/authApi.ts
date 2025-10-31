import { apiConnector } from "../apiConnector";
import apiEndpoints from "../../apiFactory";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface ApiResponse<T> {
  data: {
    success: boolean;
    message: string;
    data: T | null;
  }
}

interface LoginResponse {
  token: string;
}

interface DoctorData {
  doctorId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
    doctorId: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
  }

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  otp: string
): Promise<DoctorData | null> {
  try {
    const response: ApiResponse<DoctorData> = await apiConnector("POST", apiEndpoints.createDoctor, {
      firstName,
      lastName,
      email,
      password,
      otp,
    });
    console.log(response)
    if (!response.data.success ) {
      console.error("Signup Failed:", response.data.message);
      throw new Error(response.data.message || "Signup failed.");
    }

    console.log("Signup Successful:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Signup Error:",
      error.response?.data?.message || error.message || "An unknown error occurred"
    );
    return null;
  }
}

export async function sendOtp(email: string): Promise<boolean> {
    try {
        console.log(email)
      const response: ApiResponse<null> = await apiConnector("POST", apiEndpoints.sendOtp, { email });
  
      if (!response.data.success) {
        console.error("OTP Send Failed:", response.data.message);
        throw new Error(response.data.message || "Failed to send OTP.");
      }
  
      console.log("OTP Sent Successfully:", response.data.message);
      return true;
    } catch (error: any) {
      console.error(
        "OTP Send Error:",
        error.response?.data?.message || error.message || "An unknown error occurred"
      );
      return false;
    }
  }



  export async function login(email: string, password: string): Promise<string | null> {
    try {
      const response: ApiResponse<LoginResponse> = await apiConnector("POST", apiEndpoints.login, {
        username: email,
        password,
      });
  
      if (!response.data.success || !response.data.data?.token) {
        console.error("Login Failed:", response.data.message);
        throw new Error(response.data.message || "Login failed.");
      }
  
      const token = response.data.data.token; // Extract token
  
      // Store token in AsyncStorage
      await AsyncStorage.setItem("authToken", token);
      console.log("Token stored");
  
      return token;
    } catch (error: any) {
      console.error(
        "Login Error:",
        error.response?.data?.message || error.message || "An unknown error occurred"
      );
      return null;
    }
  }



  export const forgotPassword = async (email: string, newPassword: string, otp: string): Promise<boolean> => {
    try {
        const response = await apiConnector("POST", apiEndpoints.forgotPassword, {
          email,
          newPassword,
          otp
        })
        if (response.status === 200) {
            console.log("OTP sent successfully:", response.data);
            return true;
        } else {
            console.error("Failed to send OTP:", response.data);
            return false;
        }
    } catch (error) {
        console.error("Error in forgotPassword API:", error);
        return false;
    }
  };


    export const changeDoctorPassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          console.error("No authentication token found.");
          return false;
        }

        const response = await apiConnector("POST", apiEndpoints.changeDoctorPassword, {
          oldPassword,
          newPassword
        },{
          Authorization: `Bearer ${token}`
        })
        if (response.status === 200) {
            console.log("Password changed successfully", response.data);
            return true;
        } else {
            console.error("Failed to change password:", response.data);
            return false;
        }
    } catch (error) {
        console.error("Error in changeDoctorPasswrod API:", error);
        return false;
    }
  };

    export const changeDoctorEmail = async (newEmail: string, otp: string, password: string): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          console.error("No authentication token found.");
          return false;
        }

        const response = await apiConnector("POST", apiEndpoints.updateDoctorEmail, {
          newEmail,
          otp,
          password
        },{
          Authorization: `Bearer ${token}`
        })
        if (response.status === 200) {
            console.log("Email changed successfully", response.data);
            return true;
        } else {
            console.error("Failed to change Email:", response.data);
            return false;
        }
    } catch (error) {
        console.error("Error in updateDoctorEmail API:", error);
        return false;
    }

};

