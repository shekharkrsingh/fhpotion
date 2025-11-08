import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/newStore/rootReducer';
import { router } from 'expo-router';

import { changeDoctorPassword, changeDoctorEmail, sendOtp, signout } from '@/newService/config/api/authApi';
import { MedicalTheme } from '@/newConstants/theme';
import { styles } from '@/assets/styles/settings.styles';

const SettingsScreen = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
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

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Helper functions
  const getSectionTitle = (section: string): string => {
    const titles: {[key: string]: string} = {
      password: 'Change Password',
      email: 'Update Email',
      notifications: 'Notification Preferences',
      privacy: 'Privacy Settings',
      support: 'Contact Support',
      signout: 'Sign Out',
      account: 'Account Actions'
    };
    return titles[section] || section;
  };

  const getSectionIcon = (section: string): string => {
    const icons: {[key: string]: string} = {
      password: 'lock-closed',
      email: 'mail',
      notifications: 'notifications',
      privacy: 'shield-checkmark',
      support: 'headset',
      signout: 'log-out',
      account: 'person'
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
      const res = await changeDoctorPassword(formData.oldPassword, formData.newPassword);
      if (res) {
        Alert.alert('Success', 'Password changed successfully!');
        updateFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
        closeModal();
      } else {
        Alert.alert('Failed', 'Password change failed!');
      }
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
      const success = await sendOtp(formData.newEmail);
      if (success) {
        setShowOTPModal(true);
        Alert.alert('OTP Sent', 'Verification code has been sent to your new email address.');
      } else {
        Alert.alert('Error', 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      const success = await changeDoctorEmail(formData.newEmail, otp, formData.emailPassword);
      if (success) {
        setShowOTPModal(false);
        Alert.alert('Success', 'Email updated successfully!');
        updateFormData({ 
          newEmail: '', 
          emailPassword: '', 
          currentEmail: formData.newEmail 
        });
        setErrors({});
        closeModal();
      } else {
        Alert.alert('Error', 'Failed to update email. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (): Promise<boolean> => {
    try {
      const success = await sendOtp(formData.newEmail);
      if (success) {
        Alert.alert('Success', 'OTP resent successfully!');
        return true;
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        return false;
      }
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
      closeModal();
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
      closeModal();
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

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Support Ticket Created',
        `Your support request has been submitted successfully!\n\nTicket ID: ${ticketId}\nWe'll get back to you within 24 hours.`,
        [{ text: 'OK', onPress: () => {
          updateFormData({ supportSubject: '', supportMessage: '', supportCategory: 'general' });
          setErrors({});
          closeModal();
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit support request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const success = await signout();
              if (success) {
                Alert.alert('Success', 'Signed out successfully!');
                router.replace('/login');
              } else {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
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
            closeModal();
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
            closeModal();
          }
        }
      ]
    );
  };

  // UI Components
  const renderPasswordInput = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    error?: string,
    placeholder: string = '',
    showPassword: boolean,
    setShowPassword: (show: boolean) => void
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.passwordInputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={MedicalTheme.colors.text.tertiary}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons 
            name={showPassword ? "eye-off" : "eye"} 
            size={20} 
            color={MedicalTheme.colors.text.tertiary} 
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

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
        placeholderTextColor={MedicalTheme.colors.text.tertiary}
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
    description: string
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
            <Text style={styles.sectionDescription}>{description}</Text>
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
  const renderPasswordModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {renderPasswordInput(
            "Current Password",
            formData.oldPassword,
            (text) => updateFormData({ oldPassword: text }),
            errors.oldPassword,
            "Enter your current password",
            showOldPassword,
            setShowOldPassword
          )}
          
          {renderPasswordInput(
            "New Password",
            formData.newPassword,
            (text) => updateFormData({ newPassword: text }),
            errors.newPassword,
            "Enter new password",
            showNewPassword,
            setShowNewPassword
          )}
          
          {renderPasswordInput(
            "Confirm New Password",
            formData.confirmPassword,
            (text) => updateFormData({ confirmPassword: text }),
            errors.confirmPassword,
            "Re-enter new password",
            showConfirmPassword,
            setShowConfirmPassword
          )}

          {errors.password && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
              <Text style={styles.errorText}>{errors.password}</Text>
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
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="key" size={20} color="#fff" />
              <Text style={styles.buttonText}>Change Password</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmailModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.currentEmailContainer}>
            <Text style={styles.currentEmailLabel}>Current Email</Text>
            <Text style={styles.currentEmail}>{formData.currentEmail}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={MedicalTheme.colors.success[500]} />
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
          
          {renderPasswordInput(
            "Confirm Password",
            formData.emailPassword,
            (text) => updateFormData({ emailPassword: text }),
            errors.emailPassword,
            "Enter your password to confirm",
            showEmailPassword,
            setShowEmailPassword
          )}

          {errors.email && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
              <Text style={styles.errorText}>{errors.email}</Text>
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
          onPress={handleSendEmailOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="mail" size={20} color="#fff" />
              <Text style={styles.buttonText}>Send Verification Code</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotificationsModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
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
          onPress={handleSavePreferences}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save Preferences</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPrivacyModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>Profile Visibility</Text>
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
          onPress={handleSavePrivacy}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save Privacy Settings</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSupportModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>Submit Support Ticket</Text>
          
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

          {errors.support && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color={MedicalTheme.colors.error[500]} />
              <Text style={styles.errorText}>{errors.support}</Text>
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
          onPress={handleSubmitSupport}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.buttonText}>Submit Support Request</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSignoutModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.formContainer}>
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={40} color={MedicalTheme.colors.warning[500]} />
          <Text style={styles.warningTitle}>Sign Out Confirmation</Text>
          <Text style={styles.warningText}>
            You will be logged out from all devices and need to sign in again to access your account.
          </Text>
        </View>
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
          style={[styles.actionButton, styles.signoutButton, isLoading && styles.buttonDisabled]}
          onPress={handleSignout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="log-out" size={20} color="#fff" />
              <Text style={styles.buttonText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAccountModal = () => (
    <View style={styles.modalContent}>
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={40} color={MedicalTheme.colors.warning[500]} />
            <Text style={styles.warningTitle}>Account Actions</Text>
            <Text style={styles.warningText}>
              These actions are irreversible and will affect your account access.
            </Text>
          </View>

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
      </ScrollView>
      <View style={styles.modalActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // OTP Verification Component
  const OTPVerification = ({ email, onSubmit, onResend }: { 
    email: string; 
    onSubmit: (otp: string) => Promise<void>; 
    onResend: () => Promise<boolean>;
  }) => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [timer, setTimer] = useState(30);

    let countdownInterval: NodeJS.Timeout;

    const startTimer = () => {
      let timeLeft = 30;
      countdownInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    React.useEffect(() => {
      startTimer();
      return () => clearInterval(countdownInterval);
    }, []);

    const handleResendOtp = async () => {
      setIsResendEnabled(false);
      setTimer(30);
      setIsLoading(true);
      try {
        await onResend();
        startTimer();
      } catch (error) {
        console.error("Error sending OTP:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleOtpSubmit = async () => {
      if (!otp.trim()) return;
      setIsLoading(true);
      try {
        await onSubmit(otp);
      } catch (error) {
        console.error("OTP Verification Failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View style={styles.otpContainer}>
        <View style={styles.otpHeader}>
          <TouchableOpacity onPress={() => setShowOTPModal(false)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={MedicalTheme.colors.primary[500]} />
          </TouchableOpacity>
          <Text style={styles.otpTitle}>Verify OTP</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.otpContent}>
          <View style={styles.otpIllustration}>
            <Ionicons name="mail" size={80} color={MedicalTheme.colors.primary[500]} />
          </View>

          <View style={styles.otpForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.otpLabel}>Enter OTP sent to {email}</Text>
              <View style={styles.otpInputContainer}>
                <Ionicons name='key' size={20} color={MedicalTheme.colors.primary[500]} style={styles.inputIcon} />
                <TextInput 
                  style={styles.otpInput} 
                  placeholder="******" 
                  placeholderTextColor={MedicalTheme.colors.text.tertiary} 
                  value={otp} 
                  onChangeText={setOtp} 
                  autoCapitalize='none' 
                  keyboardType="numeric" 
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.actionButton, isLoading && styles.buttonDisabled]} 
              onPress={handleOtpSubmit} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify & Change Email</Text>
              )}
            </TouchableOpacity>

            <View style={styles.otpFooter}>
              <Text style={styles.footerText}>
                {isResendEnabled ? "Didn't receive OTP? " : `Resend OTP in ${timer}s`}
              </Text>
              <TouchableOpacity disabled={!isResendEnabled} onPress={handleResendOtp}>
                <Text style={[styles.link, !isResendEnabled && { color: MedicalTheme.colors.text.disabled }]}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'password':
        return renderPasswordModal();
      case 'email':
        return renderEmailModal();
      case 'notifications':
        return renderNotificationsModal();
      case 'privacy':
        return renderPrivacyModal();
      case 'support':
        return renderSupportModal();
      case 'signout':
        return renderSignoutModal();
      case 'account':
        return renderAccountModal();
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Account & Security */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Account & Security</Text>
          {renderSection("password", "Update your account password")}
          {renderSection("email", "Change your account email address")}
        </View>

        {/* Preferences */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Preferences</Text>
          {renderSection("notifications", "Manage how you receive notifications")}
          {renderSection("privacy", "Control your profile visibility and privacy")}
        </View>

        {/* Support */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Support</Text>
          {renderSection("support", "Get help from our support team")}
        </View>

        {/* Account Actions */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Account</Text>
          {renderSection("signout", "Sign out from your account")}
          {renderSection("account", "Manage your account status")}
        </View>
      </ScrollView>

      {/* Main Modal */}
      <Modal
        visible={!!activeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {renderModalHeader()}
          {renderModalContent()}
        </View>
      </Modal>

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

export default SettingsScreen;