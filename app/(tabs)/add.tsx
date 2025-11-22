import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  Animated,
  Easing,
  Modal
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addAppointment } from '@/newService/config/api/appointmentApi'

import { appointmentFormStyles } from '@/assets/styles/appointmentForm.styles';
import { MedicalTheme } from '@/newConstants/theme';
import FormInput from '@/newComponents/formInput';
import SettingToggle from '@/newComponents/settingToggle';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/newStore';
import logger from '@/utils/logger';
import ErrorBoundary from '@/newComponents/ErrorBoundary';

interface PatientData {
  firstName: string;
  lastName: string;
  contact: string;
  email?: string;
  description?: string;
  paymentStatus: boolean;
  availableAtClinic: boolean;
  appointmentDateTime: Date;
}

const ModernAppointmentForm = () => {
  const insets = useSafeAreaInsets();
  const [patientData, setPatientData] = useState<PatientData>({
    firstName: '',
    lastName: '',
    contact: '',
    paymentStatus: true,
    availableAtClinic: true,
    email:'',
    description:'',
    appointmentDateTime: new Date()
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const additionalFieldsHeight = useRef(new Animated.Value(0)).current;
  const additionalFieldsOpacity = useRef(new Animated.Value(0)).current;

  // Initial animations
  useEffect(() => {
    const animations = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]);
    
    animations.start();

    // Cleanup function to stop animations on unmount
    return () => {
      animations.stop();
    };
  }, [fadeAnim, slideAnim]);

  // Toggle additional fields with animation
  const toggleAdditionalFields = () => {
    if (showAdditionalFields) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(additionalFieldsHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(additionalFieldsOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      ]).start(() => {
        setShowAdditionalFields(false);
      });
    } else {
      setShowAdditionalFields(true);
      // Expand animation
      Animated.parallel([
        Animated.timing(additionalFieldsHeight, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(additionalFieldsOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
          delay: 100
        })
      ]).start();
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    setPatientData({
      firstName: '',
      lastName: '',
      contact: '',
      paymentStatus: true,
      availableAtClinic: true,
      email: '',
      description: '',
      appointmentDateTime: new Date()
    });
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    setShowAdditionalFields(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    additionalFieldsHeight.setValue(0);
    additionalFieldsOpacity.setValue(0);
    setRefreshing(false);
  }, []);

  const handleChange = (name: keyof PatientData, value: string | boolean | Date) => {
    setPatientData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDatePress = () => {
    setPickerMode('date');
    setShowDatePicker(true);
  };

  const handleTimePress = () => {
    setPickerMode('time');
    setShowTimePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }

    if (selectedDate && event.type !== 'dismissed') {
      if (pickerMode === 'date') {
        const currentTime = patientData.appointmentDateTime;
        const newDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          currentTime.getHours(),
          currentTime.getMinutes()
        );
        handleChange('appointmentDateTime', newDateTime);
        if (Platform.OS === 'ios') {
          setShowDatePicker(false);
        }
      } else if (pickerMode === 'time') {
        const currentDate = patientData.appointmentDateTime;
        const newDateTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          selectedDate.getHours(),
          selectedDate.getMinutes()
        );
        handleChange('appointmentDateTime', newDateTime);
        if (Platform.OS === 'ios') {
          setShowTimePicker(false);
        }
      }
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
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

  const handleSubmit = async () => {
    if (!patientData.firstName.trim() || !patientData.contact.trim()) {
      Alert.alert("Required Fields", "Please fill in First Name and Contact Number");
      return;
    }
    
    // Validate contact number format - must be exactly 10 digits (matches backend validation)
    const cleanedContact = patientData.contact.replace(/\D/g, ''); // Remove all non-digits
    const contactRegex = /^\d{10}$/; // Exactly 10 digits (matches backend pattern: ^\d{10}$)
    
    if (cleanedContact.length !== 10 || !contactRegex.test(cleanedContact)) {
      Alert.alert(
        "Invalid Contact Number",
        "Please enter exactly 10 digits for the contact number"
      );
      return;
    }
    
    setLoading(true);
    try {
      const response = await dispatch(addAppointment({
        patientName: `${patientData.firstName.trim()} ${patientData.lastName.trim()}`.trim(), 
        contact: cleanedContact,
        paymentStatus: patientData.paymentStatus, 
        availableAtClinic: patientData.availableAtClinic, 
        email: patientData.email?.trim() || '', 
        description: patientData.description?.trim() || '',
        appointmentDateTime: patientData.appointmentDateTime.toISOString()
      }));

      // Handle the response based on your thunk structure
      if (response.type.endsWith('/fulfilled')) {
        Alert.alert("Success", "Appointment created successfully!");
        setPatientData({
          firstName: '',
          lastName: '',
          contact: '',
          paymentStatus: true,
          availableAtClinic: true,
          email: '',
          description: '',
          appointmentDateTime: new Date()
        });
        setShowAdditionalFields(false);
        setShowDatePicker(false);
        setShowTimePicker(false);
        additionalFieldsHeight.setValue(0);
        additionalFieldsOpacity.setValue(0);
      } else {
        const errorMessage = response?.error?.message || "Failed to add new appointment";
        Alert.alert("Error", errorMessage);
      }
    } catch (error: any) {
      logger.error('Appointment submission error:', error);
      Alert.alert("Error", error?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Interpolate height for smooth animation
  const animatedHeight = additionalFieldsHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220] // Adjust based on your content height
  });

  return (
    <ErrorBoundary>
      {/* Reverted: remove explicit StatusBar override */}
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: MedicalTheme.colors.background.secondary }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? "padding" : 'height'}
        >
          <ScrollView
            contentContainerStyle={appointmentFormStyles.container}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={[MedicalTheme.colors.primary[500]]}
                tintColor={MedicalTheme.colors.primary[500]}
                progressBackgroundColor={MedicalTheme.colors.background.primary}
              />
            }
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <Animated.View style={[
              appointmentFormStyles.header,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                paddingTop: insets.top + MedicalTheme.spacing[6],
              }
            ]}>
            <MaterialCommunityIcons 
              name="calendar-plus" 
              size={32} 
              color={MedicalTheme.colors.text.inverse} 
            />
            <Text style={appointmentFormStyles.headerTitle}>New Appointment</Text>
            <Text style={appointmentFormStyles.headerSubtitle}>Schedule patient consultation</Text>
          </Animated.View>

          {/* Main Form Card */}
          <Animated.View style={[
            appointmentFormStyles.card,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}>
            {/* Basic Information Section */}
            <View style={appointmentFormStyles.section}>
              <Text style={appointmentFormStyles.sectionTitle}>Patient Information</Text>
              
              <FormInput
                icon="account-outline"
                placeholder="First Name *"
                value={patientData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                required={true}
                autoCapitalize="words"
                maxLength={50}
              />

              <FormInput
                icon="account-outline"
                placeholder="Last Name"
                value={patientData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                autoCapitalize="words"
                maxLength={50}
              />

              <FormInput
                icon="phone-outline"
                placeholder="Contact Number *"
                value={patientData.contact}
                onChangeText={(text) => {
                  // Only allow digits, max 10 characters
                  const digitsOnly = text.replace(/\D/g, '').slice(0, 10);
                  handleChange('contact', digitsOnly);
                }}
                required={true}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={appointmentFormStyles.section}>
              <Text style={appointmentFormStyles.sectionTitle}>Appointment Date & Time</Text>
              
              <View style={appointmentFormStyles.dateTimeContainer}>
                <Pressable
                  style={({ pressed }) => [
                    appointmentFormStyles.dateTimeButton,
                    showDatePicker && appointmentFormStyles.dateTimeButtonActive,
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
                    appointmentFormStyles.dateTimeText,
                    showDatePicker && appointmentFormStyles.dateTimeTextActive
                  ]}>
                    {formatDate(patientData.appointmentDateTime)}
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    appointmentFormStyles.dateTimeButton,
                    showTimePicker && appointmentFormStyles.dateTimeButtonActive,
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
                    appointmentFormStyles.dateTimeText,
                    showTimePicker && appointmentFormStyles.dateTimeTextActive
                  ]}>
                    {formatTime(patientData.appointmentDateTime)}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={appointmentFormStyles.section}>
              <Text style={appointmentFormStyles.sectionTitle}>Appointment Settings</Text>
              
              <SettingToggle
                icon={
                  <MaterialCommunityIcons
                    name={patientData.paymentStatus ? "credit-card-check" : "credit-card-remove"}
                    size={22}
                    color={patientData.paymentStatus ? MedicalTheme.colors.success[500] : MedicalTheme.colors.error[500]}
                  />
                }
                label={patientData.paymentStatus ? 'Payment Confirmed' : 'Payment Pending'}
                value={patientData.paymentStatus}
                onValueChange={(value) => handleChange('paymentStatus', value)}
              />

              <SettingToggle
                icon={
                  <MaterialIcons
                    name={patientData.availableAtClinic ? "person" : "person-off"}
                    size={22}
                    color={patientData.availableAtClinic ? MedicalTheme.colors.success[500] : MedicalTheme.colors.error[500]}
                  />
                }
                label={patientData.availableAtClinic ? 'Patient at Clinic' : 'Patient Not at Clinic'}
                value={patientData.availableAtClinic}
                onValueChange={(value) => handleChange('availableAtClinic', value)}
              />
            </View>

            {/* Additional Fields Toggle */}
            <Pressable 
              style={({ pressed }) => [
                appointmentFormStyles.expandButton,
                pressed && { opacity: 0.8 }
              ]}
              onPress={toggleAdditionalFields}
            >
              <Text style={appointmentFormStyles.expandButtonText}>
                {showAdditionalFields ? 'Hide Additional Details' : 'Show Additional Details'}
              </Text>
              <MaterialCommunityIcons
                name={showAdditionalFields ? "chevron-up" : "chevron-down"}
                size={24}
                color={MedicalTheme.colors.primary[500]}
              />
            </Pressable>

            {/* Additional Fields - Animated */}
            {showAdditionalFields && (
              <Animated.View 
                style={[
                  appointmentFormStyles.additionalFieldsContainer,
                  { 
                    height: animatedHeight,
                    opacity: additionalFieldsOpacity
                  }
                ]}
                accessible={true}
                importantForAccessibility="yes"
              >
                <FormInput
                  icon="email-outline"
                  placeholder="Email Address"
                  value={patientData.email || ''}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  maxLength={100}
                />

                <FormInput
                  icon="text-box-outline"
                  placeholder="Clinical Notes (Symptoms, History, etc.)"
                  value={patientData.description || ''}
                  onChangeText={(text) => handleChange('description', text)}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={500}
                />
              </Animated.View>
            )}

            {/* Submit Button */}
            <Pressable
              style={({ pressed }) => [
                appointmentFormStyles.submitButton,
                (loading || !patientData.firstName.trim() || !patientData.contact.trim()) && 
                { backgroundColor: MedicalTheme.colors.primary[300] },
                pressed && { opacity: 0.8 }
              ]}
              onPress={handleSubmit}
              disabled={loading || !patientData.firstName.trim() || !patientData.contact.trim()}
            >
              {loading ? (
                <ActivityIndicator color={MedicalTheme.colors.text.inverse} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={22}
                    color={MedicalTheme.colors.text.inverse}
                  />
                  <Text style={appointmentFormStyles.submitButtonText}>
                    {!patientData.firstName.trim() || !patientData.contact.trim() 
                      ? 'Fill Required Fields' 
                      : 'Confirm Appointment'
                    }
                  </Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === 'android' && (
        <>
          {showDatePicker && pickerMode === 'date' && (
            <DateTimePicker
              value={patientData.appointmentDateTime}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
          {showTimePicker && pickerMode === 'time' && (
            <DateTimePicker
              value={patientData.appointmentDateTime}
              mode="time"
              display="default"
              onChange={onDateChange}
              is24Hour={false}
            />
          )}
        </>
      )}

      {Platform.OS === 'ios' && (showDatePicker || showTimePicker) && (
        <Modal
          visible={showDatePicker || showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowDatePicker(false);
            setShowTimePicker(false);
          }}
        >
          <View style={appointmentFormStyles.pickerModal}>
            <View style={appointmentFormStyles.pickerContainer}>
              <View style={appointmentFormStyles.pickerHeader}>
                <Text style={appointmentFormStyles.pickerTitle}>
                  {pickerMode === 'date' ? 'Select Date' : 'Select Time'}
                </Text>
                <Pressable
                  onPress={() => {
                    setShowDatePicker(false);
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={appointmentFormStyles.pickerButtonText}>Done</Text>
                </Pressable>
              </View>
              {pickerMode === 'date' && (
                <DateTimePicker
                  value={patientData.appointmentDateTime}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  textColor={MedicalTheme.colors.text.primary}
                />
              )}
              {pickerMode === 'time' && (
                <DateTimePicker
                  value={patientData.appointmentDateTime}
                  mode="time"
                  display="spinner"
                  onChange={onDateChange}
                  is24Hour={false}
                  textColor={MedicalTheme.colors.text.primary}
                />
              )}
            </View>
          </View>
        </Modal>
      )}
    </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default ModernAppointmentForm;