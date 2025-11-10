// appointmentHeader.tsx - Fixed version
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
          <TouchableOpacity 
            onPress={handleEmergencyAction}
            style={appointmentCardStyles.emergencyButton}
          >
            <MaterialIcons 
              name="emergency" 
              size={24} 
              color={MedicalTheme.colors.error[500]} 
            />
          </TouchableOpacity>
        );
      
      case 'cancel':
        return (
          <TouchableOpacity 
            onPress={handleCancelAction}
            style={appointmentCardStyles.cancelButton}
          >
            <MaterialIcons 
              name="cancel" 
              size={24} 
              color={MedicalTheme.colors.warning[600]} 
            />
          </TouchableOpacity>
        );
      
      case 'edit':
        return (
          <TouchableOpacity 
            onPress={handleEditAction}
            style={appointmentCardStyles.editButton}
          >
            <MaterialIcons 
              name="edit" 
              size={24} 
              color={MedicalTheme.colors.primary[500]} 
            />
          </TouchableOpacity>
        );
      
      case 'treated':
      default:
        return (
          <TouchableOpacity 
            onPress={handleToggleTreatedStatus}
            style={appointmentCardStyles.treatedButton}
          >
            <MaterialIcons 
              name={item.treated ? 'check-circle' : 'radio-button-unchecked'} 
              size={24} 
              color={item.treated ? MedicalTheme.colors.success[500] : MedicalTheme.colors.neutral[400]} 
            />
          </TouchableOpacity>
        );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleHeaderPress}
      style={appointmentCardStyles.header}
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
    </TouchableOpacity>
  );
};

export default AppointmentHeader;