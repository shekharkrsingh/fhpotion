import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
import ErrorBoundary from '@/newComponents/ErrorBoundary';
import LoadingState from '@/newComponents/loadingState';
import ErrorState from '@/newComponents/errorState';
import { bookingStyles } from '@/assets/styles/booking.styles';
import logger from '@/utils/logger';
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
  const { appointments, isLoading, error, success } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch<AppDispatch>();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkAction, setSelectedMarkAction] = useState<'treated' | 'emergency' | 'cancel' | 'edit'>('treated');

  const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    message: string;
    action: () => Promise<void>;
    appointmentId?: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const hasAttemptedInitialLoad = React.useRef(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info',
      text2: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  }, []);

  const findAppointment = (id: string) => {
    return Array.isArray(appointments) 
      ? appointments.find(item => item.appointmentId === id)
      : undefined;
  };

  const fetchData = useCallback(async () => {
    try {
      await dispatch(getAppointments());
      if (!websocketAppointment.connected) {
        await websocketAppointment.connect();
      }
    } catch (error) {
      logger.error('Failed to fetch appointments:', error);
      showToast('Failed to fetch appointments. Please try again.', 'error');
    }
  }, [dispatch, showToast]);

  const updateAppointmentHandler = async (id: string, change: any) => {
    try {
      const updateData = selectedMarkAction === 'edit' 
        ? { ...change, status: "ACCEPTED" as const }
        : change;
        
      await dispatch(updateAppointment({ appointmentId: id, updateData })).unwrap();
      return true;
    } catch (error) {
      logger.error('Failed to update appointment:', error);
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
  }, [fetchData]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleMarkAction = (action: 'treated' | 'emergency' | 'cancel' | 'edit') => {
    setSelectedMarkAction(action);
    setAvailabilityFilter('all');
    
    if (action === 'emergency') {
      showToast('Emergency protocol activated!', 'info');
    }
  };

  const showConfirmation = (message: string, action: () => Promise<void>, appointmentId?: string) => {
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
        logger.error('Error in confirmation action:', error);
      } finally {
        setIsProcessing(false);
      }
    }
    
    setConfirmationData(null);
  };

  const filteredData = useMemo(() => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    
    let filtered = [...safeAppointments];
    
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
            break;
        }
        break;
      
      case 'edit':
        switch (availabilityFilter) {
          case 'editable':
            filtered = filtered.filter(item => !item.treated);
            break;
          case 'all':
            break;
        }
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.contact?.includes(searchQuery)
      );
    }

    return sortAppointments(filtered);
  }, [appointments, selectedMarkAction, availabilityFilter, searchQuery]);

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
          }
        },
        id
      );
    } else {
      try {
        await updateAppointmentHandler(id, { availableAtClinic: value });
        showToast(`Appointment ${value ? 'marked as available' : 'marked as unavailable'}`, 'success');
      } catch (error) {
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
          }
        },
        id
      );
    } else {
      try {
        await updateAppointmentHandler(id, { paymentStatus: newPaymentStatus });
        showToast(`Payment status ${newPaymentStatus ? 'marked as paid' : 'marked as unpaid'}`, 'success');
      } catch (error) {
      }
    }
  };

  const toggleTreatedStatus = async (id: string) => {
    logger.log('Toggling treated status for appointment:', id);
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
          }
        },
        id
      );
    } else {
      try {
        await updateAppointmentHandler(id, { treated: newTreatedStatus });
        showToast(`Appointment ${newTreatedStatus ? 'marked as treated' : 'marked as untreated'}`, 'success');
      } catch (error) {
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
          await dispatch(updateEmergencyStatus({ appointmentId: id, isEmergency: newEmergencyStatus })).unwrap();
          showToast(`Appointment ${newEmergencyStatus ? 'marked as emergency' : 'emergency status removed'}`, 'success');
        } catch (error) {
          logger.error('Failed to update emergency status:', error);
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
          await dispatch(cancelAppointment(id)).unwrap();
          showToast('Appointment cancelled successfully.', 'success');
        } catch (error) {
          logger.error('Failed to cancel appointment:', error);
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
        }
      },
      id
    );
  };

  useEffect(() => {
    if (!hasAttemptedInitialLoad.current) {
      hasAttemptedInitialLoad.current = true;
      fetchData();
    }
  }, []);

  if (isLoading && !refreshing) {
    return (
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={bookingStyles.container}>
            <LoadingState message="Loading appointments..." />
          </View>
        </GestureHandlerRootView>
      </ErrorBoundary>
    );
  }

  if (error && !refreshing) {
    return (
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={bookingStyles.container}>
            <ErrorState 
              title="Failed to Load Appointments"
              message={error || "We couldn't load your appointments. Please check your connection and try again."}
              onRetry={fetchData}
              retryLabel="Retry"
            />
          </View>
        </GestureHandlerRootView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
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

        <Toast />
      </View>
    </GestureHandlerRootView>
    </ErrorBoundary>
  );
}