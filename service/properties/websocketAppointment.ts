import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, store } from '../../redux/store';
import { setAppointments } from '../../redux/slices/appointmentSlice';
import { webSocketEndpoint } from '@/apiFactory';

class WebsocketAppointment {
  private stompClient: Client | null = null;

  public async connect(): Promise<void> {
    // ✅ Only connect if no active connection exists
    if (this.stompClient && this.stompClient.connected) {
      console.log('⚠️ WebSocket connection already established');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }
      
      // Access Redux state directly from store
      const profileData = store.getState().profile;

      const socket = new SockJS(webSocketEndpoint.handShake);
      
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        
        onConnect: () => {
          console.log('✅ WebSocket connected');
          this.subscribeToUpdates(profileData.doctorId);
        },
        
        onStompError: (frame) => {
          console.error('WebSocket error:', frame);
        }
      });

      this.stompClient.activate();

    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  }

  private subscribeToUpdates(doctorId: string): void {
    if (!this.stompClient) return;

    this.stompClient.subscribe(webSocketEndpoint.appointmentUpdate(doctorId), (message: IMessage) => {
      const update = JSON.parse(message.body);
      console.log('New appointment update:', update);
      this.handleAppointmentUpdate(update);
    });
  }

  private handleAppointmentUpdate(updatedAppointment: any): void {
    const currentState = store.getState();
    const currentAppointments = currentState.appointments.data;
    
    const existingIndex = currentAppointments.findIndex(
      (appointment: any) => appointment.appointmentId === updatedAppointment.appointmentId
    );

    let newAppointments: any[];

    if (existingIndex !== -1) {
      newAppointments = currentAppointments.map((appointment: any, index: number) => 
        index === existingIndex ? updatedAppointment : appointment
      );
      console.log(`✅ Updated appointment: ${updatedAppointment.appointmentId}`);
    } else {
      newAppointments = [updatedAppointment, ...currentAppointments];
      console.log(`✅ Added new appointment: ${updatedAppointment.appointmentId}`);
    }

    store.dispatch(setAppointments(newAppointments));
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('WebSocket disconnected');
    }
  }
}

export default new WebsocketAppointment();
