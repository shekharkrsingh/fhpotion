import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { appointmentFormStyles } from '@/assets/styles/appointmentForm.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface FormInputProps {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  required = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
}) => {
  const isNotes = multiline;
  
  return (
    <View>
      {/* <Text style={appointmentFormStyles.inputLabel}>
        {placeholder}
        {required && <Text style={appointmentFormStyles.requiredIndicator}> *</Text>}
      </Text> */}
      <View style={isNotes ? appointmentFormStyles.notesContainer : appointmentFormStyles.inputRow}>
        <MaterialCommunityIcons
          name={icon as any}
          size={22}
          color={MedicalTheme.colors.primary[500]}
          style={appointmentFormStyles.inputIcon}
        />
        <TextInput
          style={[
            appointmentFormStyles.input,
            isNotes && appointmentFormStyles.notesInput
          ]}
          placeholder={placeholder}
          placeholderTextColor={MedicalTheme.colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
    </View>
  );
};

export default FormInput;