import { 
    View, 
    Text, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableOpacity, 
    ActivityIndicator 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import styles from '@/assets/styles/login.styles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';

interface OTPVerificationProps {
    email: string;
    onSubmit: (otp: string) => Promise<void>;
    onResend: () => Promise<boolean>;
}

const OTPVerification = ({email, onSubmit, onResend }: OTPVerificationProps) => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [timer, setTimer] = useState(30);

    let countdownInterval: NodeJS.Timeout;

    // Start OTP resend timer
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

    // Send OTP when screen loads
    useEffect(() => {
        handleResendOtp();
        return () => clearInterval(countdownInterval);
    }, []);

    // Resend OTP function
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

    // Handle OTP submission
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : "height"}>
                <View style={styles.container}>
                    <View style={styles.topIllustration}>
                        <Image source={require("@/assets/images/hp-signupOTP.svg")} style={styles.illustrationImage} contentFit='contain' />
                    </View>

                    <View style={styles.card}>
                        <View style={styles.formContainer}>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Enter OTP sent to {email}</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name='key' size={20} color={COLORS.primary} style={styles.inputIcon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="******" 
                                        placeholderTextColor={COLORS.placeholderText} 
                                        value={otp} 
                                        onChangeText={setOtp} 
                                        autoCapitalize='none' 
                                        keyboardType="numeric" 
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleOtpSubmit} disabled={isLoading}>
                                {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Verify</Text>}
                            </TouchableOpacity>

                            {/* Resend OTP */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    {isResendEnabled ? "Didn't receive OTP? " : `Resend OTP in ${timer}s`}
                                </Text>
                                <TouchableOpacity disabled={!isResendEnabled} onPress={handleResendOtp}>
                                    <Text style={[styles.link, !isResendEnabled && { color: '#ccc' }]}>Resend</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
};

export default OTPVerification;
