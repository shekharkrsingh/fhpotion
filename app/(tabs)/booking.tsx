// booking.tsx - Fixed appointment lookup
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
import { 
  canMarkAvailable, 
  canMarkUnavailable, 
  canMarkPaid, 
  canMarkUnpaid, 
  canMarkTreated, 
  canMarkUntreated, 
  canCancel, 
  canEdit, 
  canMarkEmergency,
  sortAppointments,
  ActionValidation 
} from '@/utils/bookingActionHelpers';

export default function BookingScreen() {
  const { appointments, loading, error, success } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch<AppDispatch>();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkAction, setSelectedMarkAction] = useState<'treated' | 'emergency' | 'cancel' | 'edit'>('treated');

  // Single Confirmation Popup State
  const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    message: string;
    action: () => Promise<void>;
    appointmentId?: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const hasAttemptedInitialLoad = React.useRef(false);

  // Toast helper function - stable, no dependencies (moved before fetchData to avoid ReferenceError)
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info',
      text2: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  }, []); // No dependencies - Toast.show is stable

  // Helper function to find appointment safely
  const findAppointment = (id: string) => {
    return Array.isArray(appointments) 
      ? appointments.find(item => item.appointmentId === id)
      : undefined;
  };

  const fetchData = useCallback(async () => {
    try {
      await dispatch(getAppointments());
      await websocketAppointment.connect();
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      showToast('Failed to fetch appointments. Please try again.', 'error');
    }
  }, [dispatch, showToast]); // Include all dependencies

  const updateAppointmentHandler = async (id: string, change: any) => {
    try {
      // If editing, ensure status becomes ACCEPTED
      const updateData = selectedMarkAction === 'edit' 
        ? { ...change, status: "ACCEPTED" as const }
        : change;
        
      const result = await dispatch(updateAppointment(id, updateData));
      if (result) {
        return true;
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      // State is automatically reverted by the API error handler
      throw error;
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]); // Include fetchData dependency for correctness

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleMarkAction = (action: 'treated' | 'emergency' | 'cancel' | 'edit') => {
    setSelectedMarkAction(action);
    // Reset filter when changing mark action
    setAvailabilityFilter('all');
    
    if (action === 'emergency') {
      showToast('Emergency protocol activated!', 'info');
    }
  };

  // Single confirmation popup handler
  const showConfirmation = (message: string, action: () => Promise<void>, appointmentId?: string) => {
    // Prevent multiple popups
    if (confirmationPopupVisible) return;
    
    setConfirmationData({ message, action, appointmentId });
    setConfirmationPopupVisible(true);
  };

  const handleConfirmationClose = async (confirmed: boolean) => {
    setConfirmationPopupVisible(false);
    
    if (confirmed && confirmationData?.action && !isProcessing) {
      setIsProcessing(true);
      try {
        await confirmationData.action();
      } catch (error) {
        console.error('Error in confirmation action:', error);
      } finally {
        setIsProcessing(false);
      }
    }
    
    // Clear confirmation data after handling
    setConfirmationData(null);
  };

  // Enhanced filtering logic
  const filteredData = useMemo(() => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    
    let filtered = [...safeAppointments];
    
    // Apply filters based on selected mark action and availability filter
    switch (selectedMarkAction) {
      case 'treated':
        switch (availabilityFilter) {
          case 'available':
            filtered = filtered.filter(item => 
              item.availableAtClinic && 
              !item.treated && 
              item.status === "ACCEPTED"
            );
            break;
          case 'treated':
            filtered = filtered.filter(item => 
              item.treated && 
              item.status === "ACCEPTED"
            );
            break;
          case 'all':
            filtered = filtered.filter(item => item.status === "ACCEPTED");
            break;
        }
        break;
      
      case 'emergency':
        switch (availabilityFilter) {
          case 'emergency':
            filtered = filtered.filter(item => 
              item.isEmergency && 
              item.status === "ACCEPTED"
            );
            break;
          case 'non-emergency':
            filtered = filtered.filter(item => 
              !item.isEmergency && 
              item.status === "ACCEPTED"
            );
            break;
          case 'all':
            filtered = filtered.filter(item => item.status === "ACCEPTED");
            break;
        }
        break;
      
      case 'cancel':
        switch (availabilityFilter) {
          case 'cancelled':
            filtered = filtered.filter(item => item.status === "CANCELLED");
            break;
          case 'cancellable':
            filtered = filtered.filter(item => 
              item.status === "ACCEPTED" && 
              !item.treated
            );
            break;
          case 'all':
            // Include all appointments in cancel mode
            break;
        }
        break;
      
      case 'edit':
        switch (availabilityFilter) {
          case 'editable':
            filtered = filtered.filter(item => !item.treated);
            break;
          case 'all':
            // Include all appointments in edit mode
            break;
        }
        break;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.contact?.includes(searchQuery)
      );
    }

    // Apply emergency sorting (only for ACCEPTED emergency appointments)
    return sortAppointments(filtered);
  }, [appointments, selectedMarkAction, availabilityFilter, searchQuery]);

  // Action handlers with validation - FIXED APPOINTMENT LOOKUP
  const toggleAvailability = async (id: string, value: boolean) => {
    const appointment = findAppointment(id);
    if (!appointment) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const validation: ActionValidation = value ? canMarkAvailable(appointment) : canMarkUnavailable(appointment);
    
    if (!validation.allowed) {
      showToast(validation.message || "Action not allowed", 'error');
      return;
    }

    if (validation.needsConfirmation) {
      showConfirmation(
        `Are you sure you want to mark this appointment as ${value ? 'available' : 'unavailable'}?`,
        async () => {
          try {
            await updateAppointmentHandler(id, { availableAtClinic: value });
            showToast(`Appointment ${value ? 'marked as available' : 'marked as unavailable'}`, 'success');
          } catch (error) {
            // Error handled in update function
          }
        },
        id
      );
    } else {
      try {
        await updateAppointmentHandler(id, { availableAtClinic: value });
        showToast(`Appointment ${value ? 'marked as available' : 'marked as unavailable'}`, 'success');
      } catch (error) {
        // Error handled in update function
      }
    }
  };

  const togglePaymentStatus = async (id: string) => {
    const appointment = findAppointment(id);
    if (!appointment) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const newPaymentStatus = !appointment.paymentStatus;
    const validation: ActionValidation = newPaymentStatus ? canMarkPaid(appointment) : canMarkUnpaid(appointment);
    
    if (!validation.allowed) {
      showToast(validation.message || "Action not allowed", 'error');
      return;
    }

    if (validation.needsConfirmation) {
      showConfirmation(
        `Are you sure you want to mark this appointment as ${newPaymentStatus ? 'paid' : 'unpaid'}?`,
        async () => {
          try {
            await updateAppointmentHandler(id, { paymentStatus: newPaymentStatus });
            showToast(`Payment status ${newPaymentStatus ? 'marked as paid' : 'marked as unpaid'}`, 'success');
          } catch (error) {
            // Error handled in update function
          }
        },
        id
      );
    } else {
      try {
        await updateAppointmentHandler(id, { paymentStatus: newPaymentStatus });
        showToast(`Payment status ${newPaymentStatus ? 'marked as paid' : 'marked as unpaid'}`, 'success');
      } catch (error) {
        // Error handled in update function
      }
    }
  };

  const toggleTreatedStatus = async (id: string) => {
    console.log(id)
    const appointment = findAppointment(id);
    if (!appointment) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const newTreatedStatus = !appointment.treated;
    const validation: ActionValidation = newTreatedStatus ? canMarkTreated(appointment) : canMarkUntreated(appointment);
    
    if (!validation.allowed) {
      showToast(validation.message || "Action not allowed", 'error');
      return;
    }

    if (validation.needsConfirmation) {
      showConfirmation(
        `Are you sure you want to mark this appointment as ${newTreatedStatus ? 'treated' : 'untreated'}?`,
        async () => {
          try {
            await updateAppointmentHandler(id, { treated: newTreatedStatus });
            showToast(`Appointment ${newTreatedStatus ? 'marked as treated' : 'marked as untreated'}`, 'success');
          } catch (error) {
            // Error handled in update function
          }
        },
        id
      );
    } else {
      try {
        await updateAppointmentHandler(id, { treated: newTreatedStatus });
        showToast(`Appointment ${newTreatedStatus ? 'marked as treated' : 'marked as untreated'}`, 'success');
      } catch (error) {
        // Error handled in update function
      }
    }
  };

  const markAsEmergency = async (id: string) => {
    const appointment = findAppointment(id);
    if (!appointment) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const newEmergencyStatus = !appointment.isEmergency;
    const validation: ActionValidation = canMarkEmergency(appointment);
    
    if (!validation.allowed) {
      showToast(validation.message || "Action not allowed", 'error');
      return;
    }

    showConfirmation(
      `Are you sure you want to ${newEmergencyStatus ? 'mark as emergency' : 'remove emergency status'}?`,
      async () => {
        try {
          const result = await dispatch(updateEmergencyStatus(id, newEmergencyStatus));
          if (result) {
            showToast(`Appointment ${newEmergencyStatus ? 'marked as emergency' : 'emergency status removed'}`, 'success');
          } else {
            showToast(`Failed to ${newEmergencyStatus ? 'mark as emergency' : 'remove emergency status'}.`, 'error');
          }
        } catch (error) {
          console.error('Failed to update emergency status:', error);
          showToast(`Failed to ${newEmergencyStatus ? 'mark as emergency' : 'remove emergency status'}.`, 'error');
        }
      },
      id
    );
  };

  const cancelAppointmentHandler = async (id: string) => {
    const appointment = findAppointment(id);
    if (!appointment) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const validation: ActionValidation = canCancel(appointment);
    
    if (!validation.allowed) {
      showToast(validation.message || "Action not allowed", 'error');
      return;
    }

    showConfirmation(
      'Are you sure you want to cancel this appointment?',
      async () => {
        try {
          const result = await dispatch(cancelAppointment(id));
          if (result) {
            showToast('Appointment cancelled successfully.', 'success');
          } else {
            showToast('Failed to cancel appointment.', 'error');
          }
        } catch (error) {
          console.error('Failed to cancel appointment:', error);
          showToast('Failed to cancel appointment.', 'error');
        }
      },
      id
    );
  };

  const editAppointment = async (id: string, updates: any) => {
    const appointment = findAppointment(id);
    if (!appointment) {
      showToast("Appointment not found.", 'error');
      return;
    }

    const validation: ActionValidation = canEdit(appointment);
    
    if (!validation.allowed) {
      showToast(validation.message || "Action not allowed", 'error');
      return;
    }

    showConfirmation(
      'Save changes to this appointment?',
      async () => {
        try {
          await updateAppointmentHandler(id, updates);
          showToast('Appointment updated successfully.', 'success');
        } catch (error) {
          // Error handled in update function
        }
      },
      id
    );
  };

  // Load appointments on component mount - ONLY ONCE
  useEffect(() => {
    // Only attempt initial load once - prevents infinite loops on API failures
    if (!hasAttemptedInitialLoad.current) {
      hasAttemptedInitialLoad.current = true;
      fetchData();
    }
    // Note: WebSocket cleanup is handled at app level in _layout.tsx
    // We don't disconnect here to keep connection alive across screens
  }, []); // Empty deps - only run once on mount (dispatch is stable from Redux)

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
          selectedMarkAction={selectedMarkAction}
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

        {/* Single Confirmation Popup */}
        <AlertPopup
          message={confirmationData?.message || ''}
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