// bookingActionHelpers.ts
import { Appointment } from "@/newStore/slices/appointmentSlice";

export interface ActionValidation {
  allowed: boolean;
  message?: string;
  needsConfirmation?: boolean;
}

// Helper functions for action validation
export const canMarkAvailable = (appointment: Appointment): ActionValidation => {
  if (appointment.status !== "ACCEPTED") {
    return { allowed: false, message: "Only ACCEPTED appointments can be marked available" };
  }
  if (!appointment.paymentStatus) {
    return { allowed: false, message: "Payment must be completed to mark as available" };
  }
  if (appointment.treated) {
    return { allowed: false, message: "Treated appointments cannot be marked available" };
  }
  return { allowed: true };
};

export const canMarkUnavailable = (appointment: Appointment): ActionValidation => {
  if (appointment.status !== "ACCEPTED") {
    return { allowed: false, message: "Only ACCEPTED appointments can be marked unavailable" };
  }
  if (appointment.treated) {
    return { allowed: false, message: "Treated appointments cannot be marked unavailable" };
  }
  return { allowed: true, needsConfirmation: true };
};

export const canMarkPaid = (appointment: Appointment): ActionValidation => {
  if (appointment.status !== "ACCEPTED") {
    return { allowed: false, message: "Only ACCEPTED appointments can be marked paid" };
  }
  return { allowed: true };
};

export const canMarkUnpaid = (appointment: Appointment): ActionValidation => {
  if (appointment.status !== "ACCEPTED") {
    return { allowed: false, message: "Only ACCEPTED appointments can be marked unpaid" };
  }
  if (appointment.treated) {
    return { allowed: false, message: "Treated appointments cannot be marked unpaid" };
  }
  return { allowed: true, needsConfirmation: true };
};

export const canMarkTreated = (appointment: Appointment): ActionValidation => {
  if (appointment.status !== "ACCEPTED") {
    return { allowed: false, message: "Only ACCEPTED appointments can be marked treated" };
  }
  if (!appointment.paymentStatus) {
    return { allowed: false, message: "Payment must be completed to mark as treated" };
  }
  if (!appointment.availableAtClinic) {
    return { allowed: false, message: "Patient must be available to mark as treated" };
  }
  return { allowed: true };
};

export const canMarkUntreated = (appointment: Appointment): ActionValidation => {
  if (appointment.status !== "ACCEPTED") {
    return { allowed: false, message: "Only ACCEPTED appointments can be unmarked as treated" };
  }
  return { allowed: true, needsConfirmation: true };
};

export const canCancel = (appointment: Appointment): ActionValidation => {
  if (appointment.status === "CANCELLED") {
    return { allowed: false, message: "Appointment is already cancelled" };
  }
  if (appointment.treated) {
    return { allowed: false, message: "Treated appointments cannot be cancelled" };
  }
  return { allowed: true, needsConfirmation: true };
};

export const canEdit = (appointment: Appointment): ActionValidation => {
  if (appointment.treated) {
    return { allowed: false, message: "Treated appointments cannot be edited" };
  }
  return { allowed: true, needsConfirmation: true };
};

export const canMarkEmergency = (appointment: Appointment): ActionValidation => {
  if (appointment.status !== "ACCEPTED") {
    return { allowed: false, message: "Only ACCEPTED appointments can be marked as emergency" };
  }
  return { allowed: true, needsConfirmation: true };
};

// Sorting function for emergency appointments
export const sortAppointments = (appointments: Appointment[]): Appointment[] => {
  return [...appointments].sort((a, b) => {
    // Emergency appointments first
    if (a.isEmergency && !b.isEmergency) return -1;
    if (!a.isEmergency && b.isEmergency) return 1;
    
    // If both are emergency or both are not, sort by appointment date/time
    const dateA = new Date(a.appointmentDateTime).getTime();
    const dateB = new Date(b.appointmentDateTime).getTime();
    return dateA - dateB;
  });
};