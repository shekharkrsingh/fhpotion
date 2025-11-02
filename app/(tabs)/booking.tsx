import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';

import { RootState, AppDispatch } from '@/newStore';
import { getAppointments, updateAppointment } from '@/newService/config/api/appointmentApi';
import { websocketAppointment } from '@/newService/config/websocket/websocketAppointment';

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

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Protocol',
      'Are you sure you want to activate emergency protocol? This will prioritize emergency cases.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Activate',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Emergency', 'Emergency protocol activated! Prioritizing emergency cases.');
          },
        },
      ]
    );
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

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={bookingStyles.container}>
        <BookingHeader 
          onSearch={handleSearch}
          onEmergency={handleEmergency}
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
        />
      </View>
    </GestureHandlerRootView>
  );
}