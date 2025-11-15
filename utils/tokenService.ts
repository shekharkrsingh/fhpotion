// utils/tokenService.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const TOKEN_KEY = 'auth_token';

// Check if SecureStore is available (not available on web)
const isSecureStoreAvailable = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      return false;
    }
    return await SecureStore.isAvailableAsync();
  } catch (error) {
    console.warn('SecureStore availability check failed, falling back to AsyncStorage:', error);
    return false;
  }
};

/**
 * Decodes base64 string to UTF-8 string (cross-platform)
 * Works on web (atob) and React Native
 */
const decodeBase64 = (base64: string): string => {
  try {
    // For web platform
    if (typeof atob !== 'undefined') {
      return atob(base64);
    }
    
    // For React Native - use Buffer if available
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    }
    
    // Fallback: manual base64 decoding
    // This is a simple implementation for React Native
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    base64 = base64.replace(/[^A-Za-z0-9+/]/g, '');
    
    while (i < base64.length) {
      const encoded1 = chars.indexOf(base64.charAt(i++));
      const encoded2 = chars.indexOf(base64.charAt(i++));
      const encoded3 = chars.indexOf(base64.charAt(i++));
      const encoded4 = chars.indexOf(base64.charAt(i++));
      
      const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
      
      result += String.fromCharCode((bitmap >> 16) & 255);
      if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
      if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
    }
    
    return result;
  } catch (error) {
    console.error('Error decoding base64:', error);
    throw error;
  }
};

/**
 * Decodes JWT token and extracts payload without verification
 * JWT format: header.payload.signature (base64 encoded)
 */
const decodeJWTPayload = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    // Decode base64 (cross-platform)
    const decodedPayload = decodeBase64(paddedBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT payload:', error);
    return null;
  }
};

/**
 * Checks if JWT token is expired
 * @param token JWT token string
 * @returns true if token is expired or invalid, false if valid and not expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWTPayload(token);
    if (!payload || !payload.exp) {
      // If no exp claim, consider it expired for safety
      return true;
    }

    // exp is in seconds since epoch, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    // Add 5 minute buffer (300000 ms) to account for clock skew and token expiration during request
    const bufferTime = 300000; // 5 minutes
    
    return currentTime >= (expirationTime - bufferTime);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Treat errors as expired for safety
  }
};

/**
 * Gets token from secure storage
 * @returns Token string or null if not found/expired
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    let token: string | null = null;

    if (useSecureStore) {
      token = await SecureStore.getItemAsync(TOKEN_KEY);
    } else {
      // Fallback to AsyncStorage for web or when SecureStore is unavailable
      token = await AsyncStorage.getItem(TOKEN_KEY);
    }
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.warn('Token expired, removing from storage');
      await removeToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null;
  }
};

/**
 * Stores token in secure storage
 * @param token JWT token string
 */
export const setToken = async (token: string): Promise<boolean> => {
  try {
    // Validate token format before storing
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      console.error('Invalid token format');
      return false;
    }

    // Check if token is already expired before storing
    if (isTokenExpired(token)) {
      console.warn('Attempting to store expired token, rejecting');
      return false;
    }

    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      // Fallback to AsyncStorage for web or when SecureStore is unavailable
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
    
    return true;
  } catch (error) {
    console.error('Error storing token in storage:', error);
    return false;
  }
};

/**
 * Removes token from secure storage
 */
export const removeToken = async (): Promise<boolean> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      // Fallback to AsyncStorage for web or when SecureStore is unavailable
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Error removing token from storage:', error);
    return false;
  }
};

/**
 * Gets token and handles expiration/removal
 * Redirects to auth if token is missing or expired
 * @returns Token string or null if not found/expired
 */
export const getValidToken = async (): Promise<string | null> => {
  const token = await getToken();
  
  if (!token) {
    // Token not found or expired, redirect to auth
    router.replace('/(auth)');
    return null;
  }

  return token;
};

/**
 * Checks if user has a valid token (not expired)
 * @returns true if valid token exists, false otherwise
 */
export const hasValidToken = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};

