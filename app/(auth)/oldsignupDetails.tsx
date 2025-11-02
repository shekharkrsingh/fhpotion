import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native'
import styles from '@/assets/styles/login.styles'
import { useState } from 'react'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { TextInput } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Link, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setSignupData } from '@/redux/slices/signupSlice';

export default function SignupDetails() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = () => {
        if (!email.trim() || !password.trim()) {
            alert("Email and password are required!");
            return;
        }

        dispatch(setSignupData({ email, password }));
        router.push("/(auth)/signupVerification"); 
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? "padding" : "height"}>
                <View style={styles.container}>
                    <View style={styles.topIllustration}>
                        <Image
                            source={require("@/assets/images/hp-signupSecureImage.svg")}
                            style={styles.illustrationImage}
                            contentFit='contain'
                        />
                    </View>

                    <View style={styles.card}>
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name='mail-outline'
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize='none'
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name='lock-closed-outline'
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}>
                                        <Ionicons
                                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                                            size={20}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit}
                                disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.buttonText}>Next</Text>
                                )}
                            </TouchableOpacity>

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
                                <Text style={styles.footerText}>By continuing, you agree with our </Text>
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
