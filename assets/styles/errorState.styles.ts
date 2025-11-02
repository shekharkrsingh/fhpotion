// app/(tabs)/components/ErrorState.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.background.primary,
    padding: MedicalTheme.spacing[6],
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    color: MedicalTheme.colors.text.primary,
    marginTop: MedicalTheme.spacing[3],
    marginBottom: MedicalTheme.spacing[2],
    fontWeight: '600',
  },
  subtitle: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: MedicalTheme.spacing[6],
  },
  retryButton: {
    backgroundColor: MedicalTheme.colors.primary[500],
    paddingHorizontal: MedicalTheme.spacing[6],
    paddingVertical: MedicalTheme.spacing[3],
    borderRadius: MedicalTheme.borderRadius.lg,
    ...MedicalTheme.shadow.sm,
  },
  retryText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.inverse,
    fontWeight: '600',
  },
});