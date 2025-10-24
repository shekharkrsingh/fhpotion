import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const AppointmentsScreen: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const connectWebSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const socket = new SockJS('http://localhost:8080/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        
        onConnect: () => {
          console.log('✅ WebSocket connected');
          setIsConnected(true);
          subscribeToUpdates(client);
        },
        
        onStompError: (frame) => {
          console.error('WebSocket error:', frame);
          setIsConnected(false);
        },
        
        onWebSocketClose: () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
        }
      });

      client.activate();
      setStompClient(client);

    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  };

  const subscribeToUpdates = (client: Client) => {
    client.subscribe('/user/queue/appointments', (message: IMessage) => {
      const update = JSON.parse(message.body);
      console.log('New appointment update:', update);
      setMessages(prev => [update, ...prev]);
    });

    client.subscribe('/topic/appointments', (message: IMessage) => {
      const update = JSON.parse(message.body);
      console.log('New topic update:', update);
      setMessages(prev => [update, ...prev]);
    });
  };

  const disconnectWebSocket = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setIsConnected(false);
      console.log('WebSocket disconnected');
    }
  };

  const renderMessage = (message: any, index: number) => (
    <View key={index} style={styles.messageCard}>
      <Text style={styles.messageTitle}>📅 Appointment Update</Text>
      <Text style={styles.messageDivider}>────────────────────</Text>
      {message.patientName && <Text style={styles.messageText}>Patient: {message.patientName}</Text>}
      {message.appointmentDateTime && (
        <Text style={styles.messageText}>
          Date: {new Date(message.appointmentDateTime).toLocaleString()}
        </Text>
      )}
      {message.appointmentDate && (
        <Text style={styles.messageText}>
          Date: {new Date(message.appointmentDate).toLocaleString()}
        </Text>
      )}
      {message.status && <Text style={styles.messageText}>Status: {message.status}</Text>}
      {message.action && <Text style={styles.messageText}>Action: {message.action}</Text>}
      {message.appointmentId && <Text style={styles.messageText}>ID: {message.appointmentId}</Text>}
      <Text style={styles.messageTime}>
        Received: {new Date().toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Updates</Text>
      
      <View style={styles.connectionStatus}>
        <Text style={[styles.statusText, isConnected ? styles.connected : styles.disconnected]}>
          {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.connectButton]} 
          onPress={connectWebSocket}
        >
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.disconnectButton]} 
          onPress={disconnectWebSocket}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Real-time Updates</Text>
      
      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <Text style={styles.noMessages}>No messages yet</Text>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  connectionStatus: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
  },
  connected: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  disconnected: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#28a745',
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  noMessages: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  messageCard: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  messageDivider: {
    color: '#666',
    marginVertical: 5,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 3,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default AppointmentsScreen;