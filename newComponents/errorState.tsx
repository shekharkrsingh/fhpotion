// app/(tabs)/components/ErrorState.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from '@/assets/styles/errorState.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error-outline" size={48} color={MedicalTheme.colors.error[500]} />
      <Text style={styles.title}>Failed to load dashboard</Text>
      <Text style={styles.subtitle}>
        Please check your connection and try again
      </Text>
      <Pressable 
        style={({ pressed }) => [
          styles.retryButton,
          pressed && { opacity: 0.7 }
        ]}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>
          Try Again
        </Text>
      </Pressable>
    </View>
  );
};

export default ErrorState;