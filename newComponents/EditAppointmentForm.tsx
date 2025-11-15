// EditAppointmentForm.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  ScrollView,
  Modal,
  Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  DatePickerModal, 
  TimePickerModal 
} from 'react-native-paper-dates';
import { MedicalTheme } from '@/newConstants/theme';
import { appointmentCardStyles } from '@/assets/styles/appointmentCard.styles';
import { editFormStyles } from '@/assets/styles/EditAppointmentForm.styles';

interface EditAppointmentFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updates: any) => void;
  appointment: {
    appointmentId: string;
    patientName: string;
    contact: string;
    description: string | null;
    appointmentDateTime: string;
    status: "ACCEPTED" | "CANCELLED";
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  description: string;
  appointmentDateTime: Date;
}

const EditAppointmentForm: React.FC<EditAppointmentFormProps> = ({
  visible,
  onClose,
  onSave,
  appointment,
}) => {
  // Parse existing patient name into first and last name
  const parsePatientName = (fullName: string) => {
    const names = fullName.split(' ');
    return {
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || ''
    };
  };

  const { firstName, lastName } = parsePatientName(appointment.patientName);

  const [formData, setFormData] = useState<FormData>({
    firstName,
    lastName,
    contact: appointment.contact || '',
    email: '',
    description: appointment.description || '',
    appointmentDateTime: new Date(appointment.appointmentDateTime),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Reset form when appointment changes
  useEffect(() => {
    if (visible) {
      const { firstName, lastName } = parsePatientName(appointment.patientName);
      setFormData({
        firstName,
        lastName,
        contact: appointment.contact || '',
        email: '',
        description: appointment.description || '',
        appointmentDateTime: new Date(appointment.appointmentDateTime),
      });
      setErrors({});
    }
  }, [visible, appointment]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Enhanced contact validation
    const cleanContact = formData.contact.replace(/\D/g, '');
    if (!cleanContact) {
      newErrors.contact = 'Contact number is required';
    } else if (cleanContact.length !== 10) {
      newErrors.contact = 'Contact number must be exactly 10 digits';
    } else if (!/^\d{10}$/.test(cleanContact)) {
      newErrors.contact = 'Please enter a valid contact number';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.appointmentDateTime < new Date()) {
      newErrors.appointmentDateTime = 'Appointment date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Special handling for contact field
    if (field === 'contact') {
      // Remove non-digit characters and limit to 10 digits
      const cleanValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [field]: cleanValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleTimePress = () => {
    setShowTimePicker(true);
  };

  const onDateConfirm = (params: { date: Date }) => {
    setShowDatePicker(false);
    const { date } = params;
    
    // Preserve the current time when changing date
    const currentTime = formData.appointmentDateTime;
    const newDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    );

    setFormData(prev => ({
      ...prev,
      appointmentDateTime: newDateTime
    }));

    // Clear date error if any
    if (errors.appointmentDateTime) {
      setErrors(prev => ({
        ...prev,
        appointmentDateTime: undefined
      }));
    }
  };

  const onTimeConfirm = (params: { hours: number; minutes: number }) => {
    setShowTimePicker(false);
    const { hours, minutes } = params;
    
    // Preserve the current date when changing time
    const currentDate = formData.appointmentDateTime;
    const newDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes
    );

    setFormData(prev => ({
      ...prev,
      appointmentDateTime: newDateTime
    }));

    // Clear date error if any
    if (errors.appointmentDateTime) {
      setErrors(prev => ({
        ...prev,
        appointmentDateTime: undefined
      }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const updates = {
      patientName: `${formData.firstName} ${formData.lastName}`.trim(),
      contact: formData.contact,
      email: formData.email,
      description: formData.description,
      appointmentDateTime: formData.appointmentDateTime.toISOString(),
      status: "ACCEPTED" as const,
    };

    onSave(updates);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const resetForm = () => {
    const { firstName, lastName } = parsePatientName(appointment.patientName);
    setFormData({
      firstName,
      lastName,
      contact: appointment.contact || '',
      email: '',
      description: appointment.description || '',
      appointmentDateTime: new Date(appointment.appointmentDateTime),
    });
    setErrors({});
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Helper to check contact length
  const getContactLengthStatus = () => {
    const length = formData.contact.replace(/\D/g, '').length;
    if (length === 0) return 'empty';
    if (length === 10) return 'valid';
    return 'invalid';
  };

  return (
    <>
      {/* Main Edit Modal */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={editFormStyles.modalOverlay}>
          <View style={editFormStyles.modalContainer}>
            {/* Header */}
            <View style={editFormStyles.modalHeader}>
              <Text style={editFormStyles.modalTitle}>
                Edit Appointment
              </Text>
              <Text style={editFormStyles.modalSubtitle}>
                {appointment.status === "CANCELLED" 
                  ? "This appointment is currently cancelled. Editing will change status to ACCEPTED."
                  : "Update the appointment details below."
                }
              </Text>
            </View>

            <ScrollView 
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Patient Information Section */}
              <View style={editFormStyles.formSection}>
                <Text style={editFormStyles.sectionTitle}>Patient Information</Text>
                
                {/* First Name */}
                <View style={editFormStyles.inputContainer}>
                  <Text style={editFormStyles.label}>
                    First Name <Text style={editFormStyles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      editFormStyles.input,
                      errors.firstName && editFormStyles.inputError
                    ]}
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    placeholder="Enter first name"
                    placeholderTextColor={MedicalTheme.colors.text.tertiary}
                  />
                  {errors.firstName && (
                    <Text style={editFormStyles.errorText}>{errors.firstName}</Text>
                  )}
                </View>

                {/* Last Name */}
                <View style={editFormStyles.inputContainer}>
                  <Text style={editFormStyles.label}>
                    Last Name <Text style={editFormStyles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      editFormStyles.input,
                      errors.lastName && editFormStyles.inputError
                    ]}
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    placeholder="Enter last name"
                    placeholderTextColor={MedicalTheme.colors.text.tertiary}
                  />
                  {errors.lastName && (
                    <Text style={editFormStyles.errorText}>{errors.lastName}</Text>
                  )}
                </View>
              </View>

              {/* Contact Information Section */}
              <View style={editFormStyles.formSection}>
                <Text style={editFormStyles.sectionTitle}>Contact Information</Text>

                {/* Contact */}
                <View style={editFormStyles.inputContainer}>
                  <Text style={editFormStyles.label}>
                    Contact Number <Text style={editFormStyles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      editFormStyles.input,
                      errors.contact && editFormStyles.inputError
                    ]}
                    value={formData.contact}
                    onChangeText={(value) => handleInputChange('contact', value)}
                    placeholder="Enter 10-digit contact number"
                    placeholderTextColor={MedicalTheme.colors.text.tertiary}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  <View style={editFormStyles.contactInfo}>
                    <Text style={[
                      editFormStyles.contactLength,
                      getContactLengthStatus() === 'invalid' && editFormStyles.contactLengthError,
                      getContactLengthStatus() === 'valid' && editFormStyles.contactLengthValid
                    ]}>
                      {formData.contact.replace(/\D/g, '').length}/10 digits
                    </Text>
                  </View>
                  {errors.contact && (
                    <Text style={editFormStyles.errorText}>{errors.contact}</Text>
                  )}
                </View>

                {/* Email */}
                <View style={editFormStyles.inputContainer}>
                  <Text style={editFormStyles.label}>Email Address</Text>
                  <TextInput
                    style={[
                      editFormStyles.input,
                      errors.email && editFormStyles.inputError
                    ]}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="Enter email address"
                    placeholderTextColor={MedicalTheme.colors.text.tertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <Text style={editFormStyles.errorText}>{errors.email}</Text>
                  )}
                </View>
              </View>

              {/* Appointment Details Section */}
              <View style={editFormStyles.formSection}>
                <Text style={editFormStyles.sectionTitle}>Appointment Details</Text>

                {/* Description */}
                <View style={editFormStyles.inputContainer}>
                  <Text style={editFormStyles.label}>Description</Text>
                  <TextInput
                    style={[editFormStyles.input, editFormStyles.textArea]}
                    value={formData.description}
                    onChangeText={(value) => handleInputChange('description', value)}
                    placeholder="Enter appointment description or notes"
                    placeholderTextColor={MedicalTheme.colors.text.tertiary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Appointment Date & Time */}
                <View style={editFormStyles.inputContainer}>
                  <Text style={editFormStyles.label}>
                    Appointment Date & Time <Text style={editFormStyles.required}>*</Text>
                  </Text>
                  
                  <View style={editFormStyles.dateTimeContainer}>
                    <Pressable
                      style={({ pressed }) => [
                        editFormStyles.dateTimeButton,
                        errors.appointmentDateTime && editFormStyles.inputError,
                        showDatePicker && editFormStyles.dateTimeButtonActive,
                        pressed && { opacity: 0.7 }
                      ]}
                      onPress={handleDatePress}
                    >
                      <MaterialIcons 
                        name="calendar-today" 
                        size={18} 
                        color={showDatePicker ? MedicalTheme.colors.primary[600] : MedicalTheme.colors.primary[500]} 
                      />
                      <Text style={[
                        editFormStyles.dateTimeText,
                        showDatePicker && editFormStyles.dateTimeTextActive
                      ]}>
                        {formatDate(formData.appointmentDateTime)}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        editFormStyles.dateTimeButton,
                        errors.appointmentDateTime && editFormStyles.inputError,
                        showTimePicker && editFormStyles.dateTimeButtonActive,
                        pressed && { opacity: 0.7 }
                      ]}
                      onPress={handleTimePress}
                    >
                      <MaterialIcons 
                        name="access-time" 
                        size={18} 
                        color={showTimePicker ? MedicalTheme.colors.primary[600] : MedicalTheme.colors.primary[500]} 
                      />
                      <Text style={[
                        editFormStyles.dateTimeText,
                        showTimePicker && editFormStyles.dateTimeTextActive
                      ]}>
                        {formatTime(formData.appointmentDateTime)}
                      </Text>
                    </Pressable>
                  </View>
                  
                  {errors.appointmentDateTime && (
                    <Text style={editFormStyles.errorText}>{errors.appointmentDateTime}</Text>
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={appointmentCardStyles.editModalButtons}>
              <Pressable
                style={({ pressed }) => [
                  appointmentCardStyles.editModalCancelButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={handleClose}
              >
                <Text style={appointmentCardStyles.editModalCancelText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  appointmentCardStyles.editModalSaveButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={handleSave}
              >
                <Text style={appointmentCardStyles.editModalSaveText}>
                  {appointment.status === "CANCELLED" ? "Save & Restore" : "Save Changes"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        date={formData.appointmentDateTime}
        onConfirm={onDateConfirm}
        validRange={{
          startDate: new Date(), // Can't select past dates
        }}
        animationType="slide"
        label="Select appointment date"
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        locale="en"
        visible={showTimePicker}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={onTimeConfirm}
        hours={formData.appointmentDateTime.getHours()}
        minutes={formData.appointmentDateTime.getMinutes()}
        label="Select appointment time"
        cancelLabel="Cancel"
        confirmLabel="OK"
        animationType="slide"
      />
    </>
  );
};

export default EditAppointmentForm;