const BASE_URL: string = "http://localhost:8080/api/v1";

type ApiEndpoints = {
  login: string;
  test: string;
  sendOtp: string;
  forgotPassword: string;
  createDoctor: string;
  doctorProfile: (doctorId: string) => string;
  getAllDoctors: string;
  updateDoctor: string;
  updateDoctorEmail: string;
  changeDoctorPassword: string;
  getDoctorProfile: string;
  deleteDoctor: (doctorId: string) => string;
  bookAppointment: string;
  getAppointmentById: (appointmentId: string) => string;
  getTodaysAppointments: string;
  getAppointmentsByDate: string;
  updateAppointmentById: (appointmentId: string) => string;
  doctorStatistics: string;
};

export const apiEndpoints: ApiEndpoints = {
  login: `${BASE_URL}/public/login`,
  test: `${BASE_URL}/public`,
  sendOtp: `${BASE_URL}/public/send-otp`,
  forgotPassword: `${BASE_URL}/public/forgot-password`,
  createDoctor: `${BASE_URL}/public`,
  doctorProfile: (doctorId: string) => `${BASE_URL}/public/${doctorId}`,
  getAllDoctors: `${BASE_URL}/admin`,
  updateDoctor: `${BASE_URL}/doctors`,
  updateDoctorEmail: `${BASE_URL}/doctors/update-email`,
  changeDoctorPassword: `${BASE_URL}/doctors/change-password`,
  getDoctorProfile: `${BASE_URL}/doctors/profile`,
  deleteDoctor: (doctorId: string) => `${BASE_URL}/admin/${doctorId}`,
  bookAppointment: `${BASE_URL}/appointments/book`,
  getAppointmentById: (appointmentId: string) => `${BASE_URL}/appointments/${appointmentId}`,
  getTodaysAppointments: `${BASE_URL}/appointments/by-doctor`,
  getAppointmentsByDate: `${BASE_URL}/appointments/by-doctor`,
  updateAppointmentById: (appointmentId: string) => `${BASE_URL}/appointments/update/${appointmentId}`,
  doctorStatistics: `${BASE_URL}/doctor/statistics`,
};

export default apiEndpoints;
