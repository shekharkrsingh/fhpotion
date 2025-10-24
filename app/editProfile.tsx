import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Easing,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateProfile } from '@/service/properties/profileApi';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const ProfileSettingsScreen = () => {
  const profileData = useSelector((state: RootState) => state.profile);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
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
    postalCode: profileData.address?.postalCode || '',
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
  const sectionAnimations = useRef<{[key: string]: Animated.Value}>({}).current;

  // Helper functions
  const getSectionAnimation = (section: string) => {
    if (!sectionAnimations[section]) {
      sectionAnimations[section] = new Animated.Value(0);
    }
    return sectionAnimations[section];
  };

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      Animated.timing(getSectionAnimation(section), {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }).start(() => setActiveSection(null));
    } else {
      if (activeSection) {
        Animated.timing(getSectionAnimation(activeSection), {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false
        }).start();
      }
      setActiveSection(section);
      Animated.timing(getSectionAnimation(section), {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }).start();
    }
  };

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

  const addTimeSlot = () => {
    if (!formData.newTimeSlot.startTime || !formData.newTimeSlot.endTime) {
      Alert.alert('Error', 'Please enter both start and end time');
      return;
    }
    const newTimeSlots = [...formData.timeSlots, formData.newTimeSlot];
    updateFormData({ 
      timeSlots: newTimeSlots,
      newTimeSlot: { startTime: '', endTime: '' }
    });
  };

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length === 1) {
      Alert.alert('Error', 'At least one time slot is required');
      return;
    }
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
    updateFormData({ timeSlots: newTimeSlots });
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
      Alert.alert('Error', 'Please enter education details');
      return;
    }
    const newEducationList = [...formData.education, formData.newEducation.trim()];
    updateFormData({ 
      education: newEducationList,
      newEducation: ''
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    updateFormData({ education: newEducation });
  };

  // Awards functions
  const addAward = () => {
    if (!formData.newAward.trim()) {
      Alert.alert('Error', 'Please enter award details');
      return;
    }
    const newAwards = [...formData.awards, formData.newAward.trim()];
    updateFormData({ 
      awards: newAwards,
      newAward: ''
    });
  };

  const removeAward = (index: number) => {
    const newAwards = formData.awards.filter((_, i) => i !== index);
    updateFormData({ awards: newAwards });
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
      postalCode: () => !value.trim() ? 'Postal code is required' : '',
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
        const addressFields = ['street', 'city', 'state', 'postalCode', 'country'];
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
            postalCode: formData.postalCode,
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
      const success = await updateProfile(dispatch, updatePayload);
      if (success) {
        Alert.alert('Success', `${getSectionTitle(section)} updated successfully!`);
        setErrors({});
        toggleSection(section);
      } else {
        Alert.alert('Error', `Failed to update ${getSectionTitle(section).toLowerCase()}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update ${getSectionTitle(section).toLowerCase()}`);
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
      placeholderTextColor={AppTheme.colors.gray500}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      keyboardType={keyboardType as any}
    />
  );

  const renderSection = (
    section: string,
    icon: string,
    currentValue: string,
    inputField: React.ReactNode
  ) => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection(section)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderContent}>
          <Ionicons name={icon as any} size={24} color={AppTheme.colors.primary} />
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionTitle}>{getSectionTitle(section)}</Text>
            {currentValue ? (
              <Text style={styles.currentValue} numberOfLines={1}>{currentValue}</Text>
            ) : (
              <Text style={styles.emptyValue}>Not set</Text>
            )}
          </View>
        </View>
        <Ionicons 
          name={activeSection === section ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={AppTheme.colors.gray500} 
        />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.sectionContent,
          {
            height: getSectionAnimation(section).interpolate({
              inputRange: [0, 1],
              outputRange: [0, 'auto']
            }),
            opacity: getSectionAnimation(section)
          }
        ]}
      >
        {activeSection === section && (
          <View style={styles.editContent}>
            {inputField}
            {errors[section] && <Text style={styles.errorText}>{errors[section]}</Text>}
            <TouchableOpacity 
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              onPress={() => handleUpdate(section)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Update {getSectionTitle(section)}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.primary} />
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
        {/* Name Section */}
        {renderSection(
          "name",
          "person",
          `${formData.firstName} ${formData.lastName}`.trim(),
          <View style={styles.nameContent}>
            <View style={styles.row}>
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
            </View>
          </View>
        )}

        {/* Phone Number Section */}
        {renderSection(
          "phone",
          "call",
          formData.phoneNumber,
          renderInput(
            formData.phoneNumber,
            (text) => updateFormData({ phoneNumber: text }),
            "Enter your phone number",
            false,
            'phone-pad'
          )
        )}

        {/* Bio Section */}
        {renderSection(
          "bio",
          "document-text",
          formData.bio,
          renderInput(
            formData.bio,
            (text) => updateFormData({ bio: text }),
            "Write a short bio about yourself...",
            true
          )
        )}

        {/* About Section */}
        {renderSection(
          "about",
          "information-circle",
          formData.about,
          renderInput(
            formData.about,
            (text) => updateFormData({ about: text }),
            "Tell patients more about your practice and experience...",
            true
          )
        )}

        {/* Specialization Section */}
        {renderSection(
          "specialization",
          "medical",
          formData.specialization,
          renderInput(
            formData.specialization,
            (text) => updateFormData({ specialization: text }),
            "e.g., Cardiologist, Dermatologist, Pediatrician",
            false
          )
        )}

        {/* Years of Experience Section */}
        {renderSection(
          "experience",
          "time",
          formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : '',
          renderInput(
            formData.yearsOfExperience,
            (text) => updateFormData({ yearsOfExperience: text }),
            "Enter years of experience",
            false,
            'numeric'
          )
        )}

        {/* Clinic Address Section */}
        {renderSection(
          "clinic",
          "business",
          formData.clinicAddress,
          renderInput(
            formData.clinicAddress,
            (text) => updateFormData({ clinicAddress: text }),
            "Enter your clinic address",
            true
          )
        )}

        {/* Full Address Section */}
        {renderSection(
          "address",
          "location",
          `${formData.street ? formData.street + ', ' : ''}${formData.city || ''}`,
          <View style={styles.addressForm}>
            {renderInput(
              formData.street,
              (text) => updateFormData({ street: text }),
              "Street Address",
              false
            )}
            <View style={styles.row}>
              {renderInput(
                formData.city,
                (text) => updateFormData({ city: text }),
                "City",
                false
              )}
              {renderInput(
                formData.state,
                (text) => updateFormData({ state: text }),
                "State",
                false
              )}
            </View>
            <View style={styles.row}>
              {renderInput(
                formData.postalCode,
                (text) => updateFormData({ postalCode: text }),
                "Postal Code",
                false,
                'numeric'
              )}
              {renderInput(
                formData.country,
                (text) => updateFormData({ country: text }),
                "Country",
                false
              )}
            </View>
          </View>
        )}

        {/* Availability Section */}
        {renderSection(
          "availability",
          "calendar",
          formData.selectedDays.length > 0 ? 
            `${formData.selectedDays.length} day${formData.selectedDays.length > 1 ? 's' : ''} selected` : 
            'Not set',
          <View style={styles.availabilityContent}>
            {/* Days Selection */}
            <View style={styles.daysSection}>
              <Text style={styles.sectionLabel}>Select Available Days</Text>
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
                      {day}
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
            <View style={styles.timeSlotsSection}>
              <Text style={styles.sectionLabel}>Time Slots (Common for all selected days)</Text>
              
              {/* Add New Time Slot */}
              <View style={styles.addTimeSlotContainer}>
                <Text style={styles.timeSlotLabel}>Add New Time Slot</Text>
                <View style={styles.timeInputRow}>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeInputLabel}>Start Time</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={formData.newTimeSlot.startTime}
                      onChangeText={(text) => updateFormData({ newTimeSlot: {...formData.newTimeSlot, startTime: text} })}
                      placeholder="09:00"
                      placeholderTextColor={AppTheme.colors.gray500}
                    />
                  </View>
                  <Text style={styles.timeSeparator}>to</Text>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeInputLabel}>End Time</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={formData.newTimeSlot.endTime}
                      onChangeText={(text) => updateFormData({ newTimeSlot: {...formData.newTimeSlot, endTime: text} })}
                      placeholder="17:00"
                      placeholderTextColor={AppTheme.colors.gray500}
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.addTimeButton}
                    onPress={addTimeSlot}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Current Time Slots */}
              <View style={styles.currentTimeSlots}>
                <Text style={styles.timeSlotLabel}>Current Time Slots</Text>
                {formData.timeSlots.length === 0 ? (
                  <Text style={styles.emptyStateText}>No time slots added</Text>
                ) : (
                  formData.timeSlots.map((slot, index) => (
                    <View key={index} style={styles.timeSlotItem}>
                      <View style={styles.timeSlotInfo}>
                        <Text style={styles.timeSlotText}>
                          {slot.startTime} - {slot.endTime}
                        </Text>
                      </View>
                      {formData.timeSlots.length > 1 && (
                        <TouchableOpacity 
                          style={styles.removeTimeButton}
                          onPress={() => removeTimeSlot(index)}
                        >
                          <Ionicons name="trash" size={16} color={AppTheme.colors.danger} />
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
                <Text style={styles.summaryText}>
                  <Text style={styles.summaryLabel}>Days: </Text>
                  {formData.selectedDays.length > 0 ? formData.selectedDays.join(', ') : 'None selected'}
                </Text>
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
        )}

        {/* Education Section */}
        {renderSection(
          "education",
          "school",
          formData.education.length > 0 ? `${formData.education.length} entries` : 'Not set',
          <View style={styles.listContent}>
            <Text style={styles.subSectionTitle}>Add Education</Text>
            <View style={styles.addItemContainer}>
              {renderInput(
                formData.newEducation,
                (text) => updateFormData({ newEducation: text }),
                "e.g., MBBS from ABC Medical College, 2015",
                true
              )}
              <TouchableOpacity style={styles.addButton} onPress={addEducation}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Education</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subSectionTitle}>Education History</Text>
            {formData.education.length === 0 ? (
              <Text style={styles.emptyStateText}>No education entries yet</Text>
            ) : (
              <FlatList
                data={formData.education}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.listItem}>
                    <Text style={styles.listItemText}>{item}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeEducation(index)}
                    >
                      <Ionicons name="trash" size={16} color={AppTheme.colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* Awards Section */}
        {renderSection(
          "awards",
          "trophy",
          formData.awards.length > 0 ? `${formData.awards.length} awards` : 'Not set',
          <View style={styles.listContent}>
            <Text style={styles.subSectionTitle}>Add Award or Achievement</Text>
            <View style={styles.addItemContainer}>
              {renderInput(
                formData.newAward,
                (text) => updateFormData({ newAward: text }),
                "e.g., Best Doctor Award 2023, Research Excellence Award",
                true
              )}
              <TouchableOpacity style={styles.addButton} onPress={addAward}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Award</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subSectionTitle}>Awards & Achievements</Text>
            {formData.awards.length === 0 ? (
              <Text style={styles.emptyStateText}>No awards entries yet</Text>
            ) : (
              <FlatList
                data={formData.awards}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.listItem}>
                    <Text style={styles.listItemText}>{item}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeAward(index)}
                    >
                      <Ionicons name="trash" size={16} color={AppTheme.colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: AppTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: AppTheme.colors.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 14,
    color: AppTheme.colors.gray600,
  },
  emptyValue: {
    fontSize: 14,
    color: AppTheme.colors.gray400,
    fontStyle: 'italic',
  },
  sectionContent: {
    overflow: 'hidden',
  },
  editContent: {
    padding: 20,
    paddingTop: 0,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  nameContent: {
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: AppTheme.colors.danger,
    marginBottom: 12,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressForm: {
    gap: 12,
  },
  availabilityContent: {
    gap: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  daysSection: {
    gap: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  dayButton: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  dayButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedDaysText: {
    fontSize: 14,
    color: AppTheme.colors.gray600,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  timeSlotsSection: {
    gap: 16,
  },
  addTimeSlotContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeSlotLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  timeInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 20,
  },
  addTimeButton: {
    backgroundColor: AppTheme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentTimeSlots: {
    gap: 8,
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeSlotInfo: {
    flex: 1,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  removeTimeButton: {
    padding: 4,
  },
  summarySection: {
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  summaryText: {
    fontSize: 14,
    color: '#0369A1',
    marginBottom: 4,
  },
  summaryLabel: {
    fontWeight: '600',
  },
  listContent: {
    gap: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  addItemContainer: {
    gap: 12,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  removeButton: {
    padding: 4,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 14,
    color: AppTheme.colors.gray500,
    fontStyle: 'italic',
    padding: 20,
  },
});

export default ProfileSettingsScreen;