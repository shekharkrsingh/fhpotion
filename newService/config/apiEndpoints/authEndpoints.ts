import { API_BASE_URL } from "../apiConfig";

export const authEndpoints = {
  login: `${API_BASE_URL}api/v1/public/login`,
  sendOtp: `${API_BASE_URL}api/v1/public/send-otp`,
  forgotPassword: `${API_BASE_URL}api/v1/public/forgot-password`,
  createDoctor: `${API_BASE_URL}api/v1/public`,
  doctorProfile: (doctorId: string) => `${API_BASE_URL}api/v1/public/${doctorId}`,
};