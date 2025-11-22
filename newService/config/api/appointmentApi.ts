/**
 * Appointment API
 * Re-exports appointment-related thunks from appointmentSlice
 */
export {
  getAppointments,
  addAppointment,
  updateAppointment,
  updateEmergencyStatus,
  cancelAppointmentThunk as cancelAppointment,
  getAppointmentById,
  getAppointmentsByDate,
} from "@/newStore/slices/appointmentSlice";
