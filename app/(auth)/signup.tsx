// app/(auth)/signup.tsx
import React, { useState } from 'react';
import {
    View,
    Platform,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TextInput as RNTextInput,
    Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Link, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

import { styles } from '@/assets/styles/signup.style';
import { MedicalTheme } from '@/newConstants/theme';
import { setSignupData } from '@/newStore/slices/signupSlice';
import { AppDispatch } from '@/newStore';

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

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

    const handleSubmit = async () => {
        if (!firstName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'First Name Required',
                text2: 'Please enter your first name',
            });
            return;
        }

        if (!lastName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Last Name Required',
                text2: 'Please enter your last name',
            });
            return;
        }

        setIsLoading(true);
        
        try {
            // Save data in Redux store
            dispatch(setSignupData({ firstName, lastName }));

            Toast.show({
                type: 'success',
                text1: 'Profile Saved',
                text2: 'Proceeding to next step',
            });

            // Navigate to the next screen (email & password)
            setTimeout(() => {
                router.push("/(auth)/signupDetails");
            }, 1000);

        } catch (error) {
            console.error("Signup Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Signup Failed',
                text2: 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignup = (provider: 'google' | 'apple') => {
        Toast.show({
            type: 'info',
            text1: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Signup`,
            text2: 'This feature will be available soon!',
        });
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
                                source={require("@/assets/images/hp-signupFrontImage.svg")}
                                style={styles.illustrationImage}
                                contentFit='contain'
                                priority="high"
                            />
                        </View>
                        <View style={styles.card}>
                            <View style={styles.formContainer}>
                                {/* Header */}
                                {/* <View style={styles.header}> */}
                                    <Text style={styles.title}>Create Profile</Text>
                                    {/* <Text style={styles.subtitle}>
                                        Let's start with your basic information
                                    </Text> */}
                                {/* </View> */}

                                {/* First Name Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>First Name</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name='person-outline'
                                            size={20}
                                            color={MedicalTheme.colors.primary[500]}
                                            style={styles.inputIcon}
                                        />
                                        <RNTextInput
                                            style={styles.input}
                                            placeholder="Enter your first name"
                                            placeholderTextColor={MedicalTheme.colors.text.tertiary}
                                            value={firstName}
                                            onChangeText={setFirstName}
                                            autoCapitalize='words'
                                            autoComplete="name-given"
                                            editable={!isLoading}
                                            returnKeyType="next"
                                        />
                                    </View>
                                </View>

                                {/* Last Name Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name='person-outline'
                                            size={20}
                                            color={MedicalTheme.colors.primary[500]}
                                            style={styles.inputIcon}
                                        />
                                        <RNTextInput
                                            style={styles.input}
                                            placeholder="Enter your last name"
                                            placeholderTextColor={MedicalTheme.colors.text.tertiary}
                                            value={lastName}
                                            onChangeText={setLastName}
                                            autoCapitalize='words'
                                            autoComplete="name-family"
                                            editable={!isLoading}
                                            returnKeyType="done"
                                            onSubmitEditing={handleSubmit}
                                        />
                                    </View>
                                </View>

                                {/* Next Button */}
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

                                {/* Social Signup Divider */}
                                <View style={styles.extraContaint}>
                                    <Text style={styles.orText}>OR CONTINUE WITH</Text>
                                    <View style={styles.socialButtonsRow}>
                                        {/* Google Signup Button */}
                                        <TouchableOpacity 
                                            style={styles.socialButton}
                                            onPress={() => handleSocialSignup('google')}
                                            disabled={isLoading}
                                            activeOpacity={0.7}
                                        >
                                            <Image
                                                style={styles.socialLogo}
                                                source={require('@/assets/images/google_icon.png')}
                                            />
                                        </TouchableOpacity>
                                        {/* Apple Signup Button */}
                                        <TouchableOpacity 
                                            style={styles.socialButton}
                                            onPress={() => handleSocialSignup('apple')}
                                            disabled={isLoading}
                                            activeOpacity={0.7}
                                        >
                                            <Image
                                                style={styles.socialLogo}
                                                source={require('@/assets/images/apple-logo.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
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

                {/* Toast Component */}
                <Toast />
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}