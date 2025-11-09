// app/(auth)/forget.tsx
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TextInput as RNTextInput,
    Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { styles } from '@/assets/styles/forget.styles';
import { MedicalTheme } from '@/newConstants/theme';
import OTPModal from '@/newComponents/OTPVerificationPopup';
import { sendOtp } from '@/newService/config/api/authApi';
import { forgotPassword } from '@/newService/config/api/authApi';

export default function Forget() {
    const [email, setEmailState] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    
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

        if (!newPassword.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Password Required',
                text2: 'Please enter your new password',
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

        if (newPassword.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must be at least 8 characters long',
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const otpSent = await sendOtp(email);
            
            if (otpSent) {
                setShowOtpModal(true);
                
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
            console.error('Forget password error:', error);
            Toast.show({
                type: 'error',
                text1: 'Request Failed',
                text2: 'Failed to process request. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otp: string): Promise<boolean> => {
        try {
            return await forgotPassword(email, newPassword, otp);
        } catch (error) {
            console.error('Verify OTP error:', error);
            return false;
        }
    };

    const handleResendOtp = async (): Promise<void> => {
        await sendOtp(email);
    };

    const handleVerifySuccess = () => {
        Toast.show({
            type: 'success',
            text1: 'Password Reset Successful',
            text2: 'Your password has been reset successfully!',
        });

        setTimeout(() => {
            router.push("/(auth)");
        }, 1500);
    };

    const handleCloseOtpModal = () => {
        setShowOtpModal(false);
    };

    const getPasswordStrength = (): string => {
        if (newPassword.length === 0) return '';
        if (newPassword.length < 4) return 'Weak';
        if (newPassword.length < 8) return 'Fair';
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
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.topIllustration}>
                            <Image
                                source={require("@/assets/images/hp-forgetPassword.svg")}
                                style={styles.illustrationImage}
                                contentFit="contain"
                                priority="high"
                            />
                        </View>

                        <View style={styles.card}>
                            <View style={styles.formContainer}>
                                <View style={styles.header}>
                                    <Text style={styles.title}>Reset Password</Text>
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
                                            onChangeText={setEmailState}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            autoComplete="email"
                                            editable={!isLoading}
                                            returnKeyType="next"
                                        />
                                    </View>
                                </View>

                                {/* New Password Input */}
                                <View style={styles.inputGroup}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={styles.label}>New Password</Text>
                                        {newPassword.length > 0 && (
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
                                            placeholder="Enter your new password"
                                            placeholderTextColor={MedicalTheme.colors.text.tertiary}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
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
                                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color={MedicalTheme.colors.primary[500]}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View style={styles.passwordRequirements}>
                                        <Text style={styles.requirementText}>
                                            • At least 8 characters long
                                        </Text>
                                        <Text style={styles.requirementText}>
                                            • Use letters, numbers, and symbols
                                        </Text>
                                    </View>
                                </View>

                                {/* Submit Button */}
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
                                        <Text style={styles.buttonText}>Send Verification Code</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {!isKeyboardVisible && (
                                <View style={styles.footerContainer}>
                                    <View style={styles.footer}>
                                        <Text style={styles.footerText}>Remember your password?</Text>
                                        <Link href="/(auth)" asChild>
                                            <TouchableOpacity disabled={isLoading}>
                                                <Text style={styles.link}>Sign In</Text>
                                            </TouchableOpacity>
                                        </Link>
                                    </View>

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

                {/* OTP Verification Modal */}
                <OTPModal
                    visible={showOtpModal}
                    onClose={handleCloseOtpModal}
                    onVerifySuccess={handleVerifySuccess}
                    onVerifyOtp={handleVerifyOtp}
                    email={email}
                    title="Verify Your Email"
                    subtitle="Enter the 6-digit code sent to"
                    successMessage="Password Reset Successful"
                    errorMessage="Invalid Verification Code"
                    resendOtp={handleResendOtp}
                />

                <Toast />
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}