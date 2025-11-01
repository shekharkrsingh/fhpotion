import { WS_BASE_URL } from "./apiConfig";

export const webSocketEndpoints = {
  handShake: `${WS_BASE_URL}ws`,
  appointmentUpdate: (doctorId: string) => `/topic/appointments/${doctorId}`,
};
