// app/(tabs)/dashboard.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingTop: MedicalTheme.spacing[4],
    paddingBottom: MedicalTheme.spacing[8],
  },
});