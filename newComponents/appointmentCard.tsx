import React, { useState } from 'react';
import { View, Animated } from 'react-native';
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
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  toggleAvailability,
  togglePaymentStatus,
  toggleTreatedStatus,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
  
  const [alertPopupVisible, setAlertPopupVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
      
      <View style={[appointmentCardStyles.container, emergencyCardStyle]}>
        <AppointmentHeader
          item={item}
          onToggleExpand={handleToggleExpand}
          onToggleTreatedStatus={handleToggleTreatedStatus}
          onToggleAvailability={handleToggleAvailability}
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