import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/newStore/index';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';

import { MedicalTheme } from '@/newConstants/theme';
import { styles } from '@/assets/styles/editProfile.styles';
import { updateProfile } from '@/newService/config/api/profileApi';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileSettingsScreen = () => {
  const profileData = useSelector((state: RootState) => state.profile);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startTimeDate, setStartTimeDate] = useState(new Date());
  const [endTimeDate, setEndTimeDate] = useState(new Date());
  
  // Unified form data state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: profileData.firstName || '',
    lastName: profileData.lastName || '',
    phoneNumber: profileData.phoneNumber || '',
    
    // Professional Information
    specialization: profileData.specialization || '',
    yearsOfExperience: profileData.yearsOfExperience?.toString() || '',
    bio: profileData.bio || '',
    about: profileData.about || '',
    
    // Address Information
    clinicAddress: profileData.clinicAddress || '',
    street: profileData.address?.street || '',
    city: profileData.address?.city || '',
    state: profileData.address?.state || '',
    pincode: profileData.address?.pincode || '',
    country: profileData.address?.country || '',
    
    // Availability
    selectedDays: profileData.availableDays || [],
    timeSlots: profileData.availableTimeSlots || [{ startTime: '09:00', endTime: '17:00' }],
    newTimeSlot: { startTime: '', endTime: '' },
    
    // Education & Awards
    education: profileData.education || [],
    newEducation: '',
    awards: profileData.achievementsAndAwards || [],
    newAward: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Helper functions
  const getSectionTitle = (section: string): string => {
    const titles: {[key: string]: string} = {
      name: 'Name',
      phone: 'Phone Number',
      bio: 'Bio',
      about: 'About',
      specialization: 'Specialization',
      experience: 'Years of Experience',
      clinic: 'Clinic Address',
      address: 'Full Address',
      availability: 'Availability',
      education: 'Education',
      awards: 'Awards & Achievements'
    };
    return titles[section] || section;
  };

  const getSectionIcon = (section: string): string => {
    const icons: {[key: string]: string} = {
      name: 'person',
      phone: 'call',
      bio: 'document-text',
      about: 'information-circle',
      specialization: 'medical',
      experience: 'time',
      clinic: 'business',
      address: 'location',
      availability: 'calendar',
      education: 'school',
      awards: 'trophy'
    };
    return icons[section] || 'settings';
  };

  // Modal functions
  const openModal = (section: string) => {
    setActiveModal(section);
    setErrors({});
  };

  const closeModal = () => {
    setActiveModal(null);
    setErrors({});
  };

  // Form update functions
  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Availability functions
  const toggleDay = (day: string) => {
    const newSelectedDays = formData.selectedDays.includes(day)
      ? formData.selectedDays.filter(d => d !== day)
      : [...formData.selectedDays, day];
    updateFormData({ selectedDays: newSelectedDays });
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const parseTime = (timeString: string): Date => {
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 9, minutes || 0, 0, 0);
    return date;
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (selectedDate) {
      const endTime = formData.newTimeSlot.endTime 
        ? parseTime(formData.newTimeSlot.endTime).getTime()
        : null;
      const startTime = selectedDate.getTime();
      
      if (endTime && startTime >= endTime) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Time',
          text2: 'Start time must be less than end time'
        });
        return;
      }
      
      setStartTimeDate(selectedDate);
      const timeString = formatTime(selectedDate);
      updateFormData({ 
        newTimeSlot: { ...formData.newTimeSlot, startTime: timeString } 
      });
    }
    if (Platform.OS === 'ios') {
      if (event.type === 'dismissed') {
        setShowStartTimePicker(false);
      }
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    if (selectedDate) {
      const startTime = formData.newTimeSlot.startTime 
        ? parseTime(formData.newTimeSlot.startTime).getTime()
        : null;
      const endTime = selectedDate.getTime();
      
      if (startTime && endTime <= startTime) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Time',
          text2: 'End time must be greater than start time'
        });
        return;
      }
      
      setEndTimeDate(selectedDate);
      const timeString = formatTime(selectedDate);
      updateFormData({ 
        newTimeSlot: { ...formData.newTimeSlot, endTime: timeString } 
      });
    }
    if (Platform.OS === 'ios') {
      if (event.type === 'dismissed') {
        setShowEndTimePicker(false);
      }
    }
  };

  const addTimeSlot = () => {
    if (!formData.newTimeSlot.startTime || !formData.newTimeSlot.endTime) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter both start and end time'
      });
      return;
    }
    
    const startTime = parseTime(formData.newTimeSlot.startTime).getTime();
    const endTime = parseTime(formData.newTimeSlot.endTime).getTime();
    
    if (endTime <= startTime) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time',
        text2: 'End time must be greater than start time'
      });
      return;
    }
    
    const newTimeSlots = [...formData.timeSlots, formData.newTimeSlot];
    updateFormData({ 
      timeSlots: newTimeSlots,
      newTimeSlot: { startTime: '', endTime: '' }
    });
    setStartTimeDate(new Date());
    setEndTimeDate(new Date());
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Time slot added successfully'
    });
  };

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length === 1) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'At least one time slot is required'
      });
      return;
    }
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
    updateFormData({ timeSlots: newTimeSlots });
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Time slot removed successfully'
    });
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newTimeSlots = formData.timeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    updateFormData({ timeSlots: newTimeSlots });
  };

  // Education functions
  const addEducation = () => {
    if (!formData.newEducation.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter education details'
      });
      return;
    }
    const newEducationList = [...formData.education, formData.newEducation.trim()];
    updateFormData({ 
      education: newEducationList,
      newEducation: ''
    });
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Education added successfully'
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    updateFormData({ education: newEducation });
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Education removed successfully'
    });
  };

  // Awards functions
  const addAward = () => {
    if (!formData.newAward.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter award details'
      });
      return;
    }
    const newAwards = [...formData.awards, formData.newAward.trim()];
    updateFormData({ 
      awards: newAwards,
      newAward: ''
    });
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Award added successfully'
    });
  };

  const removeAward = (index: number) => {
    const newAwards = formData.awards.filter((_, i) => i !== index);
    updateFormData({ awards: newAwards });
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Award removed successfully'
    });
  };

  // Validation
  const validateField = (field: string, value: string): string => {
    const validations: {[key: string]: () => string} = {
      firstName: () => !value.trim() ? 'First name is required' : value.length < 2 ? 'First name must be at least 2 characters' : '',
      lastName: () => !value.trim() ? 'Last name is required' : value.length < 2 ? 'Last name must be at least 2 characters' : '',
      phoneNumber: () => !value.trim() ? 'Phone number is required' : value.length < 10 ? 'Phone number must be at least 10 digits' : '',
      specialization: () => !value.trim() ? 'Specialization is required' : '',
      yearsOfExperience: () => !value.trim() ? 'Years of experience is required' : isNaN(Number(value)) ? 'Please enter a valid number' : '',
      clinicAddress: () => !value.trim() ? 'Clinic address is required' : '',
      street: () => !value.trim() ? 'Street address is required' : '',
      city: () => !value.trim() ? 'City is required' : '',
      state: () => !value.trim() ? 'State is required' : '',
      country: () => !value.trim() ? 'Country is required' : '',
      pincode: () => !value.trim() ? 'Pincode is required' : '',
      availability: () => formData.selectedDays.length === 0 ? 'Please select at least one day' : formData.timeSlots.length === 0 ? 'Please add at least one time slot' : ''
    };

    return validations[field] ? validations[field]() : '';
  };

  // API call handler
  const handleUpdate = async (section: string) => {
    let fieldError = '';
    let updatePayload = {};

    switch (section) {
      case 'name':
        fieldError = validateField('firstName', formData.firstName) || validateField('lastName', formData.lastName);
        updatePayload = { firstName: formData.firstName, lastName: formData.lastName };
        break;
      case 'phone':
        fieldError = validateField('phoneNumber', formData.phoneNumber);
        updatePayload = { phoneNumber: formData.phoneNumber };
        break;
      case 'bio':
        fieldError = validateField('bio', formData.bio);
        updatePayload = { bio: formData.bio };
        break;
      case 'about':
        fieldError = validateField('about', formData.about);
        updatePayload = { about: formData.about };
        break;
      case 'specialization':
        fieldError = validateField('specialization', formData.specialization);
        updatePayload = { specialization: formData.specialization };
        break;
      case 'experience':
        fieldError = validateField('yearsOfExperience', formData.yearsOfExperience);
        updatePayload = { yearsOfExperience: parseInt(formData.yearsOfExperience) };
        break;
      case 'clinic':
        fieldError = validateField('clinicAddress', formData.clinicAddress);
        updatePayload = { clinicAddress: formData.clinicAddress };
        break;
      case 'address':
        const addressFields = ['street', 'city', 'state', 'pincode', 'country'];
        for (const field of addressFields) {
          const error = validateField(field, formData[field as keyof typeof formData]);
          if (error) {
            fieldError = error;
            break;
          }
        }
        updatePayload = {
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country
          }
        };
        break;
      case 'availability':
        fieldError = validateField('availability', '');
        updatePayload = {
          availableDays: formData.selectedDays,
          availableTimeSlots: formData.timeSlots
        };
        break;
      case 'education':
        updatePayload = { education: formData.education };
        break;
      case 'awards':
        updatePayload = { achievementsAndAwards: formData.awards };
        break;
    }

    if (fieldError) {
      setErrors({ [section]: fieldError });
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(updateProfile(updatePayload));
      if (result.type.endsWith('/fulfilled')) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${getSectionTitle(section)} updated successfully!`
        });
        setErrors({});
        closeModal();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Failed to update ${getSectionTitle(section)}`
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to update ${getSectionTitle(section)}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // UI Components
  const renderInput = (
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    multiline: boolean = false,
    keyboardType: string = 'default'
  ) => (
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={MedicalTheme.colors.text.tertiary}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      keyboardType={keyboardType as any}
    />
  );

  const renderSection = (
    section: string,
    currentValue: string
  ) => (
    <TouchableOpacity 
      style={styles.section}
      onPress={() => openModal(section)}
      activeOpacity={0.7}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={getSectionIcon(section) as any} size={22} color={MedicalTheme.colors.primary[500]} />
          </View>
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionTitle}>{getSectionTitle(section)}</Text>
            {currentValue ? (
              <Text style={styles.currentValue} numberOfLines={1}>{currentValue}</Text>
            ) : (
              <Text style={styles.emptyValue}>Not set</Text>
            )}
          </View>
        </View>
        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={20} color={MedicalTheme.colors.neutral[400]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Modal Header Component
  const renderModalHeader = () => (
    <View style={styles.modalHeader}>
      <View style={styles.modalHeaderContent}>
        <View style={styles.modalIconContainer}>
          <Ionicons 
            name={getSectionIcon(activeModal!) as any} 
            size={28} 
            color={MedicalTheme.colors.text.inverse} 
          />
        </View>
        <View style={styles.modalTitleContainer}>
          <Text style={styles.modalTitle}>Update {getSectionTitle(activeModal!)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
        <Ionicons name="close" size={24} color={MedicalTheme.colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );

  // Modal Content Components
  const renderNameModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First Name</Text>
          {renderInput(
            formData.firstName,
            (text) => updateFormData({ firstName: text }),
            "Enter your first name"
          )}
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last Name</Text>
          {renderInput(
            formData.lastName,
            (text) => updateFormData({ lastName: text }),
            "Enter your last name"
          )}
        </View>
        {errors.name && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
            <Text style={styles.errorText}>{errors.name}</Text>
          </View>
        )}
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('name')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPhoneModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          {renderInput(
            formData.phoneNumber,
            (text) => updateFormData({ phoneNumber: text }),
            "Enter your phone number",
            false,
            'phone-pad'
          )}
          <Text style={styles.inputHelpText}>Enter your 10-digit phone number</Text>
        </View>
        {errors.phone && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
            <Text style={styles.errorText}>{errors.phone}</Text>
          </View>
        )}
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('phone')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Phone</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBioModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Professional Bio</Text>
          {renderInput(
            formData.bio,
            (text) => updateFormData({ bio: text }),
            "Write a short bio about yourself, your expertise, and what makes you unique...",
            true
          )}
          <Text style={styles.inputHelpText}>This will be displayed on your public profile</Text>
        </View>
        {errors.bio && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
            <Text style={styles.errorText}>{errors.bio}</Text>
          </View>
        )}
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('bio')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Bio</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAboutModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>About Me</Text>
          {renderInput(
            formData.about,
            (text) => updateFormData({ about: text }),
            "Tell patients more about your practice, experience, approach to treatment, and what they can expect...",
            true
          )}
          <Text style={styles.inputHelpText}>Detailed information about your practice and experience</Text>
        </View>
        {errors.about && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
            <Text style={styles.errorText}>{errors.about}</Text>
          </View>
        )}
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('about')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update About</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSpecializationModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Specialization</Text>
          {renderInput(
            formData.specialization,
            (text) => updateFormData({ specialization: text }),
            "e.g., Cardiologist, Dermatologist, Pediatrician, Surgeon...",
            false
          )}
          <Text style={styles.inputHelpText}>Your medical specialty or area of expertise</Text>
        </View>
        {errors.specialization && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
            <Text style={styles.errorText}>{errors.specialization}</Text>
          </View>
        )}
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('specialization')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Specialization</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExperienceModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Years of Experience</Text>
          {renderInput(
            formData.yearsOfExperience,
            (text) => updateFormData({ yearsOfExperience: text }),
            "Enter years of experience",
            false,
            'numeric'
          )}
          <Text style={styles.inputHelpText}>Number of years you've been practicing</Text>
        </View>
        {errors.experience && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
            <Text style={styles.errorText}>{errors.experience}</Text>
          </View>
        )}
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('experience')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Experience</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClinicModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Clinic Address</Text>
          {renderInput(
            formData.clinicAddress,
            (text) => updateFormData({ clinicAddress: text }),
            "Enter your clinic or practice address",
            true
          )}
          <Text style={styles.inputHelpText}>Primary address where you see patients</Text>
        </View>
        {errors.clinic && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
            <Text style={styles.errorText}>{errors.clinic}</Text>
          </View>
        )}
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('clinic')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Clinic</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddressModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>Full Address Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street Address</Text>
            {renderInput(
              formData.street,
              (text) => updateFormData({ street: text }),
              "Enter street address",
              false
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.inputLabel}>City</Text>
              {renderInput(
                formData.city,
                (text) => updateFormData({ city: text }),
                "City",
                false
              )}
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.inputLabel}>State</Text>
              {renderInput(
                formData.state,
                (text) => updateFormData({ state: text }),
                "State",
                false
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.inputLabel}>Pincode</Text>
              {renderInput(
                formData.pincode,
                (text) => updateFormData({ pincode: text }),
                "Pincode",
                false,
                'numeric'
              )}
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.inputLabel}>Country</Text>
              {renderInput(
                formData.country,
                (text) => updateFormData({ country: text }),
                "Country",
                false
              )}
            </View>
          </View>

          {errors.address && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
              <Text style={styles.errorText}>{errors.address}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('address')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Address</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAvailabilityModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Days Selection */}
          <View style={styles.availabilitySection}>
            <Text style={styles.sectionLabel}>Available Days</Text>
            <Text style={styles.sectionDescription}>Select the days you are available for appointments</Text>
            <View style={styles.daysGrid}>
              {DAYS_OF_WEEK.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    formData.selectedDays.includes(day) && styles.dayButtonSelected
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    formData.selectedDays.includes(day) && styles.dayButtonTextSelected
                  ]}>
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.selectedDaysText}>
              {formData.selectedDays.length > 0 ? 
                `Selected: ${formData.selectedDays.join(', ')}` : 
                'No days selected'
              }
            </Text>
          </View>

          {/* Time Slots */}
          <View style={styles.availabilitySection}>
            <Text style={styles.sectionLabel}>Working Hours</Text>
            <Text style={styles.sectionDescription}>Add your available time slots for selected days</Text>
            
            {/* Add New Time Slot */}
            <View style={styles.addTimeSlotContainer}>
              <Text style={styles.timeSlotLabel}>Add New Time Slot</Text>
              <View style={styles.timeInputRow}>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.timeInputLabel}>Start Time</Text>
                  <Pressable
                    onPress={() => {
                      if (formData.newTimeSlot.startTime) {
                        setStartTimeDate(parseTime(formData.newTimeSlot.startTime));
                      }
                      setShowStartTimePicker(true);
                    }}
                  >
                    <View style={[styles.timeInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                      <Text style={{ 
                        color: formData.newTimeSlot.startTime 
                          ? MedicalTheme.colors.text.primary 
                          : MedicalTheme.colors.text.tertiary 
                      }}>
                        {formData.newTimeSlot.startTime || '09:00 AM'}
                      </Text>
                      <Ionicons name="time-outline" size={20} color={MedicalTheme.colors.primary[500]} />
                    </View>
                  </Pressable>
                </View>
                <Text style={styles.timeSeparator}>to</Text>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.timeInputLabel}>End Time</Text>
                  <Pressable
                    onPress={() => {
                      if (formData.newTimeSlot.endTime) {
                        setEndTimeDate(parseTime(formData.newTimeSlot.endTime));
                      }
                      setShowEndTimePicker(true);
                    }}
                  >
                    <View style={[styles.timeInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                      <Text style={{ 
                        color: formData.newTimeSlot.endTime 
                          ? MedicalTheme.colors.text.primary 
                          : MedicalTheme.colors.text.tertiary 
                      }}>
                        {formData.newTimeSlot.endTime || '05:00 PM'}
                      </Text>
                      <Ionicons name="time-outline" size={20} color={MedicalTheme.colors.primary[500]} />
                    </View>
                  </Pressable>
                </View>
                <TouchableOpacity 
                  style={styles.addTimeButton}
                  onPress={addTimeSlot}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {Platform.OS === 'android' && (
              <>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTimeDate}
                    mode="time"
                    display="default"
                    onChange={handleStartTimeChange}
                    is24Hour={false}
                  />
                )}
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTimeDate}
                    mode="time"
                    display="default"
                    onChange={handleEndTimeChange}
                    is24Hour={false}
                  />
                )}
              </>
            )}

            {Platform.OS === 'ios' && (
              <>
                <Modal
                  visible={showStartTimePicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowStartTimePicker(false)}
                >
                  <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: MedicalTheme.colors.background.primary, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: MedicalTheme.colors.text.primary }}>Select Start Time</Text>
                        <Pressable onPress={() => setShowStartTimePicker(false)}>
                          <Text style={{ fontSize: 16, color: MedicalTheme.colors.primary[500], fontWeight: '600' }}>Done</Text>
                        </Pressable>
                      </View>
                      <DateTimePicker
                        value={startTimeDate}
                        mode="time"
                        display="spinner"
                        onChange={handleStartTimeChange}
                        textColor={MedicalTheme.colors.text.primary}
                        is24Hour={false}
                      />
                    </View>
                  </View>
                </Modal>

                <Modal
                  visible={showEndTimePicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowEndTimePicker(false)}
                >
                  <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: MedicalTheme.colors.background.primary, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: MedicalTheme.colors.text.primary }}>Select End Time</Text>
                        <Pressable onPress={() => setShowEndTimePicker(false)}>
                          <Text style={{ fontSize: 16, color: MedicalTheme.colors.primary[500], fontWeight: '600' }}>Done</Text>
                        </Pressable>
                      </View>
                      <DateTimePicker
                        value={endTimeDate}
                        mode="time"
                        display="spinner"
                        onChange={handleEndTimeChange}
                        textColor={MedicalTheme.colors.text.primary}
                        is24Hour={false}
                      />
                    </View>
                  </View>
                </Modal>
              </>
            )}

            {/* Current Time Slots */}
            <View style={styles.currentTimeSlots}>
              <Text style={styles.timeSlotLabel}>Current Time Slots</Text>
              {formData.timeSlots.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="time-outline" size={40} color={MedicalTheme.colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>No time slots added yet</Text>
                  <Text style={styles.emptyStateSubtext}>Add your working hours above</Text>
                </View>
              ) : (
                formData.timeSlots.map((slot, index) => (
                  <View key={index} style={styles.timeSlotItem}>
                    <View style={styles.timeSlotInfo}>
                      <Ionicons name="time" size={16} color={MedicalTheme.colors.primary[500]} />
                      <Text style={styles.timeSlotText}>
                        {slot.startTime} - {slot.endTime}
                      </Text>
                    </View>
                    {formData.timeSlots.length > 1 && (
                      <TouchableOpacity 
                        style={styles.removeTimeButton}
                        onPress={() => removeTimeSlot(index)}
                      >
                        <Ionicons name="trash-outline" size={16} color={MedicalTheme.colors.error[500]} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionLabel}>Availability Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Ionicons name="calendar-outline" size={16} color={MedicalTheme.colors.primary[500]} />
                <Text style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Days: </Text>
                  {formData.selectedDays.length > 0 ? formData.selectedDays.join(', ') : 'None selected'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="time-outline" size={16} color={MedicalTheme.colors.primary[500]} />
                <Text style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Time Slots: </Text>
                  {formData.timeSlots.length > 0 ? 
                    formData.timeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ') : 
                    'No time slots'
                  }
                </Text>
              </View>
            </View>
          </View>

          {errors.availability && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
              <Text style={styles.errorText}>{errors.availability}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('availability')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Availability</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEducationModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Add Education */}
          <View style={styles.listSection}>
            <Text style={styles.sectionLabel}>Add Education</Text>
            <Text style={styles.sectionDescription}>Add your educational qualifications and degrees</Text>
            <View style={styles.addItemContainer}>
              {renderInput(
                formData.newEducation,
                (text) => updateFormData({ newEducation: text }),
                "e.g., MBBS from ABC Medical College, 2015\nMD in Cardiology from XYZ University, 2020",
                true
              )}
              <TouchableOpacity style={styles.addButton} onPress={addEducation}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Education</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Education List */}
          <View style={styles.listSection}>
            <Text style={styles.sectionLabel}>Education History</Text>
            {formData.education.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="school-outline" size={40} color={MedicalTheme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No education entries yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your qualifications above</Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {formData.education.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.listItemIcon}>
                      <Ionicons name="school" size={16} color={MedicalTheme.colors.primary[500]} />
                    </View>
                    <Text style={styles.listItemText}>{item}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeEducation(index)}
                    >
                      <Ionicons name="trash-outline" size={16} color={MedicalTheme.colors.error[500]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('education')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Education</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAwardsModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Add Award */}
          <View style={styles.listSection}>
            <Text style={styles.sectionLabel}>Add Award or Achievement</Text>
            <Text style={styles.sectionDescription}>Add your professional awards, recognitions, and achievements</Text>
            <View style={styles.addItemContainer}>
              {renderInput(
                formData.newAward,
                (text) => updateFormData({ newAward: text }),
                "e.g., Best Doctor Award 2023\nResearch Excellence Award 2022\nPatient Choice Award 2021",
                true
              )}
              <TouchableOpacity style={styles.addButton} onPress={addAward}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Award</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Awards List */}
          <View style={styles.listSection}>
            <Text style={styles.sectionLabel}>Awards & Achievements</Text>
            {formData.awards.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={40} color={MedicalTheme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No awards entries yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your achievements above</Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {formData.awards.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.listItemIcon}>
                      <Ionicons name="trophy" size={16} color={MedicalTheme.colors.primary[500]} />
                    </View>
                    <Text style={styles.listItemText}>{item}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeAward(index)}
                    >
                      <Ionicons name="trash-outline" size={16} color={MedicalTheme.colors.error[500]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleUpdate('awards')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update Awards</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModalContent = () => {
    switch (activeModal) {
      case 'name':
        return renderNameModal();
      case 'phone':
        return renderPhoneModal();
      case 'bio':
        return renderBioModal();
      case 'about':
        return renderAboutModal();
      case 'specialization':
        return renderSpecializationModal();
      case 'experience':
        return renderExperienceModal();
      case 'clinic':
        return renderClinicModal();
      case 'address':
        return renderAddressModal();
      case 'availability':
        return renderAvailabilityModal();
      case 'education':
        return renderEducationModal();
      case 'awards':
        return renderAwardsModal();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={MedicalTheme.colors.primary[500]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Personal Information */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Personal Information</Text>
          {renderSection("name", `${formData.firstName} ${formData.lastName}`.trim())}
          {renderSection("phone", formData.phoneNumber)}
        </View>

        {/* Professional Information */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Professional Information</Text>
          {renderSection("bio", formData.bio)}
          {renderSection("about", formData.about)}
          {renderSection("specialization", formData.specialization)}
          {renderSection("experience", formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : '')}
        </View>

        {/* Address Information */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Address Information</Text>
          {renderSection("clinic", formData.clinicAddress)}
          {renderSection("address", `${formData.street ? formData.street + ', ' : ''}${formData.city || ''}`)}
        </View>

        {/* Practice Details */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Practice Details</Text>
          {renderSection("availability", formData.selectedDays.length > 0 ? 
            `${formData.selectedDays.length} day${formData.selectedDays.length > 1 ? 's' : ''} selected` : 
            'Not set'
          )}
        </View>

        {/* Qualifications */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Qualifications</Text>
          {renderSection("education", formData.education.length > 0 ? `${formData.education.length} entries` : 'Not set')}
          {renderSection("awards", formData.awards.length > 0 ? `${formData.awards.length} awards` : 'Not set')}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={!!activeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
        accessible={false}
      >
        <View style={styles.modalContainer} accessible={false} importantForAccessibility="no-hide-descendants">
          {renderModalHeader()}
          {renderModalContent()}
        </View>
      </Modal>

      {/* Toast Component */}
      <Toast />
    </View>
  );
};

export default ProfileSettingsScreen;