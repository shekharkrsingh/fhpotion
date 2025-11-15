import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { router } from "expo-router";
import { AppState, AppStateStatus } from "react-native";
import { store } from "@/newStore";
import { addAppointment } from "@/newStore/slices/appointmentSlice";
import { addNotification, Notification, NotificationType } from "@/newStore/slices/notificationSlice";
import { webSocketEndpoints } from "@/newService/config/websocketEndpoints";
import { getValidToken } from "@/utils/tokenService";

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
  private subscription: StompSubscription | null = null;
  private appStateListener: ((state: AppStateStatus) => void) | null = null;
  private appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;
  private connectionPromise: Promise<void> | null = null;

  private get isConnected(): boolean {
    return !!this.stompClient?.connected;
  }

  public async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.isConnected) {
      return;
    }

    // If connection is in progress, return the existing promise (prevents race condition)
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    // Create new connection promise
    this.isConnecting = true;
    this.connectionPromise = this.attemptConnection();

    try {
      await this.connectionPromise;
    } finally {
      // Clear promise after connection completes (success or failure)
      this.connectionPromise = null;
    }
  }

  private async attemptConnection(): Promise<void> {
    try {
      // getValidToken automatically checks expiration and redirects if invalid
      const token = await getValidToken();
      if (!token) {
        // getValidToken already handled redirect
        console.warn("WebSocket: Authentication token not found or expired");
        this.isConnecting = false;
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
          try {
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
          } catch (error) {
            console.error("WebSocket: Error in STOMP error handler", error);
            this.cleanup();
          }
        },
        onWebSocketClose: (event) => {
          console.log("WebSocket: Connection closed", event);
          try {
            if (event.code === 1008 || event.code === 1002) {
              console.error("WebSocket: Connection closed due to authentication failure");
              this.cleanup();
              router.replace('/(auth)');
              return;
            }
            this.handleDisconnect();
          } catch (error) {
            console.error("WebSocket: Error in close handler", error);
            this.cleanup();
          }
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
    } finally {
      // Ensure isConnecting is reset even if there's an unexpected error
      this.isConnecting = false;
    }
  }

  private subscribeToDoctorChannel(doctorId: string): void {
    if (!this.stompClient || !this.isConnected) {
      console.warn("WebSocket: Cannot subscribe - no active connection");
      return;
    }

    // Unsubscribe existing subscription if any
    if (this.subscription) {
      try {
        if (this.stompClient && this.isConnected) {
          this.subscription.unsubscribe();
        }
      } catch (error) {
        console.warn("WebSocket: Error unsubscribing from previous channel", error);
      }
      this.subscription = null;
    }

    // Create new subscription and store reference
    try {
      if (this.stompClient && this.isConnected) {
        this.subscription = this.stompClient.subscribe(
          webSocketEndpoints.appointmentUpdate(doctorId),
          (message: IMessage) => {
            try {
              const update = JSON.parse(message.body);
              this.handleIncomingMessage(update);
            } catch (error) {
              console.error("WebSocket: Error parsing message", error);
            }
          }
        );
      }
    } catch (error) {
      console.error("WebSocket: Error subscribing to channel", error);
    }
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
    // Validate and ensure type matches NotificationType enum
    const validType: NotificationType = 
      ['SYSTEM', 'INFO', 'UPDATE', 'ALERT', 'EMERGENCY'].includes(notificationData.type)
        ? notificationData.type as NotificationType
        : 'SYSTEM'; // Default to SYSTEM if invalid type
    
    const notification: Notification = {
      id: notificationData.id || `notification-${Date.now()}`,
      type: validType,
      title: notificationData.title || 'New Notification',
      message: notificationData.message || '',
      isRead: notificationData.isRead || false,
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
    // Unsubscribe from channel
    if (this.subscription) {
      try {
        if (this.stompClient && this.isConnected) {
          this.subscription.unsubscribe();
        }
      } catch (error) {
        console.warn("WebSocket: Error unsubscribing during cleanup", error);
      }
      this.subscription = null;
    }

    // Deactivate and clear client
    if (this.stompClient) {
      try {
        if (this.stompClient.active) {
          this.stompClient.deactivate();
        }
      } catch (error) {
        console.warn("WebSocket: Error deactivating client", error);
      }
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

  /**
   * Initialize AppState listener to disconnect WebSocket when app goes to background
   * and reconnect when app comes to foreground
   */
  public initializeAppStateListener(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    this.appStateListener = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log("WebSocket: App going to background, disconnecting");
        this.disconnect();
      } else if (nextAppState === 'active') {
        console.log("WebSocket: App coming to foreground, reconnecting");
        this.ensureConnected();
      }
    };

    this.appStateSubscription = AppState.addEventListener('change', this.appStateListener);
  }

  /**
   * Remove AppState listener (call on app unmount or logout)
   */
  public removeAppStateListener(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
      this.appStateListener = null;
    }
  }
}

export const websocketAppointment = new WebsocketService();