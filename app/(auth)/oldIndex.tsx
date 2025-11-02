import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import styles from '@/assets/styles/login.styles';
import { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { TextInput } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Link, router, useNavigation, useRouter } from 'expo-router';
import { login } from '@/service/properties/authApi';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router=useRouter();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Email and password are required.");
            return;
        }

        setIsLoading(true);
        const token = await login(email, password);
        setIsLoading(false);

        if (token) {
            console.log("Login Successful! Token saved.");
            console.log(token);
            router.replace("/splashScreen"); // Navigate to home screen
        } else {
            Alert.alert("Login Failed", "Invalid credentials. Please try again.");
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? "padding" : "height"}>
                <View style={styles.container}>
                    <View style={styles.topIllustration}>
                        <Image
                            source={require("@/assets/images/hp-frontImage.svg")}
                            style={styles.illustrationImage}
                            contentFit='contain'/>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name='mail-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize='none'
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name='lock-closed-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
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
                                onPress={handleLogin}
                                disabled={isLoading}>
                                {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Login</Text>}
                            </TouchableOpacity>

                            {/* Forget Password */}
                            <View style={styles.extraContaint}>
                                <Link href="/forgot" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>

                            {/* Social Login */}
                            <View style={styles.extraContaint}>
                                <Text style={styles.orText}>OR</Text>
                                <View style={styles.socialButtonsRow}>
                                    {/* Google Login Button */}
                                    <TouchableOpacity style={styles.socialButton}>
                                        <Image style={styles.socialLogo} source={require('@/assets/images/google_icon.png')} />
                                    </TouchableOpacity>
                                    {/* Apple Login Button */}
                                    <TouchableOpacity style={styles.socialButton}>
                                        <Image style={styles.socialLogo} source={require('@/assets/images/apple-logo.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Signup */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account?</Text>
                                <Link href="/signup" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.link}>Sign Up</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>

                            {/* Terms & Conditions */}
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
