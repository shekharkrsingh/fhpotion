import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { appointmentCardStyles } from '@/assets/styles/appointmentCard.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface AppointmentDetailsProps {
  item: {
    appointmentDateTime: string;
    contact: string;
    description: string | null;
    paymentStatus: boolean;
  };
  onTogglePaymentStatus: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  item,
  onTogglePaymentStatus,
}) => {
  const extractFormattedTime = (isoString: string): string => {
    const dateObj = new Date(isoString);
    let hours: number = dateObj.getHours();
    const minutes: string = String(dateObj.getMinutes()).padStart(2, '0');
    const ampm: string = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const time: string = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    return time;
  };

  return (
    <View style={appointmentCardStyles.detailsContainer}>
      <View style={appointmentCardStyles.detailCard}>
        <MaterialIcons 
          name="access-time" 
          size={20} 
          color={MedicalTheme.colors.primary[500]} 
          style={appointmentCardStyles.detailIcon}
        />
        <Text style={appointmentCardStyles.detailLabel}>Time</Text>
        <Text style={appointmentCardStyles.detailValue}>
          {extractFormattedTime(item.appointmentDateTime)}
        </Text>
      </View>
    
      <View style={appointmentCardStyles.detailCard}>
        <MaterialIcons 
          name="phone" 
          size={20} 
          color={MedicalTheme.colors.primary[500]} 
          style={appointmentCardStyles.detailIcon}
        />
        <Text style={appointmentCardStyles.detailLabel}>Contact</Text>
        <Text style={appointmentCardStyles.detailValue}>
          {item.contact}
        </Text>
      </View>
    
      <View style={appointmentCardStyles.detailCard}>
        <MaterialIcons 
          name="description" 
          size={20} 
          color={MedicalTheme.colors.primary[500]} 
          style={appointmentCardStyles.detailIcon}
        />
        <Text style={appointmentCardStyles.detailLabel}>Description</Text>
        <Text style={appointmentCardStyles.detailValue}>
          {item.description || 'No description'}
        </Text>
      </View>
    
      <View style={appointmentCardStyles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            appointmentCardStyles.actionButton,
            { 
              backgroundColor: item.paymentStatus 
                ? MedicalTheme.colors.neutral[100]
                : MedicalTheme.colors.primary[50],
            },
            pressed && { opacity: 0.7 }
          ]}
          onPress={onTogglePaymentStatus}
        >
          <Text style={[
            appointmentCardStyles.actionButtonText,
            { 
              color: item.paymentStatus 
                ? MedicalTheme.colors.error[500]
                : MedicalTheme.colors.success[500]
            }
          ]}>
            {item.paymentStatus ? 'Mark as Unpaid' : 'Mark as Paid'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AppointmentDetails;