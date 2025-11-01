import { API_BASE_URL } from "../apiConfig";

export const doctorEndpoints = {
  getAllDoctors: `${API_BASE_URL}api/v1/admin`,
  updateDoctor: `${API_BASE_URL}api/v1/doctors`,
  updateDoctorEmail: `${API_BASE_URL}api/v1/doctors/update-email`,
  changeDoctorPassword: `${API_BASE_URL}api/v1/doctors/change-password`,
  getDoctorProfile: `${API_BASE_URL}api/v1/doctors/profile`,
  deleteDoctor: (doctorId: string) => `${API_BASE_URL}api/v1/admin/${doctorId}`,
  doctorStatistics: `${API_BASE_URL}api/v1/doctor/statistics`,
};
