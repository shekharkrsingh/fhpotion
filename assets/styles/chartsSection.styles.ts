// app/(tabs)/components/ChartsSection.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: MedicalTheme.spacing[8],
  },
  chartContainer: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius['2xl'],
    padding: MedicalTheme.spacing[6],
    marginBottom: MedicalTheme.spacing[6],
    ...MedicalTheme.shadow.lg,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
  },
  chartTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: '600',
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[4],
  },
  chart: {
    borderRadius: MedicalTheme.borderRadius.lg,
  },
});