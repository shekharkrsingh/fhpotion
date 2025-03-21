import { View, StyleSheet, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '@/constants/colors';

interface SafeScreenProps {
  children: ReactNode;
}

export default function SafeScreen({ children }: SafeScreenProps) {
  const inserts = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: inserts.top }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
});
