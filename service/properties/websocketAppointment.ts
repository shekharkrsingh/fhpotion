import SockJS from "sockjs-client";
import { Client, Frame, Message, over } from "stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "@/redux/store";

// Types
export interface Appointment {
  appointmentId: string;
  doctorId: string;
  patientName: string;
  contact: string;
  description: string | null;
  appointmentDateTime: string;
  bookingDateTime: string;
  availableAtClinic: boolean;
  treated: boolean;
  treatedDateTime: string | null;
  status: string;
  appointmentType: string;
  paymentStatus: boolean;
}

interface WebSocketConfig {
  url: string;
  heartbeatOutgoing?: number;
  heartbeatIncoming?: number;
}

// Constants
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;
const DEFAULT_HEARTBEAT = 10000;
const defaultConfig: WebSocketConfig = {
  url: "http://localhost:8080/ws",
  heartbeatOutgoing: DEFAULT_HEARTBEAT,
  heartbeatIncoming: DEFAULT_HEARTBEAT,
};

// WebSocket client instance
let stompClient: Client | null = null;
let reconnectAttempts = 0;
let reconnectTimeout: NodeJS.Timeout | null = null;

// Helper Functions
const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const cleanup = (): void => {
  stompClient = null;
  reconnectAttempts = 0;
};

const handleReconnect = (): void => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = RECONNECT_DELAY * reconnectAttempts;
    console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${delay}ms...`);
    
    reconnectTimeout = setTimeout(() => {
      connectAppointmentWebSocket().catch(console.error);
    }, delay);
  } else {
    console.error("Max reconnection attempts reached");
  }
};

// Core Functions
const updateAppointmentInStore = (updatedAppointment: Appointment): void => {
  const currentState = store.getState();
  const currentAppointments = [...currentState.appointments.data];

  const appointmentIndex = currentAppointments.findIndex(
    (app) => app.appointmentId === updatedAppointment.appointmentId
  );

  if (appointmentIndex !== -1) {
    currentAppointments[appointmentIndex] = updatedAppointment;
    store.dispatch({
      type: 'appointments/setAppointments',
      payload: currentAppointments
    });
    console.log("🔄 Updated appointment in store");
  } else {
    console.log("⚠️ Received update for non-existing appointment, ignoring");
  }
};

const onConnectSuccess = (frame?: Frame): void => {
  console.log("✅ Connected to WebSocket", frame);
  reconnectAttempts = 0;

  stompClient?.subscribe("/user/queue/appointments", (message: Message) => {
    try {
      const updatedAppointment: Appointment = JSON.parse(message.body);
      console.log("📩 Received appointment update:", updatedAppointment);
      updateAppointmentInStore(updatedAppointment);
    } catch (error) {
      console.error("Error processing WebSocket message:", getErrorMessage(error));
    }
  });
};

const onConnectError = (error: string | Frame): void => {
  const errorMessage = typeof error === 'string' ? error : 'Connection failed';
  console.error("❌ WebSocket connection error:", errorMessage);
  handleReconnect();
};

// Public API
export const connectAppointmentWebSocket = async (
  config: Partial<WebSocketConfig> = {}
): Promise<void> => {
  try {
    // Clear any pending reconnection attempts
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("User not logged in");
    }

    // Disconnect existing connection if any
    await disconnectAppointmentWebSocket();

    const mergedConfig: WebSocketConfig = { ...defaultConfig, ...config };

    const socket = new SockJS(mergedConfig.url);
    stompClient = over(socket);

    stompClient.heartbeat.outgoing = mergedConfig.heartbeatOutgoing ?? DEFAULT_HEARTBEAT;
    stompClient.heartbeat.incoming = mergedConfig.heartbeatIncoming ?? DEFAULT_HEARTBEAT;

    // Connect with proper STOMP headers
    stompClient.connect(
      {
        // Standard STOMP headers
        login: '', // Empty if not using STOMP auth
        passcode: '', // Empty if not using STOMP auth
        // Custom headers
        'Authorization': `Bearer ${authToken}`
      },
      onConnectSuccess,
      onConnectError
    );
  } catch (error) {
    console.error("WebSocket initialization error:", getErrorMessage(error));
    handleReconnect();
  }
};

export const disconnectAppointmentWebSocket = async (): Promise<void> => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (stompClient) {
    return new Promise((resolve) => {
      if (stompClient?.connected) {
        stompClient.disconnect(() => {
          console.log("🔌 Disconnected from WebSocket");
          cleanup();
          resolve();
        });
      } else {
        cleanup();
        resolve();
      }
    });
  }
  return Promise.resolve();
};