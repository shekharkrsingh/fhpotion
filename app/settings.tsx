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
  Modal,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { router } from 'expo-router';
import OTPVerification from '@/componets/OTPVerificationProps';

const SettingsScreen = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const dispatch = useDispatch();
  const profileData = useSelector((state: RootState) => state.profile);
  
  // Form states
  const [formData, setFormData] = useState({
    // Change Password
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Update Email
    currentEmail: profileData.email || 'doctor@example.com',
    newEmail: '',
    emailPassword: '',

    // Notification Preferences
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    promotionalEmails: false,

    // Privacy Settings
    profileVisibility: 'public', // public, patients_only, private
    showOnlineStatus: true,
    allowPatientReviews: true,

    // Contact Support
    supportSubject: '',
    supportMessage: '',
    supportCategory: 'general'
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

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Validation functions
  const validatePassword = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.newEmail.trim()) {
      newErrors.newEmail = 'New email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.newEmail)) {
      newErrors.newEmail = 'Please enter a valid email address';
    } else if (formData.newEmail === formData.currentEmail) {
      newErrors.newEmail = 'New email must be different from current email';
    }

    if (!formData.emailPassword.trim()) {
      newErrors.emailPassword = 'Password is required to confirm email change';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSupportMessage = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.supportSubject.trim()) {
      newErrors.supportSubject = 'Subject is required';
    }

    if (!formData.supportMessage.trim()) {
      newErrors.supportMessage = 'Message is required';
    } else if (formData.supportMessage.length < 10) {
      newErrors.supportMessage = 'Please provide more details (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API Handlers
  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('Success', 'Password changed successfully!');
      updateFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      toggleSection('password');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowOTPModal(true);
      Alert.alert('OTP Sent', 'Verification code has been sent to your new email address.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      // Simulate OTP verification and email update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowOTPModal(false);
      Alert.alert('Success', 'Email updated successfully!');
      updateFormData({ newEmail: '', emailPassword: '', currentEmail: formData.newEmail });
      setErrors({});
      toggleSection('email');
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (): Promise<boolean> => {
    try {
      // Simulate resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      return false;
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Preferences updated successfully!');
      toggleSection('notifications');
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Privacy settings updated successfully!');
      toggleSection('privacy');
    } catch (error) {
      Alert.alert('Error', 'Failed to update privacy settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSupport = async () => {
    if (!validateSupportMessage()) return;

    setIsLoading(true);
    try {
      // Generate ticket ID and include doctor info
      const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const doctorId = profileData.doctorId || 'N/A';
      const doctorEmail = formData.currentEmail;

      const supportData = {
        ticketId,
        doctorId,
        doctorEmail,
        subject: formData.supportSubject,
        message: formData.supportMessage,
        category: formData.supportCategory,
        timestamp: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Support Ticket Created',
        `Your support request has been submitted successfully!\n\nTicket ID: ${ticketId}\nWe'll get back to you within 24 hours.`,
        [{ text: 'OK', onPress: () => {
          updateFormData({ supportSubject: '', supportMessage: '', supportCategory: 'general' });
          setErrors({});
          toggleSection('support');
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit support request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Deactivate Account',
      'Are you sure you want to deactivate your account? This action can be reversed by contacting support.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Deactivate', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deactivated', 'Your account has been deactivated successfully.');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
          }
        }
      ]
    );
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+18005551234');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@healapp.com');
  };

  // UI Components
  const renderInput = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    error?: string,
    placeholder: string = '',
    secureTextEntry: boolean = false,
    keyboardType: string = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, multiline && styles.textArea]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={AppTheme.colors.gray500}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType as any}
        autoCapitalize="none"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderToggle = (label: string, value: boolean, onToggle: (value: boolean) => void, description?: string) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleTextContainer}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && <Text style={styles.toggleDescription}>{description}</Text>}
      </View>
      <TouchableOpacity
        style={[styles.toggle, value && styles.toggleActive]}
        onPress={() => onToggle(!value)}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </TouchableOpacity>
    </View>
  );

  const renderRadio = (label: string, value: string, currentValue: string, onSelect: (value: string) => void, description?: string) => (
    <TouchableOpacity style={styles.radioContainer} onPress={() => onSelect(value)}>
      <View style={styles.radioContent}>
        <View style={[styles.radio, value === currentValue && styles.radioActive]}>
          {value === currentValue && <View style={styles.radioDot} />}
        </View>
        <View style={styles.radioTextContainer}>
          <Text style={styles.radioLabel}>{label}</Text>
          {description && <Text style={styles.radioDescription}>{description}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (
    section: string,
    icon: string,
    title: string,
    description: string,
    content: React.ReactNode
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
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionDescription}>{description}</Text>
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
            {content}
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Change Password Section */}
        {renderSection(
          "password",
          "lock-closed",
          "Change Password",
          "Update your account password",
          <View style={styles.formContent}>
            {renderInput(
              "Current Password",
              formData.oldPassword,
              (text) => updateFormData({ oldPassword: text }),
              errors.oldPassword,
              "Enter your current password",
              true
            )}
            
            {renderInput(
              "New Password",
              formData.newPassword,
              (text) => updateFormData({ newPassword: text }),
              errors.newPassword,
              "Enter new password",
              true
            )}
            
            {renderInput(
              "Confirm New Password",
              formData.confirmPassword,
              (text) => updateFormData({ confirmPassword: text }),
              errors.confirmPassword,
              "Re-enter new password",
              true
            )}

            <TouchableOpacity 
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="key" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Change Password</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Update Email Section */}
        {renderSection(
          "email",
          "mail",
          "Update Email Address",
          "Change your account email address",
          <View style={styles.formContent}>
            <View style={styles.currentEmailContainer}>
              <Text style={styles.currentEmailLabel}>Current Email</Text>
              <Text style={styles.currentEmail}>{formData.currentEmail}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={AppTheme.colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>

            {renderInput(
              "New Email Address",
              formData.newEmail,
              (text) => updateFormData({ newEmail: text }),
              errors.newEmail,
              "Enter new email address",
              false,
              'email-address'
            )}
            
            {renderInput(
              "Confirm Password",
              formData.emailPassword,
              (text) => updateFormData({ emailPassword: text }),
              errors.emailPassword,
              "Enter your password to confirm",
              true
            )}

            <TouchableOpacity 
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              onPress={handleSendEmailOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="mail" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Send Verification Code</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Notification Preferences */}
        {renderSection(
          "notifications",
          "notifications",
          "Notification Preferences",
          "Manage how you receive notifications",
          <View style={styles.formContent}>
            {renderToggle(
              "Email Notifications",
              formData.emailNotifications,
              (value) => updateFormData({ emailNotifications: value }),
              "Receive important updates via email"
            )}
            
            {renderToggle(
              "Push Notifications",
              formData.pushNotifications,
              (value) => updateFormData({ pushNotifications: value }),
              "Get instant alerts on your device"
            )}
            
            {renderToggle(
              "Appointment Reminders",
              formData.appointmentReminders,
              (value) => updateFormData({ appointmentReminders: value }),
              "Reminders for upcoming appointments"
            )}
            
            {renderToggle(
              "Promotional Emails",
              formData.promotionalEmails,
              (value) => updateFormData({ promotionalEmails: value }),
              "Special offers and health tips"
            )}

            <TouchableOpacity 
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              onPress={handleSavePreferences}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Save Preferences</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Privacy Settings */}
        {renderSection(
          "privacy",
          "shield-checkmark",
          "Privacy Settings",
          "Control your profile visibility and privacy",
          <View style={styles.formContent}>
            <Text style={styles.subSectionTitle}>Profile Visibility</Text>
            {renderRadio(
              "Public",
              "public",
              formData.profileVisibility,
              (value) => updateFormData({ profileVisibility: value }),
              "Visible to all patients"
            )}
            {renderRadio(
              "Patients Only",
              "patients_only",
              formData.profileVisibility,
              (value) => updateFormData({ profileVisibility: value }),
              "Visible only to your patients"
            )}
            {renderRadio(
              "Private",
              "private",
              formData.profileVisibility,
              (value) => updateFormData({ profileVisibility: value }),
              "Hidden from all patients"
            )}

            <View style={styles.toggleGroup}>
              {renderToggle(
                "Show Online Status",
                formData.showOnlineStatus,
                (value) => updateFormData({ showOnlineStatus: value }),
                "Display when you're available for consultations"
              )}
              
              {renderToggle(
                "Allow Patient Reviews",
                formData.allowPatientReviews,
                (value) => updateFormData({ allowPatientReviews: value }),
                "Let patients leave reviews and ratings"
              )}
            </View>

            <TouchableOpacity 
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              onPress={handleSavePrivacy}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Save Privacy Settings</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Contact Support */}
        {renderSection(
          "support",
          "headset",
          "Contact Support",
          "Get help from our support team",
          <View style={styles.formContent}>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleCallSupport}>
                <Ionicons name="call" size={24} color={AppTheme.colors.primary} />
                <Text style={styles.quickActionText}>Call Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={handleEmailSupport}>
                <Ionicons name="mail" size={24} color={AppTheme.colors.primary} />
                <Text style={styles.quickActionText}>Email Support</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subSectionTitle}>Submit Support Ticket</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {['general', 'technical', 'billing', 'feature_request'].map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      formData.supportCategory === category && styles.categoryButtonActive
                    ]}
                    onPress={() => updateFormData({ supportCategory: category })}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      formData.supportCategory === category && styles.categoryButtonTextActive
                    ]}>
                      {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {renderInput(
              "Subject",
              formData.supportSubject,
              (text) => updateFormData({ supportSubject: text }),
              errors.supportSubject,
              "Brief description of your issue"
            )}
            
            {renderInput(
              "Message",
              formData.supportMessage,
              (text) => updateFormData({ supportMessage: text }),
              errors.supportMessage,
              "Please describe your issue in detail...",
              false,
              'default',
              true
            )}

            <View style={styles.supportInfo}>
              <Text style={styles.supportInfoText}>
                Your ticket will automatically include:
              </Text>
              <Text style={styles.supportInfoDetail}>• Doctor ID: {profileData.doctorId || 'N/A'}</Text>
              <Text style={styles.supportInfoDetail}>• Email: {formData.currentEmail}</Text>
              <Text style={styles.supportInfoDetail}>• Automatic ticket ID generation</Text>
            </View>

            <TouchableOpacity 
              style={[styles.actionButton, isLoading && styles.buttonDisabled]}
              onPress={handleSubmitSupport}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Submit Support Request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Account Actions Section */}
        {renderSection(
          "account",
          "person",
          "Account Actions",
          "Manage your account status",
          <View style={styles.accountActionsContent}>
            <Text style={styles.warningText}>
              These actions are irreversible and will affect your account access.
            </Text>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.accountActionButton, styles.deactivateButton]}
                onPress={handleDeactivateAccount}
              >
                <View style={styles.accountActionContent}>
                  <Ionicons name="pause-circle" size={24} color="#fff" />
                  <Text style={styles.accountActionText}>Deactivate Account</Text>
                  <Text style={styles.accountActionDescription}>
                    Temporarily disable your account
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.accountActionButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <View style={styles.accountActionContent}>
                  <Ionicons name="trash" size={24} color="#fff" />
                  <Text style={styles.accountActionText}>Delete Account</Text>
                  <Text style={styles.accountActionDescription}>
                    Permanently delete your account and data
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOTPModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOTPModal(false)}
      >
        <OTPVerification
          email={formData.newEmail}
          onSubmit={handleVerifyOTP}
          onResend={handleResendOTP}
        />
      </Modal>
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
  sectionDescription: {
    fontSize: 14,
    color: AppTheme.colors.gray600,
  },
  sectionContent: {
    overflow: 'hidden',
  },
  editContent: {
    padding: 20,
    paddingTop: 0,
  },
  formContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: AppTheme.colors.danger,
    backgroundColor: `${AppTheme.colors.danger}10`,
  },
  errorText: {
    fontSize: 14,
    color: AppTheme.colors.danger,
    marginTop: 4,
  },
  currentEmailContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    marginBottom: 16,
  },
  currentEmailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  currentEmail: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 12,
    color: AppTheme.colors.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: AppTheme.colors.gray600, 
  },
  toggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  // Radio Styles
  radioContainer: {
    paddingVertical: 12,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: AppTheme.colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppTheme.colors.primary,
  },
  radioTextContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  radioDescription: {
    fontSize: 14,
    color: AppTheme.colors.gray600,
  },
  toggleGroup: {
    marginTop: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  // Support Styles
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppTheme.colors.primary,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  supportInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  supportInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 8,
  },
  supportInfoDetail: {
    fontSize: 13,
    color: '#0369A1',
    marginBottom: 4,
  },
  // Account Actions
  accountActionsContent: {
    gap: 20,
  },
  warningText: {
    fontSize: 14,
    color: AppTheme.colors.warning,
    textAlign: 'center',
    fontWeight: '500',
    padding: 16,
    backgroundColor: `${AppTheme.colors.warning}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${AppTheme.colors.warning}20`,
  },
  actionButtonsContainer: {
    gap: 16,
  },
  accountActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  accountActionContent: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
  },
  deactivateButton: {
    backgroundColor: '#FFA726',
  },
  deleteButton: {
    backgroundColor: AppTheme.colors.danger,
  },
  accountActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  accountActionDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SettingsScreen;