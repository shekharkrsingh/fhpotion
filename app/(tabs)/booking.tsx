import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';

import { RootState, AppDispatch } from '@/newStore';
import { getAppointments, updateAppointment } from '@/newService/config/api/appointmentApi';
import { websocketAppointment } from '@/newService/config/websocket/websocketService';

import BookingHeader from '@/newComponents/bookingHeader';
import BookingFilterButtons from '@/newComponents/bookingFilterButtons';
import BookingList from '@/newComponents/bookingList';
import { bookingStyles } from '@/assets/styles/booking.styles';

export default function BookingScreen() {
  const { appointments, loading, error, success } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch<AppDispatch>();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'treated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkAction, setSelectedMarkAction] = useState<'treated' | 'emergency' | 'cancel' | 'edit'>('treated');

  const fetchData = async () => {
    try {
      await dispatch(getAppointments());
      await websocketAppointment.connect();
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const update = async (id: string, change: any) => {
    try {
      await dispatch(updateAppointment(id, change));
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment. Please try again.');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [dispatch]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleMarkAction = (action: 'treated' | 'emergency' | 'cancel' | 'edit') => {
    setSelectedMarkAction(action);
    
    // Show confirmation for emergency action
    if (action === 'emergency') {
      Alert.alert(
        'Emergency Protocol',
        'Emergency protocol activated! All appointments will now show emergency action buttons.',
        [{ text: 'OK' }]
      );
    }
  };

  // Safe filtering with fallback to empty array
  const filteredData = useMemo(() => {
    // Ensure appointments is always an array
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    
    let filtered = [...safeAppointments];
    
    switch (availabilityFilter) {
      case 'available':
        filtered = filtered.filter(item => item.availableAtClinic && !item.treated);
        break;
      case 'treated':
        filtered = filtered.filter(item => item.treated);
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.contact?.includes(searchQuery)
      );
    }

    return filtered;
  }, [appointments, availabilityFilter, searchQuery]);

  const toggleAvailability = async (id: string, value: boolean) => {
    const itemToToggle = appointments?.find((item) => item.appointmentId === id);

    if (itemToToggle && itemToToggle.paymentStatus) {
      await update(id, { availableAtClinic: value });
    } else {
      alert("Cannot change availability status. Payment is required before changing availability.");
    }
  };

  const togglePaymentStatus = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    if (itemToUpdate) {
      await update(id, { paymentStatus: !itemToUpdate.paymentStatus });
    }
  };

  const toggleTreatedStatus = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);

    if (!itemToUpdate) {
      alert("Appointment not found.");
      return;
    }

    if (!itemToUpdate.paymentStatus || !itemToUpdate.availableAtClinic) {
      alert("Item must be paid and available to toggle the treated status.");
      return;
    }

    await update(id, { treated: !itemToUpdate.treated });
  };

  const markAsEmergency = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    
    if (!itemToUpdate) {
      alert("Appointment not found.");
      return;
    }

    Alert.alert(
      'Mark as Emergency',
      `Are you sure you want to mark ${itemToUpdate.patientName}'s appointment as emergency?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mark as Emergency',
          style: 'destructive',
          onPress: async () => {
            await update(id, { 
              isEmergency: true,
              status: 'emergency'
            });
            Alert.alert('Success', 'Appointment marked as emergency.');
          },
        },
      ]
    );
  };

  const cancelAppointment = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    
    if (!itemToUpdate) {
      alert("Appointment not found.");
      return;
    }

    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel ${itemToUpdate.patientName}'s appointment?`,
      [
        {
          text: 'Keep Appointment',
          style: 'cancel',
        },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: async () => {
            await update(id, { 
              status: 'cancelled',
              availableAtClinic: false
            });
            Alert.alert('Success', 'Appointment cancelled successfully.');
          },
        },
      ]
    );
  };

  const editAppointment = async (id: string, updates: any) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    
    if (!itemToUpdate) {
      alert("Appointment not found.");
      return;
    }

    // For now, we'll show a simple edit example
    // In a real app, you would have a proper edit form with more fields
    Alert.prompt(
      'Edit Patient Name',
      'Enter new patient name:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async (newName) => {
            if (newName && newName.trim()) {
              await update(id, { 
                patientName: newName.trim(),
                ...updates
              });
              Alert.alert('Success', 'Appointment updated successfully.');
            }
          },
        },
      ],
      'plain-text',
      itemToUpdate.patientName
    );
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={bookingStyles.container}>
        <BookingHeader 
          onSearch={handleSearch}
          onMarkAction={handleMarkAction}
        />
        
        <BookingFilterButtons
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
        />

        <BookingList
          filteredData={filteredData}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          refreshing={refreshing}
          onRefresh={onRefresh}
          toggleAvailability={toggleAvailability}
          togglePaymentStatus={togglePaymentStatus}
          toggleTreatedStatus={toggleTreatedStatus}
          markAsEmergency={markAsEmergency}
          cancelAppointment={cancelAppointment}
          editAppointment={editAppointment}
          selectedMarkAction={selectedMarkAction}
        />
      </View>
    </GestureHandlerRootView>
  );
}