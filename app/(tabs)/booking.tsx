import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@/redux/store';
import { getAppointments, updateAppointment } from '@/service/properties/appointmentApi';
import websocketAppointment from '@/service/properties/websocketAppointment';

import BookingHeader from '@/newComponents/bookingHeader';
import BookingFilterButtons from '@/newComponents/bookingFilterButtons';
import BookingList from '@/newComponents/bookingList';
import { bookingStyles } from '@/assets/styles/booking.styles';

export default function BookingScreen() {
  const { data, loading, error, success } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'treated'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    await getAppointments(dispatch);
    await websocketAppointment.connect();
  };

  const update = async (id: string, change: any) => {
    await updateAppointment(dispatch, id, change);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

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
            // Filter to show only emergency cases or implement your emergency logic
            Alert.alert('Emergency', 'Emergency protocol activated! Prioritizing emergency cases.');
            // You can add your emergency logic here, like:
            // - Filter to show only emergency appointments
            // - Send emergency notification
            // - Trigger emergency workflow
          },
        },
      ]
    );
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];
    
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
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.contact.includes(searchQuery)
      );
    }

    return filtered;
  }, [data, availabilityFilter, searchQuery]);

  const toggleAvailability = async (id: string, value: boolean) => {
    const itemToToggle = data.find((item) => item.appointmentId === id);

    if (itemToToggle && itemToToggle.paymentStatus) {
      await update(id, { availableAtClinic: value });
    } else {
      alert("Cannot change availability status. Payment is required before changing availability.");
    }
  };

  const togglePaymentStatus = async (id: string) => {
    const itemToUpdate = data.find(item => item.appointmentId === id);
    if (itemToUpdate) {
      await update(id, { paymentStatus: !itemToUpdate.paymentStatus });
    }
  };

  const toggleTreatedStatus = async (id: string) => {
    const itemToUpdate = data.find(item => item.appointmentId === id);

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
  }, []);

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