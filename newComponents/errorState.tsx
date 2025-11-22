import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '@/assets/styles/errorState.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = 'Failed to load dashboard',
  message = 'Please check your connection and try again',
  onRetry,
  retryLabel = 'Try Again'
}) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error-outline" size={48} color={MedicalTheme.colors.error[500]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{message}</Text>
      {onRetry && (
        <Pressable 
          style={({ pressed }) => [
            styles.retryButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>{retryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ErrorState;