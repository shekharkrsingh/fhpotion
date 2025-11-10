import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

import { RootState, AppDispatch } from '@/newStore';
import { 
  getAppointments, 
  updateAppointment, 
  updateEmergencyStatus, 
  cancelAppointment 
} from '@/newService/config/api/appointmentApi';
import { websocketAppointment } from '@/newService/config/websocket/websocketService';

import BookingHeader from '@/newComponents/bookingHeader';
import BookingFilterButtons from '@/newComponents/bookingFilterButtons';
import BookingList from '@/newComponents/bookingList';
import AlertPopup from '@/newComponents/alertPopup';
import { bookingStyles } from '@/assets/styles/booking.styles';

export default function BookingScreen() {
  const { appointments, loading, error, success } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch<AppDispatch>();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'treated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkAction, setSelectedMarkAction] = useState<'treated' | 'emergency' | 'cancel' | 'edit'>('treated');

  // Confirmation Popup States
  const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState<(() => Promise<void>) | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    try {
      await dispatch(getAppointments());
      await websocketAppointment.connect();
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      showToast('Failed to fetch appointments. Please try again.', 'error');
    }
  };

  const update = async (id: string, change: any) => {
    try {
      const result = await dispatch(updateAppointment( id,change ));
      if (result) {
        return true;
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      showToast('Failed to update appointment. Please try again.', 'error');
      throw error;
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
    
    if (action === 'emergency') {
      showToast('Emergency protocol activated! All appointments will now show emergency action buttons.', 'info');
    }
  };

  // Toast helper function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info',
      text2: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const showConfirmation = (message: string, action: () => Promise<void>) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action);
    setConfirmationPopupVisible(true);
  };

  const handleConfirmationClose = async (confirmed: boolean) => {
    setConfirmationPopupVisible(false);
    
    if (confirmed && confirmationAction && !isProcessing) {
      setIsProcessing(true);
      try {
        await confirmationAction();
      } catch (error) {
        console.error('Error in confirmation action:', error);
      } finally {
        setIsProcessing(false);
      }
    }
    
    // Reset the confirmation action to prevent multiple calls
    setConfirmationAction(null);
  };

  // Safe filtering with fallback to empty array
  const filteredData = useMemo(() => {
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
      try {
        await update(id, { availableAtClinic: value });
        showToast(`Appointment ${value ? 'marked as available' : 'marked as unavailable'}`, 'success');
      } catch (error) {
        // Error handled in update function
      }
    } else {
      showToast("Cannot change availability status. Payment is required before changing availability.", 'error');
    }
  };

  const togglePaymentStatus = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    if (itemToUpdate) {
      try {
        await update(id, { paymentStatus: !itemToUpdate.paymentStatus });
        showToast(`Payment status ${!itemToUpdate.paymentStatus ? 'marked as paid' : 'marked as unpaid'}`, 'success');
      } catch (error) {
        // Error handled in update function
      }
    }
  };

  const toggleTreatedStatus = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);

    if (!itemToUpdate) {
      showToast("Appointment not found.", 'error');
      return;
    }

    if (!itemToUpdate.paymentStatus || !itemToUpdate.availableAtClinic) {
      showToast("Item must be paid and available to toggle the treated status.", 'error');
      return;
    }

    try {
      await update(id, { treated: !itemToUpdate.treated });
      showToast(`Appointment ${!itemToUpdate.treated ? 'marked as treated' : 'marked as untreated'}`, 'success');
    } catch (error) {
      // Error handled in update function
    }
  };

  const markAsEmergency = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    
    if (!itemToUpdate) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const isCurrentlyEmergency = itemToUpdate.isEmergency || false;
    const actionMessage = isCurrentlyEmergency 
      ? `Are you sure you want to remove emergency status from ${itemToUpdate.patientName}'s appointment?`
      : `Are you sure you want to mark ${itemToUpdate.patientName}'s appointment as emergency?`;

    const successMessage = isCurrentlyEmergency
      ? 'Emergency status removed successfully.'
      : 'Appointment marked as emergency.';

    showConfirmation(
      actionMessage,
      async () => {
        try {
          const result = await dispatch(updateEmergencyStatus( 
            itemToUpdate.appointmentId,
            !isCurrentlyEmergency 
          ));
          
          if (result) {
            showToast(successMessage, 'success');
          } else {
            showToast(`Failed to ${isCurrentlyEmergency ? 'remove emergency status' : 'mark as emergency'}.`, 'error');
          }
        } catch (error) {
          console.error('Failed to update emergency status:', error);
          showToast(`Failed to ${isCurrentlyEmergency ? 'remove emergency status' : 'mark as emergency'}.`, 'error');
        }
      }
    );
  };

  const cancelAppointmentHandler = async (id: string) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    
    if (!itemToUpdate) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const isCurrentlyCancelled = itemToUpdate.status === 'cancelled';
    const actionMessage = isCurrentlyCancelled
      ? `Are you sure you want to restore ${itemToUpdate.patientName}'s appointment?`
      : `Are you sure you want to cancel ${itemToUpdate.patientName}'s appointment?`;

    const successMessage = isCurrentlyCancelled
      ? 'Appointment restored successfully.'
      : 'Appointment cancelled successfully.';

    showConfirmation(
      actionMessage,
      async () => {
        try {
          let result;
          if (isCurrentlyCancelled) {
            // Restore appointment - mark as scheduled and available
            result = await update(id, { 
              status: 'scheduled',
              availableAtClinic: true 
            });
          } else {
            // Cancel appointment
            result = await dispatch(cancelAppointment(itemToUpdate.appointmentId));
          }
          
          if (result) {
            showToast(successMessage, 'success');
          } else {
            showToast(`Failed to ${isCurrentlyCancelled ? 'restore' : 'cancel'} appointment.`, 'error');
          }
        } catch (error) {
          console.error('Failed to cancel/restore appointment:', error);
          showToast(`Failed to ${isCurrentlyCancelled ? 'restore' : 'cancel'} appointment.`, 'error');
        }
      }
    );
  };

  const editAppointment = async (id: string, updates: any) => {
    const itemToUpdate = appointments?.find(item => item.appointmentId === id);
    
    if (!itemToUpdate) {
      showToast("Appointment not found.", 'error');
      return;
    }

    // For now, we'll show a simple edit example
    // In a real app, you would have a proper edit form with more fields
    showConfirmation(
      'Edit Patient Name - This will update the patient name. Continue?',
      async () => {
        try {
          await update(id, { 
            patientName: itemToUpdate.patientName + ' (Updated)',
            ...updates
          });
          showToast('Appointment updated successfully.', 'success');
        } catch (error) {
          // Error handled in update function
        }
      }
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
          cancelAppointment={cancelAppointmentHandler}
          editAppointment={editAppointment}
          selectedMarkAction={selectedMarkAction}
        />

        {/* Confirmation Popup for actions */}
        <AlertPopup
          message={confirmationMessage}
          visible={confirmationPopupVisible}
          onClose={handleConfirmationClose}
          type="confirmation"
          variant="warning"
          title="Confirmation Required"
          confirmText="Yes"
          cancelText="No"
          showIcon={true}
        />

        {/* Toast Component */}
        <Toast />
      </View>
    </GestureHandlerRootView>
  );
}