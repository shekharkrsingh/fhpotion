import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
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
      const profile = store.getState().profile;
      const doctorId = profile?.doctorId;

      if (!doctorId) {
        this.isConnecting = false;
        return;
      }

      const socket = new SockJS(webSocketEndpoints.handShake);

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 0,
        onConnect: () => {
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.subscribeToDoctorChannel(doctorId);
        },
        onStompError: () => {
          this.handleDisconnect();
        },
        onWebSocketClose: () => {
          this.handleDisconnect();
        },
      });

      this.stompClient.activate();
    } catch (error) {
      this.isConnecting = false;
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