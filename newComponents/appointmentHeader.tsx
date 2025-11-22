// appointmentHeader.tsx - Fixed version
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
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
    isEmergency?: boolean;
    status: "ACCEPTED" | "CANCELLED";
  };
  onToggleExpand: () => void;
  onToggleTreatedStatus: () => void;
  onToggleAvailability: (value: boolean) => void;
  onEmergencyAction: () => void;
  onCancelAction: () => void;
  onEditAction: () => void;
  selectedMarkAction: 'treated' | 'emergency' | 'cancel' | 'edit';
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  item,
  onToggleExpand,
  onToggleTreatedStatus,
  onToggleAvailability,
  onEmergencyAction,
  onCancelAction,
  onEditAction,
  selectedMarkAction,
}) => {
  // Fix: Prevent event propagation and call the correct functions
  const handleToggleAvailability = (value: boolean) => {
    onToggleAvailability(value);
  };

  const handleToggleTreatedStatus = (e: any) => {
    e?.stopPropagation?.(); // Prevent event bubbling
    onToggleTreatedStatus();
  };

  const handleEmergencyAction = (e: any) => {
    e?.stopPropagation?.(); // Prevent event bubbling
    onEmergencyAction();
  };

  const handleCancelAction = (e: any) => {
    e?.stopPropagation?.(); // Prevent event bubbling
    onCancelAction();
  };

  const handleEditAction = (e: any) => {
    e?.stopPropagation?.(); // Prevent event bubbling
    onEditAction();
  };

  const handleHeaderPress = (e: any) => {
    onToggleExpand();
  };

  const renderActionButton = () => {
    switch (selectedMarkAction) {
      case 'emergency':
        return (
          <Pressable 
            onPress={handleEmergencyAction}
            style={({ pressed }) => [
              appointmentCardStyles.emergencyButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <MaterialIcons 
              name="emergency" 
              size={24} 
              color={MedicalTheme.colors.error[500]} 
            />
          </Pressable>
        );
      
      case 'cancel':
        return (
          <Pressable 
            onPress={handleCancelAction}
            style={({ pressed }) => [
              appointmentCardStyles.cancelButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <MaterialIcons 
              name="cancel" 
              size={24} 
              color={MedicalTheme.colors.warning[600]} 
            />
          </Pressable>
        );
      
      case 'edit':
        return (
          <Pressable 
            onPress={handleEditAction}
            style={({ pressed }) => [
              appointmentCardStyles.editButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <MaterialIcons 
              name="edit" 
              size={24} 
              color={MedicalTheme.colors.primary[500]} 
            />
          </Pressable>
        );
      
      case 'treated':
      default:
        return (
          <Pressable 
            onPress={handleToggleTreatedStatus}
            style={({ pressed }) => [
              appointmentCardStyles.treatedButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <MaterialIcons 
              name={item.treated ? 'check-circle' : 'radio-button-unchecked'} 
              size={24} 
              color={item.treated ? MedicalTheme.colors.success[500] : MedicalTheme.colors.neutral[400]} 
            />
          </Pressable>
        );
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        appointmentCardStyles.header,
        pressed && { opacity: 0.9 }
      ]}
      onPress={handleHeaderPress}
    >
      <View style={appointmentCardStyles.availabilityContainer}>
        <Switch
          value={item.availableAtClinic}
          onValueChange={handleToggleAvailability}
          thumbColor={item.availableAtClinic ? MedicalTheme.colors.success[500] : MedicalTheme.colors.neutral[100]}
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

      {renderActionButton()}
    </Pressable>
  );
};

export default AppointmentHeader;