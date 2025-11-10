import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
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
    status: "ACCEPTED" | "CANCELLED";
    appointmentType: string;
    paymentStatus: boolean;
    isEmergency: boolean;
    avatar?: string;
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
  const [alertPopupVisible, setAlertPopupVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertPopupVisible(true);
  };

  const handleToggleExpand = () => {
    onToggleExpand(isExpanded ? null : item.appointmentId);
  };

  // Fixed: Create wrapper functions that pass the correct appointment ID
  const handleToggleAvailability = (value: boolean) => {
    toggleAvailability(item.appointmentId, value);
  };

  const handleToggleTreatedStatus = () => {
    toggleTreatedStatus(item.appointmentId);
  };

  const handleTogglePaymentStatus = () => {
    togglePaymentStatus(item.appointmentId);
  };

  const handleEmergencyAction = () => {
    markAsEmergency(item.appointmentId);
  };

  const handleCancelAction = () => {
    cancelAppointment(item.appointmentId);
  };

  const handleEditAction = () => {
    setEditModalVisible(true);
  };

  const handleSaveEdit = (updates: any) => {
    editAppointment(item.appointmentId, updates);
    setEditModalVisible(false);
  };

  // Enhanced card styling for different states
  const getCardStyle = () => {
    if (item.status === "CANCELLED") {
      return {
        borderLeftWidth: 4,
        borderLeftColor: MedicalTheme.colors.neutral[400],
        backgroundColor: MedicalTheme.colors.neutral[100],
        opacity: 0.7,
      };
    }
    
    if (item.isEmergency && item.status === "ACCEPTED") {
      return {
        borderLeftWidth: 4,
        borderLeftColor: MedicalTheme.colors.error[500],
        backgroundColor: MedicalTheme.colors.error[50],
      };
    }
    
    return {
      borderLeftWidth: 0,
      backgroundColor: MedicalTheme.colors.background.primary,
    };
  };

  return (
    <>
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
            <Text style={appointmentCardStyles.editModalTitle}>
              Edit Appointment - {item.patientName}
            </Text>
            
            <Text style={appointmentCardStyles.editModalText}>
              {item.status === "CANCELLED" 
                ? "This appointment is currently cancelled. Editing will change status to ACCEPTED."
                : "Make changes to the appointment details."
              }
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
                onPress={() => handleSaveEdit({
                  patientName: item.patientName, // Example field
                  // Add more editable fields here
                })}
              >
                <Text style={appointmentCardStyles.editModalSaveText}>
                  {item.status === "CANCELLED" ? "Save & Restore" : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={[appointmentCardStyles.container, getCardStyle()]}>
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