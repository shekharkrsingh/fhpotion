// app/(tabs)/components/ErrorState.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorState;