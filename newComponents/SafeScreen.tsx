import { View, StyleSheet, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MedicalTheme } from '@/newConstants/theme';

interface SafeScreenProps {
  children: ReactNode;
  backgroundColor?: keyof typeof MedicalTheme.colors.background;
}

export default function SafeScreen({ 
  children, 
  backgroundColor = 'secondary' 
}: SafeScreenProps) {
  const inserts = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: inserts.top,
        backgroundColor: MedicalTheme.colors.background[backgroundColor]
      }
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});