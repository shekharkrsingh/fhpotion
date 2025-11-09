// components/OTPVerificationPopup.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';

import { styles } from '@/assets/styles/OTPVerificationPopup.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
  onVerifyOtp: (otp: string) => Promise<boolean>;
  email?: string;
  title?: string;
  subtitle?: string;
  successMessage?: string;
  errorMessage?: string;
  resendOtp?: () => Promise<void>;
}

const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onVerifySuccess,
  onVerifyOtp,
  email,
  title = "Verify Your Email",
  subtitle = "Enter the 6-digit code sent to",
  successMessage = "Verification Successful",
  errorMessage = "Verification Failed",
  resendOtp
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (visible && timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, canResend, visible]);

  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      resetAll();
    }
  }, [visible]);

  const resetAll = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    setIsLoading(false);
    setIsResending(false);
    
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 400);
  };

  const handleOtpChange = (text: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    
    if (text.length === 1) {
      // Single digit input
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Move to next input if available
      if (index < 5) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 10);
      }
      
      // Auto submit when all fields filled
      if (index === 5 && newOtp.every(digit => digit !== '')) {
        handleVerifyOtp();
      }
    } else if (text.length === 0) {
      // Backspace pressed
      newOtp[index] = '';
      setOtp(newOtp);
      
      // Move to previous input if current is empty
      if (index > 0) {
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 10);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 10);
    }
  };

  const resetInputs = () => {
    setOtp(['', '', '', '', '', '']);
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter all 6 digits',
      });
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const isVerified = await onVerifyOtp(otpString);
      
      if (isVerified) {
        Toast.show({
          type: 'success',
          text1: successMessage,
          text2: 'Verification completed successfully!',
        });

        setTimeout(() => {
          onVerifySuccess();
          onClose();
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: errorMessage,
          text2: 'Invalid code. Please try again.',
        });
        resetInputs();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: 'Please try again.',
      });
      resetInputs();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading || isResending) return;

    setIsResending(true);

    try {
      if (resendOtp) {
        await resendOtp();
      }
      
      setTimer(60);
      setCanResend(false);
      resetInputs();
      
      Toast.show({
        type: 'info',
        text1: 'Code Resent',
        text2: 'New verification code sent',
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: 'Please try again.',
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
      statusBarTranslucent={false}
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
                color={MedicalTheme.colors.text.primary} 
              />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.closeButtonPlaceholder} />
          </View>

          <View style={styles.content}>
            {/* Top Illustration Section */}
            <View style={styles.topIllustration}>
              <Image
                source={require('@/assets/images/hp-signupOTP.svg')}
                style={styles.illustrationImage}
                contentFit="contain"
                priority="high"
              />
            </View>

            {/* Card Section */}
            <View style={styles.card}>
              <View style={styles.formContainer}>
                <Text style={styles.subtitle}>
                  {subtitle}
                </Text>
                <Text style={styles.emailText}>
                  {email || 'your email address'}
                </Text>

                {/* OTP Input Fields */}
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => {
                        inputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        digit !== '' && styles.otpInputFilled,
                        isLoading && styles.inputDisabled
                      ]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      editable={!isLoading}
                      selectTextOnFocus
                      textAlign="center"
                      caretHidden={false}
                      // Web compatibility
                      {...(process.env.EXPO_OS === 'web' && {
                        type: 'tel',
                        pattern: '[0-9]*',
                        inputMode: 'numeric',
                      })}
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
                  activeOpacity={0.8}
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
                  <Text style={styles.link}>
                    Contact Support
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default OTPModal;