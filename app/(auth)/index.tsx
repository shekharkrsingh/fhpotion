// app/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Link, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { styles } from '@/assets/styles/login.style';
import { MedicalTheme } from '@/newConstants/theme';
import { login } from '@/service/properties/authApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email address',
      });
      return false;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password Required',
        text2: 'Please enter your password',
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

    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = await login(email, password);

      if (token) {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
        
        setTimeout(() => {
          router.replace('/splashScreen');
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    Toast.show({
      type: 'info',
      text1: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login`,
      text2: 'This feature will be available soon!',
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100} // Adjusted for better handling
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Top Illustration Section */}
            <View style={styles.topIllustration}>
              <Image
                source={require('@/assets/images/hp-frontImage.svg')}
                style={styles.illustrationImage}
                contentFit="contain"
                priority="high"
              />
            </View>

            {/* Login Form Card */}
            <View style={styles.card}>
              <View style={styles.formContainer}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
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
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      editable={!isLoading}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={MedicalTheme.colors.primary[500]}
                      style={styles.inputIcon}
                    />
                    <RNTextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={MedicalTheme.colors.text.tertiary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoComplete="password"
                      editable={!isLoading}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      disabled={isLoading}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={MedicalTheme.colors.primary[500]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    isLoading && styles.buttonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  {isLoading ? (
                    <ActivityIndicator 
                      color={MedicalTheme.colors.text.inverse} 
                      size="small" 
                    />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>

                {/* Forgot Password */}
                <View style={styles.extraContaint}>
                  <Link href="/forgot" asChild>
                    <TouchableOpacity disabled={isLoading}>
                      <Text style={styles.link}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </Link>
                </View>

                {/* Social Login Divider */}
                <View style={styles.extraContaint}>
                  <Text style={styles.orText}>OR CONTINUE WITH</Text>
                  
                  {/* Social Login Buttons */}
                  <View style={styles.socialButtonsRow}>
                    {/* Google Login */}
                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      activeOpacity={0.7}
                    >
                      <Image 
                        style={styles.socialLogo} 
                        source={require('@/assets/images/google_icon.png')} 
                      />
                    </TouchableOpacity>
                    
                    {/* Apple Login */}
                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('apple')}
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

                {/* Sign Up Link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account?</Text>
                  <Link href="/signup" asChild>
                    <TouchableOpacity disabled={isLoading}>
                      <Text style={styles.link}>Sign Up</Text>
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
                      <Text style={styles.link}>T&C</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* Toast Component */}
        <Toast />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}