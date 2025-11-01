// styles/signupDetails.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.primary,
  },

  // Top illustration section
  topIllustration: {
    height: '30%',
    backgroundColor: MedicalTheme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: MedicalTheme.spacing[4],
  },

  illustrationImage: {
    width: '100%',
    height: '80%',
    maxHeight: 200,
  },

  // Card section
  card: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.primary,
    borderTopLeftRadius: MedicalTheme.borderRadius['3xl'],
    borderTopRightRadius: MedicalTheme.borderRadius['3xl'],
    paddingTop: MedicalTheme.spacing[8],
    paddingHorizontal: MedicalTheme.spacing[6],
    paddingBottom: MedicalTheme.spacing[4],
    shadowColor: MedicalTheme.shadow.lg.shadowColor,
    shadowOffset: MedicalTheme.shadow.lg.shadowOffset,
    shadowOpacity: MedicalTheme.shadow.lg.shadowOpacity,
    shadowRadius: MedicalTheme.shadow.lg.shadowRadius,
    elevation: MedicalTheme.shadow.lg.elevation,
  },

  // Form container
  formContainer: {
    flex: 1,
  },

  // Footer container
  footerContainer: {
    marginTop: 'auto',
    paddingTop: MedicalTheme.spacing[4],
  },

  // Input groups
  inputGroup: {
    marginBottom: MedicalTheme.spacing[5],
  },

  label: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[2],
    fontWeight: '500' as const,
  },

  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: MedicalTheme.colors.background.primary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.lg,
    paddingHorizontal: MedicalTheme.spacing[4],
    minHeight: 48,
  },

  inputIcon: {
    marginRight: MedicalTheme.spacing[3],
  },

  input: {
    flex: 1,
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
    paddingVertical: MedicalTheme.spacing[2],
    fontWeight: '400' as const,
    includeFontPadding: false,
  },

  eyeIcon: {
    padding: MedicalTheme.spacing[2],
    marginLeft: MedicalTheme.spacing[2],
  },

  // Button styles
  button: {
    backgroundColor: MedicalTheme.colors.primary[500],
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[6],
    borderRadius: MedicalTheme.borderRadius.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 44,
    marginTop: MedicalTheme.spacing[2],
    marginBottom: MedicalTheme.spacing[4],
    shadowColor: MedicalTheme.shadow.sm.shadowColor,
    shadowOffset: MedicalTheme.shadow.sm.shadowOffset,
    shadowOpacity: MedicalTheme.shadow.sm.shadowOpacity,
    shadowRadius: MedicalTheme.shadow.sm.shadowRadius,
    elevation: MedicalTheme.shadow.sm.elevation,
  },

  buttonPressed: {
    backgroundColor: MedicalTheme.colors.primary[600],
    transform: [{ scale: 0.98 }],
  },

  buttonDisabled: {
    backgroundColor: MedicalTheme.colors.neutral[300],
    opacity: 0.6,
  },

  buttonText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: '600' as const,
    color: MedicalTheme.colors.text.inverse,
    textAlign: 'center' as const,
  },

  // Footer sections
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: MedicalTheme.spacing[3],
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
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: '500' as const,
    color: MedicalTheme.colors.primary[500],
    textAlign: 'center' as const,
  },

  // Signup specific styles
  header: {
    alignItems: 'center' as const,
    marginBottom: MedicalTheme.spacing[8],
  },

  title: {
    fontSize: MedicalTheme.typography.fontSize['3xl'],
    fontWeight: '700' as const,
    color: MedicalTheme.colors.primary[700],
    marginBottom: MedicalTheme.spacing[2],
    textAlign: 'center' as const,
  },

  subtitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: MedicalTheme.typography.lineHeight.relaxed,
  },

  passwordRequirements: {
    marginTop: MedicalTheme.spacing[2],
    marginBottom: MedicalTheme.spacing[4],
  },

  requirementText: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.text.tertiary,
  },
});

export default styles;