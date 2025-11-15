import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/newStore/rootReducer';
import { router } from 'expo-router';

import { changeDoctorPassword, changeDoctorEmail, sendOtp, signOutDoctor } from '@/newService/config/api/authApi';
import { MedicalTheme } from '@/newConstants/theme';
import { styles } from '@/assets/styles/settings.styles';
import AlertPopup from '@/newComponents/alertPopup';
import OTPVerificationPopup from '@/newComponents/OTPVerificationPopup';
import ScreenHeader from '@/newComponents/ScreenHeader';

const SettingsScreen = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title?: string;
    message: string;
    type?: 'alert' | 'confirmation';
    variant?: 'default' | 'success' | 'warning' | 'error';
    onConfirm?: () => void;
  }>({ visible: false, message: '' });
  
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

  // Alert functions
  const showAlert = (config: {
    title?: string;
    message: string;
    type?: 'alert' | 'confirmation';
    variant?: 'default' | 'success' | 'warning' | 'error';
    onConfirm?: () => void;
  }) => {
    setAlertConfig({ ...config, visible: true });
  };

  const hideAlert = (response?: boolean) => {
    if (response && alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    setAlertConfig({ ...alertConfig, visible: false });
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
        showAlert({
          title: 'Success',
          message: 'Password changed successfully!',
          variant: 'success'
        });
        updateFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
        closeModal();
      } else {
        showAlert({
          title: 'Failed',
          message: 'Password change failed!',
          variant: 'error'
        });
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to change password. Please try again.',
        variant: 'error'
      });
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
        showAlert({
          title: 'OTP Sent',
          message: 'Verification code has been sent to your new email address.',
          variant: 'success'
        });
      } else {
        showAlert({
          title: 'Error',
          message: 'Failed to send verification code. Please try again.',
          variant: 'error'
        });
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to send verification code. Please try again.',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await changeDoctorEmail(formData.newEmail, otp, formData.emailPassword);
      if (success) {
        setShowOTPModal(false);
        showAlert({
          title: 'Success',
          message: 'Email updated successfully!',
          variant: 'success'
        });
        updateFormData({ 
          newEmail: '', 
          emailPassword: '', 
          currentEmail: formData.newEmail 
        });
        setErrors({});
        closeModal();
        return true;
      } else {
        showAlert({
          title: 'Error',
          message: 'Failed to update email. Please try again.',
          variant: 'error'
        });
        return false;
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to update email. Please try again.',
        variant: 'error'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    try {
      const success = await sendOtp(formData.newEmail);
      if (success) {
        showAlert({
          title: 'Success',
          message: 'OTP resent successfully!',
          variant: 'success'
        });
      } else {
        showAlert({
          title: 'Error',
          message: 'Failed to resend OTP. Please try again.',
          variant: 'error'
        });
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to resend OTP. Please try again.',
        variant: 'error'
      });
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showAlert({
        title: 'Success',
        message: 'Preferences updated successfully!',
        variant: 'success'
      });
      closeModal();
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to update preferences.',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showAlert({
        title: 'Success',
        message: 'Privacy settings updated successfully!',
        variant: 'success'
      });
      closeModal();
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to update privacy settings.',
        variant: 'error'
      });
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
      
      showAlert({
        title: 'Support Ticket Created',
        message: `Your support request has been submitted successfully!\n\nTicket ID: ${ticketId}\nWe'll get back to you within 24 hours.`,
        variant: 'success',
        onConfirm: () => {
          updateFormData({ supportSubject: '', supportMessage: '', supportCategory: 'general' });
          setErrors({});
          closeModal();
        }
      });
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to submit support request. Please try again.',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      console.log("Direct signout started");
      await signOutDoctor();
      closeModal();
      router.replace('/(auth)');
    } catch (error) {
      console.error("Signout error:", error);
      showAlert({
        title: 'Error',
        message: 'Failed to sign out.',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = () => {
    showAlert({
      title: 'Deactivate Account',
      message: 'Are you sure you want to deactivate your account? This action can be reversed by contacting support.',
      type: 'confirmation',
      variant: 'warning',
      onConfirm: () => {
        showAlert({
          title: 'Account Deactivated',
          message: 'Your account has been deactivated successfully.',
          variant: 'success'
        });
        closeModal();
      }
    });
  };

  const handleDeleteAccount = () => {
    showAlert({
      title: 'Delete Account',
      message: 'This action cannot be undone. All your data will be permanently deleted.',
      type: 'confirmation',
      variant: 'error',
      onConfirm: () => {
        showAlert({
          title: 'Account Deleted',
          message: 'Your account has been permanently deleted.',
          variant: 'success'
        });
        closeModal();
      }
    });
  };

  // Navigation handlers
  const handleNavigateToReports = () => {
    router.push('/ReportScreen');
  };

  const handleNavigateToTerms = () => {
    // Placeholder for terms navigation
    showAlert({
      title: 'Terms & Conditions',
      message: 'Terms and conditions screen will be implemented soon.',
      variant: 'default'
    });
  };

  const handleNavigateToPrivacy = () => {
    // Placeholder for privacy navigation
    showAlert({
      title: 'Privacy Policy',
      message: 'Privacy policy screen will be implemented soon.',
      variant: 'default'
    });
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

  // Additional Links Section
  const renderAdditionalLinks = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>More</Text>
      
      <TouchableOpacity 
        style={styles.linkSection}
        onPress={handleNavigateToReports}
        activeOpacity={0.7}
      >
        <View style={styles.linkContent}>
          <View style={styles.linkIconContainer}>
            <Ionicons name="document-text" size={22} color={MedicalTheme.colors.primary[500]} />
          </View>
          <View style={styles.linkTextContainer}>
            <Text style={styles.linkTitle}>Medical Reports</Text>
            <Text style={styles.linkDescription}>Generate and download patient reports</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={MedicalTheme.colors.neutral[400]} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkSection}
        onPress={handleNavigateToTerms}
        activeOpacity={0.7}
      >
        <View style={styles.linkContent}>
          <View style={styles.linkIconContainer}>
            <Ionicons name="document" size={22} color={MedicalTheme.colors.primary[500]} />
          </View>
          <View style={styles.linkTextContainer}>
            <Text style={styles.linkTitle}>Terms & Conditions</Text>
            <Text style={styles.linkDescription}>Read our terms of service</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={MedicalTheme.colors.neutral[400]} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkSection}
        onPress={handleNavigateToPrivacy}
        activeOpacity={0.7}
      >
        <View style={styles.linkContent}>
          <View style={styles.linkIconContainer}>
            <Ionicons name="shield-checkmark" size={22} color={MedicalTheme.colors.primary[500]} />
          </View>
          <View style={styles.linkTextContainer}>
            <Text style={styles.linkTitle}>Privacy Policy</Text>
            <Text style={styles.linkDescription}>Learn about our privacy practices</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={MedicalTheme.colors.neutral[400]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <View style={styles.container}>
        <ScreenHeader
          title="Settings"
          showBack={true}
        />

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

        {/* Preferences 
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Preferences</Text>
          {renderSection("notifications", "Manage how you receive notifications")}
          {renderSection("privacy", "Control your profile visibility and privacy")}
        </View> */}

        {/* Support 
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Support</Text>
          {renderSection("support", "Get help from our support team")}
        </View>*/}

        {/* Account Actions */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Account</Text>
          {renderSection("signout", "Sign out from your account")}
          {/* {renderSection("account", "Manage your account status")} */}
        </View>

        {/* Additional Links */}
        {renderAdditionalLinks()}
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
      <OTPVerificationPopup
        visible={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerifySuccess={() => setShowOTPModal(false)}
        onVerifyOtp={handleVerifyOTP}
        email={formData.newEmail}
        resendOtp={handleResendOTP}
        title="Verify Your Email"
        subtitle="Enter the 6-digit code sent to"
        successMessage="Email Verified Successfully"
        errorMessage="Invalid Verification Code"
      />

      {/* Custom Alert Popup */}
      <AlertPopup
        visible={alertConfig.visible}
        onClose={hideAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        variant={alertConfig.variant}
        confirmText="OK"
        cancelText="Cancel"
      />
      </View>
    </>
  );
};

export default SettingsScreen;