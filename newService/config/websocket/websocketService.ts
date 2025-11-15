import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { store } from "@/newStore";
import { addAppointment } from "@/newStore/slices/appointmentSlice";
import { addNotification } from "@/newStore/slices/notificationSlice";
import { webSocketEndpoints } from "@/newService/config/websocketEndpoints";

interface WebSocketMessage {
  type: 'APPOINTMENT' | 'NOTIFICATION';
  payload: any;
}

class WebsocketService {
  private stompClient: Client | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private get isConnected(): boolean {
    return !!this.stompClient?.connected;
  }

  public async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) return;

    this.isConnecting = true;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("WebSocket: Authentication token not found");
        this.isConnecting = false;
        router.replace('/(auth)');
        return;
      }

      const wsUrl = `${webSocketEndpoints.handShake}?token=${encodeURIComponent(token)}`;
      const socket = new SockJS(wsUrl);

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 0,
        onConnect: () => {
          console.log("WebSocket: Successfully connected and authenticated");
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          
          const profile = store.getState().profile;
          const doctorId = profile?.doctorId;
          if (doctorId) {
            this.subscribeToDoctorChannel(doctorId);
          }
        },
        onStompError: (frame) => {
          console.error("WebSocket: STOMP error", frame);
          if (frame.headers && frame.headers.message && 
              (frame.headers.message.includes("401") || 
               frame.headers.message.includes("UNAUTHORIZED") ||
               frame.headers.message.includes("authentication"))) {
            console.error("WebSocket: Authentication failed - redirecting to login");
            this.cleanup();
            router.replace('/(auth)');
            return;
          }
          this.handleDisconnect();
        },
        onWebSocketClose: (event) => {
          console.log("WebSocket: Connection closed", event);
          if (event.code === 1008 || event.code === 1002) {
            console.error("WebSocket: Connection closed due to authentication failure");
            this.cleanup();
            router.replace('/(auth)');
            return;
          }
          this.handleDisconnect();
        },
        onDisconnect: () => {
          console.log("WebSocket: Disconnected");
        },
      });

      this.stompClient.activate();
    } catch (error: any) {
      console.error("WebSocket: Connection error", error);
      this.isConnecting = false;
      
      if (error?.status === 401 || error?.message?.includes("401") || 
          error?.message?.includes("UNAUTHORIZED")) {
        router.replace('/(auth)');
        return;
      }
      
      this.handleDisconnect();
    }
  }

  private subscribeToDoctorChannel(doctorId: string): void {
    if (!this.stompClient) return;

    this.stompClient.subscribe(
      webSocketEndpoints.appointmentUpdate(doctorId),
      (message: IMessage) => {
        const update = JSON.parse(message.body);
        this.handleIncomingMessage(update);
      }
    );
  }

  private handleIncomingMessage(message: WebSocketMessage): void {
    try {
      switch (message.type) {
        case 'APPOINTMENT':
          this.handleAppointmentUpdate(message.payload);
          break;
        
        case 'NOTIFICATION':
          this.handleNotificationUpdate(message.payload);
          break;
        
        default:
          console.warn('Unknown message type:', message.type);
          break;
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  private handleAppointmentUpdate(updatedAppointment: any): void {
    store.dispatch(addAppointment(updatedAppointment))
  }

  private handleNotificationUpdate(notificationData: any): void {
    const notification: Notification = {
      id: notificationData.id || `notification-${Date.now()}`,
      type: notificationData.type || 'general',
      title: notificationData.title || 'New Notification',
      message: notificationData.message || '',
      isRead: false,
      createdAt: notificationData.createdAt || new Date().toISOString(),
    };

    store.dispatch(addNotification(notification));
  }

  private handleDisconnect(): void {
    this.cleanup();
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    const delay = Math.min(5000 * this.reconnectAttempts, 15000);
    this.reconnectAttempts++;

    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private cleanup(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.isConnecting = false;
  }

  public disconnect(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.cleanup();
    this.reconnectAttempts = 0;
  }

  public async forceReconnect(): Promise<void> {
    this.disconnect();
    await this.connect();
  }

  public async ensureConnected(): Promise<void> {
    if (!this.isConnected && !this.isConnecting) {
      await this.connect();
    }
  }
}

export const websocketAppointment = new WebsocketService();