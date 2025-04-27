// // websocket.service.ts
// import { Client, Message, over } from 'stompjs';
// import SockJS from 'sockjs-client';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// class WebSocketService {
//   private stompClient: Client | null = null;
//   private readonly serverUrl = 'http://localhost:8080/ws'; // Update if needed
//   private isConnected = false;
//   private reconnectAttempts = 0;
//   private readonly maxReconnectAttempts = 5;

//   public async connect() {
//     if (this.isConnected) {
//       console.log('WebSocket already connected');
//       return;
//     }

//     try {
//       const authToken = await AsyncStorage.getItem('authToken');
//       if (!authToken) {
//         console.error('No auth token found');
//         // Handle redirect to login screen in React Native
//         // navigation.navigate('Login');
//         return;
//       }

//       console.log('Connecting to WebSocket...');
//       const socket = new SockJS(this.serverUrl);
//       this.stompClient = over(socket);

//       // Enable debugging
//       this.stompClient.debug = (str) => console.log('STOMP:', str);

//       this.stompClient.connect(
//         { Authorization: `Bearer ${authToken}` },
//         () => this.onConnectSuccess(),
//         (error) => this.onConnectError(error)
//       );
//     } catch (error) {
//       console.error('Connection error:', error);
//     }
//   }

//   private onConnectSuccess() {
//     this.isConnected = true;
//     this.reconnectAttempts = 0;
//     console.log('✅ WebSocket connected successfully');

//     this.subscribeToAppointments();
//   }

//   private subscribeToAppointments() {
//     if (!this.stompClient) return;

//     this.stompClient.subscribe(
//       '/user/queue/appointments',
//       (message: Message) => {
//         try {
//           const appointment = JSON.parse(message.body);
//           console.log('📩 New appointment update:', appointment);
//           this.handleAppointmentUpdate(appointment);
//         } catch (error) {
//           console.error('Error parsing appointment:', error);
//         }
//       }
//     );
//   }

//   private handleAppointmentUpdate(appointment: any) {
//     // Implement your appointment handling logic
//     console.log('Appointment received:', appointment);
//     // Example: Update your React Native state or UI
//     // this.updateAppointmentList(appointment);
//   }

//   private onConnectError(error: any) {
//     this.isConnected = false;
//     console.error('❌ WebSocket connection error:', error);

//     if (this.reconnectAttempts < this.maxReconnectAttempts) {
//       this.reconnectAttempts++;
//       console.log(`Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
//       setTimeout(() => this.connect(), 5000);
//     } else {
//       console.error('Max reconnection attempts reached');
//     }
//   }

//   public disconnect() {
//     if (this.stompClient && this.isConnected) {
//       this.stompClient.disconnect(() => {
//         this.isConnected = false;
//         console.log('WebSocket disconnected');
//       });
//     }
//   }
// }

// // Singleton instance
// export const webSocketService = new WebSocketService();