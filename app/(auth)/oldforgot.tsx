import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import React, { useState } from 'react';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import styles from '@/assets/styles/login.styles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { Link, router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setForgetPasswordData} from '@/redux/slices/forgetPasswordSlice';

export default function Forget() {
    const [email, setEmailState] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email & new password.");
            return;
        }

        setIsLoading(true);
        try {
            // Dispatch email to Redux store
            dispatch(setForgetPasswordData({email, newPassword}));

            // Simulate API call (Replace this with actual API request)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Navigate to OTP verification screen
            router.push("/(auth)/forgetPasswordOTP");
        } catch (error) {
            Alert.alert("Error", "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
            >
                <View style={styles.container}>
                    <View style={styles.topIllustration}>
                        <Image
                            source={require("@/assets/images/hp-forgetPassword.svg")}
                            style={styles.illustrationImage}
                            contentFit="contain"
                        />
                    </View>

                    <View style={styles.card}>
                        <View style={styles.formContainer}>
                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={email}
                                        onChangeText={setEmailState}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            {/* Password Input (Not Required for OTP Screen) */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>New Password</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your New password"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                                            size={20}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.buttonText}>Submit</Text>
                                )}
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View style={styles.extraContaint}>
                                <Link href="/(auth)" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link}>Login</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>

                            {/* Terms & Conditions */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>By continuing, you agree with our</Text>
                                <Link href="/terms" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link}>T&C</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
