// styles/otpModal.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.primary,
    paddingHorizontal: MedicalTheme.spacing[6],
    paddingTop: MedicalTheme.spacing[8],
  },

  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[8],
  },

  closeButton: {
    padding: MedicalTheme.spacing[2],
  },

  closeButtonPlaceholder: {
    width: 40,
  },

  title: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: '700' as const,
    color: MedicalTheme.colors.text.primary,
    textAlign: 'center' as const,
  },

  content: {
    flex: 1,
    alignItems: 'center' as const,
  },

  illustrationContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: MedicalTheme.colors.primary[50],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: MedicalTheme.spacing[6],
  },

  subtitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center' as const,
    marginBottom: MedicalTheme.spacing[2],
  },

  emailText: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: '600' as const,
    color: MedicalTheme.colors.primary[600],
    textAlign: 'center' as const,
    marginBottom: MedicalTheme.spacing[8],
  },

  // OTP Container
  otpContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    marginBottom: MedicalTheme.spacing[8],
    width: '100%',
  },

  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.md,
    backgroundColor: MedicalTheme.colors.background.primary,
    textAlign: 'center' as const,
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: '600' as const,
    color: MedicalTheme.colors.text.primary,
  },

  otpInputFilled: {
    borderColor: MedicalTheme.colors.primary[500],
    backgroundColor: MedicalTheme.colors.primary[50],
  },

  inputDisabled: {
    opacity: 0.6,
  },

  // Button styles
  button: {
    backgroundColor: MedicalTheme.colors.primary[500],
    paddingVertical: MedicalTheme.spacing[4],
    paddingHorizontal: MedicalTheme.spacing[8],
    borderRadius: MedicalTheme.borderRadius.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 56,
    width: '100%',
    marginBottom: MedicalTheme.spacing[6],
    shadowColor: MedicalTheme.shadow.sm.shadowColor,
    shadowOffset: MedicalTheme.shadow.sm.shadowOffset,
    shadowOpacity: MedicalTheme.shadow.sm.shadowOpacity,
    shadowRadius: MedicalTheme.shadow.sm.shadowRadius,
    elevation: MedicalTheme.shadow.sm.elevation,
  },

  buttonDisabled: {
    backgroundColor: MedicalTheme.colors.neutral[300],
    opacity: 0.6,
  },

  buttonText: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: '600' as const,
    color: MedicalTheme.colors.text.inverse,
    textAlign: 'center' as const,
  },

  // Resend OTP styles
  resendContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: MedicalTheme.spacing[8],
    flexWrap: 'wrap' as const,
  },

  resendText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.secondary,
    fontWeight: '400' as const,
    textAlign: 'center' as const,
  },

  resendLink: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: '500' as const,
    color: MedicalTheme.colors.primary[500],
    textAlign: 'center' as const,
  },

  resendLinkDisabled: {
    color: MedicalTheme.colors.text.tertiary,
    opacity: 0.6,
  },

  // Footer
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: MedicalTheme.spacing[6],
    flexWrap: 'wrap' as const,
  },

  footerText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    marginRight: MedicalTheme.spacing[1],
    fontWeight: '400' as const,
    textAlign: 'center' as const,
  },

  link: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: '500' as const,
    color: MedicalTheme.colors.primary[500],
    textAlign: 'center' as const,
  },
});

export default styles;