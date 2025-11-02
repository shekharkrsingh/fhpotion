// app/(tabs)/components/PerformanceMetrics.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius['2xl'],
    padding: MedicalTheme.spacing[6],
    marginBottom: MedicalTheme.spacing[8],
    ...MedicalTheme.shadow.lg,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: '600',
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[5],
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: '700',
    marginBottom: MedicalTheme.spacing[2],
  },
  label: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: '400',
  },
});