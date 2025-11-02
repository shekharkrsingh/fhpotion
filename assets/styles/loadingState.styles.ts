// app/(tabs)/components/LoadingState.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.background.primary,
  },
  text: {
    marginTop: MedicalTheme.spacing[3],
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.secondary,
  },
});