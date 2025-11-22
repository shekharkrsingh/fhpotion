import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '@/assets/styles/loadingState.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading Dashboard...', 
  size = 'large' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={MedicalTheme.colors.primary[500]} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default LoadingState;