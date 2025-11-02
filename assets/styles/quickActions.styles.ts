// app/(tabs)/components/QuickActions.styles.ts
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
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: MedicalTheme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[2],
    ...MedicalTheme.shadow.sm,
  },
  actionLabel: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: '500',
    color: MedicalTheme.colors.text.primary,
    textAlign: 'center',
  },
});