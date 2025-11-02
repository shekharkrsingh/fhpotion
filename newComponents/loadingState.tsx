// app/(tabs)/components/LoadingState.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '@/assets/styles/loadingState.styles';
import { MedicalTheme } from '@/newConstants/theme';

const LoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={MedicalTheme.colors.primary[500]} />
      <Text style={styles.text}>
        Loading Dashboard...
      </Text>
    </View>
  );
};

export default LoadingState;