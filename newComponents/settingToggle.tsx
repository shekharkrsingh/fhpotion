import React from 'react';
import { View, Text, Switch } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { appointmentFormStyles } from '@/assets/styles/appointmentForm.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  trueIcon?: string;
  falseIcon?: string;
  trueColor?: string;
  falseColor?: string;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  icon,
  label,
  value,
  onValueChange,
  trueColor = MedicalTheme.colors.success[500],
  falseColor = MedicalTheme.colors.error[500],
}) => {
  return (
    <View style={appointmentFormStyles.settingItem}>
      <View style={appointmentFormStyles.settingLabel}>
        {icon}
        <Text style={appointmentFormStyles.settingText}>
          {label}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={MedicalTheme.colors.background.primary}
        trackColor={{
          false: MedicalTheme.colors.neutral[300],
          true: MedicalTheme.colors.primary[500]
        }}
      />
    </View>
  );
};

export default SettingToggle;