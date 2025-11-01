// components/OTPModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput as RNTextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { styles } from './OTPVerificationPopup.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onVerifySuccess: (data?: any) => void;
  onVerifyOtp: (otp: string, data?: any) => Promise<boolean>;
  email?: string;
  verificationData?: any; // Additional data to pass to verification function
  title?: string;
  subtitle?: string;
  successMessage?: string;
  errorMessage?: string;
  resendOtp?: () => Promise<void>; // Optional resend OTP function
}

export default function OTPModal({ 
  visible, 
  onClose, 
  onVerifySuccess, 
  onVerifyOtp,
  email, 
  verificationData,
  title = "Verify Your Email",
  subtitle = "Enter the 6-digit code sent to",
  successMessage = "Verification Successful",
  errorMessage = "Verification Failed",
  resendOtp 
}: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<RNTextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible && timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend, visible]);

  // Reset OTP when modal opens
  useEffect(() => {
    if (visible) {
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      setCanResend(false);
      // Focus first input after a small delay
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [visible]);

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input
      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      if (newOtp.every(digit => digit !== '') && index === 5) {
        handleVerifyOtp();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter the complete 6-digit code',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the provided verification function
      const isVerified = await onVerifyOtp(otpString, verificationData);
      
      if (isVerified) {
        Toast.show({
          type: 'success',
          text1: successMessage,
          text2: 'Your account has been created!',
        });

        setTimeout(() => {
          onVerifySuccess(verificationData);
          onClose();
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: errorMessage,
          text2: 'Invalid verification code. Please try again.',
        });
        
        // Clear OTP on failure for security
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: 'An unexpected error occurred. Please try again.',
      });
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      if (resendOtp) {
        await resendOtp();
      }
      
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      
      Toast.show({
        type: 'info',
        text1: 'Code Resent',
        text2: 'A new verification code has been sent to your email',
      });

      // Focus first input after resend
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error('Resend OTP error:', error);
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: 'Failed to resend verification code. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isVerifyDisabled = isLoading || otp.some(digit => digit === '');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
              disabled={isLoading}
            >
              <Ionicons 
                name="close" 
                size={24} 
                color={
                  isLoading 
                    ? MedicalTheme.colors.text.disabled 
                    : MedicalTheme.colors.text.primary
                } 
              />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.closeButtonPlaceholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.illustrationContainer}>
              <Ionicons 
                name="mail-open-outline" 
                size={80} 
                color={MedicalTheme.colors.primary[500]} 
              />
            </View>

            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
            <Text style={styles.emailText}>
              {email || 'your email address'}
            </Text>

            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <RNTextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    isLoading && styles.inputDisabled
                  ]}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!isLoading}
                  selectTextOnFocus
                  accessible={true}
                  accessibilityLabel={`OTP digit ${index + 1}`}
                  accessibilityHint={`Enter the ${index + 1} digit of your verification code`}
                />
              ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.button,
                (isVerifyDisabled || isLoading) && styles.buttonDisabled
              ]}
              onPress={handleVerifyOtp}
              disabled={isVerifyDisabled || isLoading}
              activeOpacity={0.9}
              accessible={true}
              accessibilityLabel="Verify OTP"
              accessibilityHint="Verify the 6-digit code sent to your email"
              accessibilityState={{ disabled: isVerifyDisabled || isLoading }}
            >
              {isLoading ? (
                <ActivityIndicator 
                  color={MedicalTheme.colors.text.inverse} 
                  size="small" 
                />
              ) : (
                <Text style={styles.buttonText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?{' '}
              </Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={!canResend || isLoading || isResending}
                accessible={true}
                accessibilityLabel="Resend verification code"
                accessibilityHint={
                  canResend 
                    ? "Resend the verification code to your email" 
                    : `Resend available in ${formatTime(timer)}`
                }
                accessibilityState={{ disabled: !canResend || isLoading || isResending }}
              >
                <Text style={[
                  styles.resendLink,
                  (!canResend || isLoading || isResending) && styles.resendLinkDisabled
                ]}>
                  {isResending ? 'Resending...' : 
                   canResend ? 'Resend Code' : `Resend in ${formatTime(timer)}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Having trouble receiving the code?{' '}
            </Text>
            <TouchableOpacity disabled={isLoading}>
              <Text style={[
                styles.link,
                isLoading && styles.resendLinkDisabled
              ]}>
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}