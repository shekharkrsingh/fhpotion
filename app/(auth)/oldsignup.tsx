import {
    View,
    Platform,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import styles from '@/assets/styles/login.styles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSignupData } from '@/redux/slices/signupSlice';

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            alert("Please enter both First Name and Last Name.");
            return;
        }

        setIsLoading(true);
        
        try {
            // Save data in Redux store
            dispatch(setSignupData({ firstName, lastName }));

            // Navigate to the next screen (email & password)
            router.push("/(auth)/signupDetails"); 
        } catch (error) {
            console.error("Signup Error:", error);
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
                            source={require("@/assets/images/hp-signupFrontImage.svg")}
                            style={styles.illustrationImage}
                            contentFit='contain'
                        />
                    </View>
                    <View style={styles.card}>
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>First Name</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name='text'
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="First Name"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        autoCapitalize='words'
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Last Name</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name='text'
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Last Name"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={lastName}
                                        onChangeText={setLastName}
                                        autoCapitalize='words'
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.buttonText}>Next</Text>
                                )}
                            </TouchableOpacity>

                            {/* Social Signup */}
                            <View style={styles.extraContaint}>
                                <Text style={styles.orText}>OR</Text>
                                <View style={styles.socialButtonsRow}>
                                    {/* Google Login Button */}
                                    <TouchableOpacity style={styles.socialButton}>
                                        <Image
                                            style={styles.socialLogo}
                                            source={require('@/assets/images/google_icon.png')}
                                        />
                                    </TouchableOpacity>
                                    {/* Apple Login Button */}
                                    <TouchableOpacity style={styles.socialButton}>
                                        <Image
                                            style={styles.socialLogo}
                                            source={require('@/assets/images/apple-logo.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Login */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account?</Text>
                                <Link href="/(auth)" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link}>Login</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>

                            {/* T&C */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    By continuing, you agree with our
                                </Text>
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text style={styles.link}>T&C</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
