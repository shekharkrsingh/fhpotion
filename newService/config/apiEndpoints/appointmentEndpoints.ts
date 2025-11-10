
import { API_BASE_URL } from "../apiConfig";

export const appointmentEndpoints = {
  bookAppointment: `${API_BASE_URL}api/v1/appointments/book`,
  getAppointmentById: (id: string) => `${API_BASE_URL}api/v1/appointments/${id}`,
  getTodaysAppointments: `${API_BASE_URL}api/v1/appointments/by-doctor`,
  getAppointmentsByDate: `${API_BASE_URL}api/v1/appointments/by-doctor`,
  updateAppointmentById: (id: string) => `${API_BASE_URL}api/v1/appointments/update/${id}`,
  updateIsEmergencyStatus: (id: string)=> `${API_BASE_URL}api/v1/appointments/emergency/${id}`,
  cancelAppointment: (id: string)=> `${API_BASE_URL}api/v1/appointments/cancel/${id}`
};
