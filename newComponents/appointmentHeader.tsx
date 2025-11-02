import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Switch } from 'react-native-gesture-handler';
import { appointmentCardStyles } from '@/assets/styles/appointmentCard.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface AppointmentHeaderProps {
  item: {
    appointmentId: string;
    patientName: string;
    contact: string;
    availableAtClinic: boolean;
    treated: boolean;
    paymentStatus: boolean;
    avatar?: string;
  };
  onToggleExpand: () => void;
  onToggleTreatedStatus: () => void;
  onToggleAvailability: (value: boolean) => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  item,
  onToggleExpand,
  onToggleTreatedStatus,
  onToggleAvailability,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onToggleExpand}
      style={appointmentCardStyles.header}
    >
      <View style={appointmentCardStyles.availabilityContainer}>
        <Switch
          value={item.availableAtClinic}
          onValueChange={onToggleAvailability}
          thumbColor={item.availableAtClinic ? MedicalTheme.colors.success[100] : MedicalTheme.colors.neutral[100]}
          trackColor={{ 
            false: MedicalTheme.colors.neutral[100], 
            true: MedicalTheme.colors.primary[100] 
          }}
        />
        <Text style={[
          appointmentCardStyles.availabilityText,
          { 
            color: item.availableAtClinic ? MedicalTheme.colors.primary[500] : MedicalTheme.colors.text.tertiary 
          }
        ]}>
          {item.availableAtClinic ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      {item.avatar && (
        <Image 
          source={{ uri: item.avatar }} 
          style={appointmentCardStyles.avatar}
          resizeMode="cover"
        />
      )}

      <View style={appointmentCardStyles.nameContainer}>
        <Text 
          style={appointmentCardStyles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.patientName}
        </Text>
        <View style={[
          appointmentCardStyles.statusContainer,
          { 
            backgroundColor: item.paymentStatus ? 
              MedicalTheme.colors.success[500] : 
              MedicalTheme.colors.neutral[300] 
          }
        ]}>
          <Text style={appointmentCardStyles.statusText}>
            {item.paymentStatus ? 'Paid' : 'Unpaid'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        onPress={onToggleTreatedStatus}
        style={appointmentCardStyles.treatedButton}
      >
        <MaterialIcons 
          name={item.treated ? 'check-circle' : 'radio-button-unchecked'} 
          size={24} 
          color={item.treated ? MedicalTheme.colors.success[500] : MedicalTheme.colors.neutral[400]} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AppointmentHeader;