// app/(auth)/signupDetails.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
  Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Link, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { styles } from '@/assets/styles/signupDetails.styles';
import { MedicalTheme } from '@/newConstants/theme';
import OTPModal from '@/newComponents/OTPVerificationPopup';
import { sendOtp } from '@/newService/config/api/authApi';
import { signupDoctor } from '@/newService/config/api/authApi';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/newStore';
import { useDispatch } from 'react-redux';

export default function SignupDetails() {
  const dispatch=useDispatch<AppDispatch>();
  const signupData = useSelector((state: RootState) => state.signup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email address',
      });
      return false;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password Required',
        text2: 'Please enter your password',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
      return false;
    }

    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 8 characters long',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to send OTP
      const otpSent = await sendOtp(email);
      
      if (otpSent) {
        
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Verification code sent to your email',
        });

        // Show OTP modal
        setShowOTPModal(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send OTP',
          text2: 'Please try again later',
        });
      }

    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string): Promise<boolean> => {
    try {
      // Replace with your actual OTP verification API
      console.log(signupData.firstName, signupData, email, password, otp)
      return await signupDoctor(signupData.firstName, signupData.lastName, email, password, otp);
    } catch (error) {
      console.error('Verify OTP error:', error);
      return false;
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    try {
      const otpSent = await sendOtp(email);
      if (otpSent) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Verification code sent to your email',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send OTP',
          text2: 'Please try again later',
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to send OTP',
        text2: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleOTPVerifySuccess = () => {
    Toast.show({
      type: 'success',
      text1: 'Account Created',
      text2: 'Your account has been created successfully!',
    });

    // Navigate to main app after successful verification
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleCloseOtpModal = () => {
    setShowOTPModal(false);
  };

  const getPasswordStrength = (): string => {
    if (password.length === 0) return '';
    if (password.length < 4) return 'Weak';
    if (password.length < 8) return 'Fair';
    return 'Strong';
  };

  const getPasswordStrengthColor = (): string => {
    const strength = getPasswordStrength();
    switch (strength) {
      case 'Weak': return MedicalTheme.colors.error[500];
      case 'Fair': return MedicalTheme.colors.warning[500];
      case 'Strong': return MedicalTheme.colors.success[500];
      default: return MedicalTheme.colors.text.tertiary;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Top Illustration Section */}
            <View style={styles.topIllustration}>
              <Image
                source={require('@/assets/images/hp-signupSecureImage.svg')}
                style={styles.illustrationImage}
                contentFit="contain"
                priority="high"
              />
            </View>

            {/* Signup Form Card */}
            <View style={styles.card}>
              <View style={styles.formContainer}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Credential</Text>
                </View>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={MedicalTheme.colors.primary[500]}
                      style={styles.inputIcon}
                    />
                    <RNTextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={MedicalTheme.colors.text.tertiary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!isLoading}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.label}>Password</Text>
                    {password.length > 0 && (
                      <Text style={[styles.requirementText, { color: getPasswordStrengthColor() }]}>
                        {getPasswordStrength()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={MedicalTheme.colors.primary[500]}
                      style={styles.inputIcon}
                    />
                    <RNTextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor={MedicalTheme.colors.text.tertiary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password-new"
                      editable={!isLoading}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      disabled={isLoading}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={MedicalTheme.colors.primary[500]}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Password Requirements */}
                  <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementText}>
                      • At least 8 characters long
                    </Text>
                    <Text style={styles.requirementText}>
                      • Use letters, numbers, and symbols
                    </Text>
                  </View>
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    isLoading && styles.buttonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  {isLoading ? (
                    <ActivityIndicator 
                      color={MedicalTheme.colors.text.inverse} 
                      size="small" 
                    />
                  ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Footer Section - Conditionally rendered based on keyboard visibility */}
              {!isKeyboardVisible && (
                <View style={styles.footerContainer}>
                  {/* Login Link */}
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Link href="/(auth)" asChild>
                      <TouchableOpacity disabled={isLoading}>
                        <Text style={styles.link}>Sign In</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>

                  {/* Terms & Conditions */}
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>
                      By continuing, you agree with our{' '}
                    </Text>
                    <Link href="/terms" asChild>
                      <TouchableOpacity disabled={isLoading}>
                        <Text style={styles.link}>Terms & Conditions</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        
        {/* OTP Modal */}
        <OTPModal
          visible={showOTPModal}
          onClose={handleCloseOtpModal}
          onVerifySuccess={handleOTPVerifySuccess}
          onVerifyOtp={handleVerifyOtp}
          email={email}
          title="Verify Your Email"
          subtitle="Enter the 6-digit code sent to"
          successMessage="Account Verified"
          errorMessage="Invalid Verification Code"
          resendOtp={handleResendOtp}
        />
        
        {/* Toast Component */}
        <Toast />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}