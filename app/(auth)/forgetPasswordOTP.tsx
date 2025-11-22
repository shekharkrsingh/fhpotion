import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/newStore/rootReducer';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

import OTPVerificationPopup from '@/newComponents/OTPVerificationPopup';
import { sendOtp, forgotPassword } from '@/newService/config/api/authApi';
import logger from '@/utils/logger';

export default function ForgetPasswordOTP() {
    const { email, newPassword } = useSelector((state: RootState) => state.forgetPassword);
    const [isOTPVisible, setIsOTPVisible] = useState(true);
    const dispatch = useDispatch();

    if (!email) {
        Alert.alert("Error", "Required data is missing!");
        return null;
    }

    const handleVerifyOtp = async (otp: string): Promise<boolean> => {
        try {
            const response = await forgotPassword(email, newPassword, otp);
            if (response) {
                Toast.show({
                    type: 'success',
                    text1: 'Password Reset Successful',
                    text2: 'Your password has been reset successfully!',
                    position: 'bottom'
                });
                return true;
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Password Reset Failed',
                    text2: 'Please check the OTP and try again.',
                    position: 'bottom'
                });
                return false;
            }
        } catch (error) {
            logger.error("Password reset error:", error);
            Toast.show({
                type: 'error',
                text1: 'Password Reset Failed',
                text2: 'An error occurred. Please try again.',
                position: 'bottom'
            });
            return false;
        }
    };

    const handleVerifySuccess = () => {
        // Success toast is already shown in handleVerifyOtp
        setTimeout(() => {
            router.replace("/(auth)");
        }, 1500);
    };

    const handleResendOtp = async (): Promise<void> => {
        try {
            const success = await sendOtp(email);
            if (success) {
                Toast.show({
                    type: 'success',
                    text1: 'OTP Resent',
                    text2: 'New verification code sent to your email.',
                    position: 'bottom'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Resend Failed',
                    text2: 'Failed to send OTP. Please try again.',
                    position: 'bottom'
                });
                throw new Error('Failed to resend OTP');
            }
        } catch (error) {
            logger.error("Resend OTP error:", error);
            Toast.show({
                type: 'error',
                text1: 'Resend Failed',
                text2: 'Failed to send OTP. Please try again.',
                position: 'bottom'
            });
            throw error;
        }
    };

    const handleClose = () => {
        Alert.alert(
            "Cancel Verification",
            "Are you sure you want to cancel the password reset process?",
            [
                {
                    text: "Continue",
                    style: "cancel"
                },
                {
                    text: "Cancel",
                    style: "destructive",
                    onPress: () => {
                        Toast.show({
                            type: 'info',
                            text1: 'Process Cancelled',
                            text2: 'Password reset process cancelled.',
                            position: 'bottom'
                        });
                        setIsOTPVisible(false);
                        setTimeout(() => {
                            router.back();
                        }, 1000);
                    }
                }
            ]
        );
    };

    return (
        <>
            <OTPVerificationPopup
                visible={isOTPVisible}
                onClose={handleClose}
                onVerifySuccess={handleVerifySuccess}
                onVerifyOtp={handleVerifyOtp}
                email={email}
                title="Reset Your Password"
                subtitle="Enter the 6-digit code sent to"
                successMessage="Password Reset Successful"
                errorMessage="Password Reset Failed"
                resendOtp={handleResendOtp}
            />
            <Toast />
        </>
    );
}