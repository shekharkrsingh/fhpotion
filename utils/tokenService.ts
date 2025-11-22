import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import logger from './logger';

const TOKEN_KEY = 'auth_token';

const isSecureStoreAvailable = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      return false;
    }
    return await SecureStore.isAvailableAsync();
  } catch (error) {
    logger.warn('SecureStore availability check failed, falling back to AsyncStorage:', error);
    return false;
  }
};

const decodeBase64 = (base64: string): string => {
  try {
    if (typeof atob !== 'undefined') {
      return atob(base64);
    }
    
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    }
    
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
    logger.error('Error decoding base64:', error);
    throw error;
  }
};

const decodeJWTPayload = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    const decodedPayload = decodeBase64(paddedBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    logger.error('Error decoding JWT payload:', error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWTPayload(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    const bufferTime = 60000;
    
    return currentTime >= (expirationTime - bufferTime);
  } catch (error) {
    logger.error('Error checking token expiration:', error);
    return true;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    let token: string | null = null;

    if (useSecureStore) {
      token = await SecureStore.getItemAsync(TOKEN_KEY);
    } else {
      token = await AsyncStorage.getItem(TOKEN_KEY);
    }
    
    if (!token) {
      return null;
    }

    if (isTokenExpired(token)) {
      logger.warn('Token expired, removing from storage');
      await removeToken();
      return null;
    }

    return token;
  } catch (error) {
    logger.error('Error getting token from storage:', error);
    return null;
  }
};

export const setToken = async (token: string): Promise<boolean> => {
  try {
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      logger.error('Invalid token format');
      return false;
    }

    if (isTokenExpired(token)) {
      logger.warn('Attempting to store expired token, rejecting');
      return false;
    }

    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
    
    return true;
  } catch (error) {
    logger.error('Error storing token in storage:', error);
    return false;
  }
};

export const removeToken = async (): Promise<boolean> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    
    return true;
  } catch (error) {
    logger.error('Error removing token from storage:', error);
    return false;
  }
};

export const getValidToken = async (skipRedirect = false): Promise<string | null> => {
  const token = await getToken();
  
  if (!token && !skipRedirect) {
    setTimeout(() => {
      router.replace('/(auth)');
    }, 0);
    return null;
  }

  return token;
};

export const hasValidToken = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};

