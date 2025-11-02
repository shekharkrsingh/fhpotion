// newComponents/EmptyScreen.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: MedicalTheme.spacing[6],
  },
  content: {
    alignItems: 'center',
    paddingVertical: MedicalTheme.spacing[8],
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[6],
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[3],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: MedicalTheme.spacing[6],
    paddingHorizontal: MedicalTheme.spacing[4],
  },
  childrenContainer: {
    width: '100%',
    marginBottom: MedicalTheme.spacing[6],
  },
  actionButtons: {
    width: '100%',
    gap: MedicalTheme.spacing[3],
    marginBottom: MedicalTheme.spacing[6],
    maxWidth: 300,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[4],
    borderRadius: MedicalTheme.borderRadius.lg,
    gap: MedicalTheme.spacing[2],
  },
  primaryButton: {
    backgroundColor: MedicalTheme.colors.primary[500],
    ...MedicalTheme.shadow.sm,
  },
  secondaryButton: {
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.primary[200],
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
  },
  buttonText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: MedicalTheme.colors.text.inverse,
  },
  secondaryButtonText: {
    color: MedicalTheme.colors.primary[500],
  },
  outlineButtonText: {
    color: MedicalTheme.colors.text.secondary,
  },
  supportSection: {
    alignItems: 'center',
    paddingTop: MedicalTheme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: MedicalTheme.colors.border.light,
    width: '100%',
    maxWidth: 300,
  },
  supportTitle: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[1],
  },
  supportText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center',
  },
  supportEmail: {
    color: MedicalTheme.colors.primary[500],
    fontWeight: '600',
  },
});