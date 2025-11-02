import React, { useState } from 'react';
import { View, Animated } from 'react-native';
import { appointmentCardStyles } from '@/assets/styles/appointmentCard.styles';
import ConfirmationPopup from '@/componets/ConfirmationPopup';
import AppointmentHeader from '@/newComponents/appointmentHeader';
import AppointmentDetails from '@/newComponents/appointmentDetails';

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

  const showPopup = (message: string, action: () => void) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action);
    setPopupVisible(true);
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
    toggleAvailability(item.appointmentId, value);
  };

  const handleToggleExpand = () => {
    onToggleExpand(isExpanded ? null : item.appointmentId);
  };

  return (
    <>
      <ConfirmationPopup
        message={confirmationMessage}
        visible={popupVisible}
        onClose={(confirmed) => {
          setPopupVisible(false);
          if (confirmed) confirmationAction();
        }}
      />
      
      <View style={appointmentCardStyles.container}>
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