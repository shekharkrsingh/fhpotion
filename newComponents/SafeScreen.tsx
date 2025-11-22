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
  const bgColor = MedicalTheme.colors.background[backgroundColor];
  const statusBarBg = MedicalTheme.colors.background.primary;
  
  return (
    <View style={styles.container}>
      <View style={{ 
        height: inserts.top, 
        backgroundColor: statusBarBg
      }} />
      <View style={[
        styles.content, 
        { 
          backgroundColor: bgColor
        }
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
});