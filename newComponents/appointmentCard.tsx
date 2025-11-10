import React, { useState } from 'react';
import { View, Animated, Modal, TouchableOpacity, Text } from 'react-native';
import { appointmentCardStyles } from '@/assets/styles/appointmentCard.styles';
import AlertPopup from '@/newComponents/alertPopup';
import AppointmentHeader from '@/newComponents/appointmentHeader';
import AppointmentDetails from '@/newComponents/appointmentDetails';
import { MedicalTheme } from '@/newConstants/theme';

interface AppointmentCardProps {
  item: {
    appointmentId: string;
    doctorId: string;
    patientName: string;
    contact: string;
    description: string | null;
    appointmentDateTime: string;
    bookingDateTime: string;
    availableAtClinic: boolean;
    treated: boolean;
    treatedDateTime: string | null;
    status: string;
    appointmentType: string;
    paymentStatus: boolean;
    avatar?: string;
    isEmergency?: boolean;
  };
  isExpanded: boolean;
  onToggleExpand: (id: string | null) => void;
  toggleAvailability: (id: string, value: boolean) => void;
  togglePaymentStatus: (id: string) => void;
  toggleTreatedStatus: (id: string) => void;
  markAsEmergency: (id: string) => void;
  cancelAppointment: (id: string) => void;
  editAppointment: (id: string, updates: any) => void;
  selectedMarkAction: 'treated' | 'emergency' | 'cancel' | 'edit';
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  toggleAvailability,
  togglePaymentStatus,
  toggleTreatedStatus,
  markAsEmergency,
  cancelAppointment,
  editAppointment,
  selectedMarkAction,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
  
  const [alertPopupVisible, setAlertPopupVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);

  const showPopup = (message: string, action: () => void) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action);
    setPopupVisible(true);
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertPopupVisible(true);
  };

  const handleTogglePaymentStatus = () => {
    if (item.paymentStatus) {
      showPopup(
        'Are you sure you want to mark this booking as unpaid?',
        () => togglePaymentStatus(item.appointmentId)
      );
    } else {
      togglePaymentStatus(item.appointmentId);
    }
  };

  const handleToggleTreatedStatus = () => {
    if (item.treated) {
      showPopup(
        'Are you sure you want to mark this booking as untreated?',
        () => toggleTreatedStatus(item.appointmentId)
      );
    } else {
      toggleTreatedStatus(item.appointmentId);
    }
  };

  const handleEmergencyAction = () => {
    showPopup(
      'Are you sure you want to mark this appointment as emergency?',
      () => markAsEmergency(item.appointmentId)
    );
  };

  const handleCancelAction = () => {
    showPopup(
      'Are you sure you want to cancel this appointment?',
      () => cancelAppointment(item.appointmentId)
    );
  };

  const handleEditAction = () => {
    setEditModalVisible(true);
  };

  const handleToggleAvailability = (value: boolean) => {
    if (value && !item.paymentStatus) {
      showAlert('Cannot mark as available. Payment has not been received for this appointment.');
      return;
    }
    
    if (!value && item.paymentStatus) {
      showAlert('Cannot mark as unavailable. Payment has already been received for this appointment.');
      return;
    }
    
    toggleAvailability(item.appointmentId, value);
  };

  const handleToggleExpand = () => {
    onToggleExpand(isExpanded ? null : item.appointmentId);
  };

  const handleSaveEdit = (updates: any) => {
    editAppointment(item.appointmentId, updates);
    setEditModalVisible(false);
  };

  const emergencyCardStyle = item.isEmergency ? {
    borderLeftWidth: 4,
    borderLeftColor: MedicalTheme.colors.error[500],
    backgroundColor: MedicalTheme.colors.error[50],
  } : {
    borderLeftWidth: 0,
    backgroundColor: MedicalTheme.colors.background.primary,
  };

  return (
    <>
      <AlertPopup
        message={confirmationMessage}
        visible={popupVisible}
        onClose={(confirmed) => {
          setPopupVisible(false);
          if (confirmed) confirmationAction();
        }}
        type="confirmation"
        variant="warning"
        title="Confirmation Required"
        confirmText="Yes"
        cancelText="No"
        showIcon={true}
      />
      
      <AlertPopup
        message={alertMessage}
        visible={alertPopupVisible}
        onClose={() => setAlertPopupVisible(false)}
        type="alert"
        variant="error"
        title="Action Not Allowed"
        confirmText="OK"
        showIcon={true}
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={appointmentCardStyles.editModalOverlay}>
          <View style={appointmentCardStyles.editModalContainer}>
            <Text style={appointmentCardStyles.editModalTitle}>Edit Appointment</Text>
            
            {/* Add your edit form fields here */}
            <Text style={appointmentCardStyles.editModalText}>
              Edit functionality for: {item.patientName}
            </Text>
            
            <View style={appointmentCardStyles.editModalButtons}>
              <TouchableOpacity
                style={appointmentCardStyles.editModalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={appointmentCardStyles.editModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={appointmentCardStyles.editModalSaveButton}
                onPress={() => handleSaveEdit({})}
              >
                <Text style={appointmentCardStyles.editModalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={[appointmentCardStyles.container, emergencyCardStyle]}>
        <AppointmentHeader
          item={item}
          onToggleExpand={handleToggleExpand}
          onToggleTreatedStatus={handleToggleTreatedStatus}
          onToggleAvailability={handleToggleAvailability}
          onEmergencyAction={handleEmergencyAction}
          onCancelAction={handleCancelAction}
          onEditAction={handleEditAction}
          selectedMarkAction={selectedMarkAction}
        />

        {isExpanded && (
          <AppointmentDetails
            item={item}
            onTogglePaymentStatus={handleTogglePaymentStatus}
          />
        )}
      </View>
    </>
  );
};

export default AppointmentCard;