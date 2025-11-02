import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { store } from "@/newStore";
import { setAppointments } from "@/newStore/slices/appointmentSlice";
import { webSocketEndpoints } from "@/newService/config/websocketEndpoints";

class WebsocketAppointment {
  private stompClient: Client | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  /** Returns true if socket is actively connected */
  private get isConnected(): boolean {
    return !!this.stompClient?.connected;
  }

  /**
   * Establish a WebSocket connection if not already connected.
   * Prevents duplicate or concurrent connection attempts.
   */
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

  /** Subscribe to doctor's appointment updates */
  private subscribeToDoctorChannel(doctorId: string): void {
    if (!this.stompClient) return;

    this.stompClient.subscribe(
      webSocketEndpoints.appointmentUpdate(doctorId),
      (message: IMessage) => {
        const update = JSON.parse(message.body);
        this.updateAppointments(update);
      }
    );
  }

  /** Update Redux store with new or modified appointment */
  private updateAppointments(updated: any): void {
    const state = store.getState();
    const existingAppointments = state.appointments.appointments;

    const index = existingAppointments.findIndex(
      (a: any) => a.appointmentId === updated.appointmentId
    );

    const newAppointments =
      index !== -1
        ? existingAppointments.map((a: any, i: number) =>
            i === index ? updated : a
          )
        : [updated, ...existingAppointments];

    store.dispatch(setAppointments(newAppointments));
  }

  /** Handles disconnect events with scheduled reconnection attempts */
  private handleDisconnect(): void {
    this.cleanup();
    this.scheduleReconnect();
  }

  /** Schedule a reconnect attempt with exponential backoff */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    const delay = Math.min(5000 * this.reconnectAttempts, 15000);
    this.reconnectAttempts++;

    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /** Cleanly deactivate current WebSocket connection */
  private cleanup(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.isConnecting = false;
  }

  /** Disconnect manually and reset reconnect attempts */
  public disconnect(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.cleanup();
    this.reconnectAttempts = 0;
  }

  /** Force a complete reconnection immediately */
  public async forceReconnect(): Promise<void> {
    this.disconnect();
    await this.connect();
  }

  /** Ensure connection is active; reconnect immediately if not */
  public async ensureConnected(): Promise<void> {
    if (!this.isConnected && !this.isConnecting) {
      await this.connect();
    }
  }
}

export const websocketAppointment = new WebsocketAppointment();
