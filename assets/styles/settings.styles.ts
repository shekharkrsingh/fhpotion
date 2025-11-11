import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MedicalTheme.spacing[5],
    paddingVertical: MedicalTheme.spacing[4],
    backgroundColor: MedicalTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  backButton: {
    padding: MedicalTheme.spacing[2],
  },
  headerTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: MedicalTheme.spacing[4],
  },
  categoryContainer: {
    marginBottom: MedicalTheme.spacing[6],
  },
  categoryTitle: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[2],
    marginHorizontal: MedicalTheme.spacing[5],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Update the section styles to have consistent sizing
section: {
  backgroundColor: MedicalTheme.colors.background.primary,
  marginHorizontal: MedicalTheme.spacing[4],
  marginVertical: MedicalTheme.spacing[1],
  borderRadius: MedicalTheme.borderRadius.lg,
  overflow: 'hidden',
  ...MedicalTheme.shadow.card,
  borderWidth: 1,
  borderColor: MedicalTheme.colors.border.light,
  // Add minHeight for consistent sizing
  minHeight: 80, // Added for consistent height
},
sectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: MedicalTheme.spacing[4],
  // Ensure full width utilization
  flex: 1,
},
sectionHeaderContent: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  // Ensure content takes full available space
  minHeight: 48, // Added for consistent content height
},
iconContainer: {
  width: 40,
  height: 40,
  borderRadius: MedicalTheme.borderRadius.md,
  backgroundColor: MedicalTheme.colors.primary[50],
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: MedicalTheme.spacing[3],
  // Fixed size to prevent variation
  flexShrink: 0,
},
sectionTextContainer: {
  flex: 1,
  // Allow text to grow and shrink properly
  minHeight: 40, // Added for consistent text container height
  justifyContent: 'center',
},
sectionTitle: {
  fontSize: MedicalTheme.typography.fontSize.base,
  fontWeight: MedicalTheme.typography.fontWeight.semibold,
  color: MedicalTheme.colors.text.primary,
  marginBottom: 2,
  // Ensure consistent text rendering
  lineHeight: 20,
},
sectionDescription: {
  fontSize: MedicalTheme.typography.fontSize.sm,
  color: MedicalTheme.colors.text.secondary,
  // Ensure consistent text rendering
  lineHeight: 18,
},
chevronContainer: {
  marginLeft: MedicalTheme.spacing[2],
  // Fixed size for chevron area
  width: 24,
  alignItems: 'flex-end',
  flexShrink: 0,
},
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: MedicalTheme.spacing[5],
    backgroundColor: MedicalTheme.colors.primary[500],
    borderBottomLeftRadius: MedicalTheme.borderRadius.xl,
    borderBottomRightRadius: MedicalTheme.borderRadius.xl,
    ...MedicalTheme.shadow.md,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: MedicalTheme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: MedicalTheme.spacing[3],
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.inverse,
    marginBottom: 2,
  },
  modalCloseButton: {
    padding: MedicalTheme.spacing[1],
  },
  modalContent: {
    flex: 1,
  },
  modalScrollView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: MedicalTheme.spacing[5],
  },
  inputGroup: {
    marginBottom: MedicalTheme.spacing[4],
  },
  inputLabel: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[2],
  },
  input: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
  },
  passwordInputContainer: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: MedicalTheme.spacing[4],
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
  },
  eyeIcon: {
    padding: MedicalTheme.spacing[4],
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: MedicalTheme.colors.error[500],
    backgroundColor: MedicalTheme.colors.error[50],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.error[50],
    padding: MedicalTheme.spacing[3],
    borderRadius: MedicalTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.error[500],
    marginBottom: MedicalTheme.spacing[4],
  },
  errorText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.error[500],
    marginLeft: MedicalTheme.spacing[2],
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: MedicalTheme.spacing[3],
    padding: MedicalTheme.spacing[5],
    borderTopWidth: 1,
    borderTopColor: MedicalTheme.colors.border.light,
    backgroundColor: MedicalTheme.colors.background.primary,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
  },
  cancelButtonText: {
    color: MedicalTheme.colors.text.secondary,
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
  },
  actionButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MedicalTheme.colors.primary[500],
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    ...MedicalTheme.shadow.lg,
  },
  signoutButton: {
    backgroundColor: MedicalTheme.colors.error[500],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: MedicalTheme.colors.text.inverse,
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginLeft: MedicalTheme.spacing[2],
  },
  currentEmailContainer: {
    backgroundColor: MedicalTheme.colors.primary[50],
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.primary[200],
    marginBottom: MedicalTheme.spacing[4],
  },
  currentEmailLabel: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.primary[700],
    marginBottom: MedicalTheme.spacing[1],
  },
  currentEmail: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    marginBottom: MedicalTheme.spacing[2],
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: MedicalTheme.colors.success[50],
    paddingHorizontal: MedicalTheme.spacing[3],
    paddingVertical: MedicalTheme.spacing[1.5],
    borderRadius: MedicalTheme.borderRadius.full,
  },
  verifiedText: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.success[500],
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginLeft: MedicalTheme.spacing[1],
  },
  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: MedicalTheme.spacing[3],
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: MedicalTheme.spacing[4],
  },
  toggleLabel: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[1],
  },
  toggleDescription: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
  },
  toggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: MedicalTheme.colors.neutral[300],
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: MedicalTheme.colors.primary[500],
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: MedicalTheme.colors.background.primary,
    shadowColor: MedicalTheme.colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  // Radio Styles
  radioContainer: {
    paddingVertical: MedicalTheme.spacing[3],
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: MedicalTheme.colors.neutral[400],
    marginRight: MedicalTheme.spacing[3],
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: MedicalTheme.colors.primary[500],
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MedicalTheme.colors.primary[500],
  },
  radioTextContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[1],
  },
  radioDescription: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
  },
  toggleGroup: {
    marginTop: MedicalTheme.spacing[2],
  },
  sectionLabel: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[4],
  },
  // Support Styles
  // categoryContainer: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   gap: MedicalTheme.spacing[2],
  // },
  categoryButton: {
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingVertical: MedicalTheme.spacing[2],
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
    borderRadius: MedicalTheme.borderRadius.full,
  },
  categoryButtonActive: {
    backgroundColor: MedicalTheme.colors.primary[500],
    borderColor: MedicalTheme.colors.primary[500],
  },
  categoryButtonText: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.secondary,
  },
  categoryButtonTextActive: {
    color: MedicalTheme.colors.text.inverse,
  },
  supportInfo: {
    backgroundColor: MedicalTheme.colors.primary[50],
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.primary[200],
  },
  supportInfoText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.primary[700],
    marginBottom: MedicalTheme.spacing[2],
  },
  supportInfoDetail: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.primary[700],
    marginBottom: MedicalTheme.spacing[1],
  },
  // Warning Styles
  warningContainer: {
    alignItems: 'center',
    padding: MedicalTheme.spacing[4],
    backgroundColor: MedicalTheme.colors.warning[50],
    borderRadius: MedicalTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.warning[200],
    marginBottom: MedicalTheme.spacing[4],
  },
  warningTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.warning[700],
    marginTop: MedicalTheme.spacing[2],
    marginBottom: MedicalTheme.spacing[2],
  },
  warningText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.warning[700],
    textAlign: 'center',
  },
  // Account Actions
  actionButtonsContainer: {
    gap: MedicalTheme.spacing[4],
  },
  accountActionButton: {
    borderRadius: MedicalTheme.borderRadius.lg,
    overflow: 'hidden',
    ...MedicalTheme.shadow.lg,
  },
  accountActionContent: {
    padding: MedicalTheme.spacing[5],
    alignItems: 'center',
    borderRadius: MedicalTheme.borderRadius.lg,
  },
  deactivateButton: {
    backgroundColor: MedicalTheme.colors.warning[500],
  },
  deleteButton: {
    backgroundColor: MedicalTheme.colors.error[500],
  },
  accountActionText: {
    color: MedicalTheme.colors.text.inverse,
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginTop: MedicalTheme.spacing[2],
    marginBottom: MedicalTheme.spacing[1],
  },
  accountActionDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: MedicalTheme.typography.fontSize.sm,
    textAlign: 'center',
  },
  // OTP Styles
  otpContainer: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.secondary,
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MedicalTheme.spacing[5],
    paddingVertical: MedicalTheme.spacing[4],
    backgroundColor: MedicalTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  otpTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
  },
  otpContent: {
    flex: 1,
  },
  otpIllustration: {
    alignItems: 'center',
    paddingVertical: MedicalTheme.spacing[10],
  },
  otpForm: {
    padding: MedicalTheme.spacing[5],
  },
  otpLabel: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[2],
  },
  otpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.lg,
    paddingHorizontal: MedicalTheme.spacing[4],
  },
  inputIcon: {
    marginRight: MedicalTheme.spacing[3],
  },
  otpInput: {
    flex: 1,
    paddingVertical: MedicalTheme.spacing[4],
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
  },
  otpFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: MedicalTheme.spacing[5],
  },
  footerText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
  },
  link: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.primary[500],
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginLeft: MedicalTheme.spacing[1],
  },

  // Add these styles to your existing settings.styles.ts file

// Additional Links Styles
linkSection: {
  backgroundColor: MedicalTheme.colors.background.primary,
  marginHorizontal: MedicalTheme.spacing[4],
  marginVertical: MedicalTheme.spacing[1],
  borderRadius: MedicalTheme.borderRadius.lg,
  padding: MedicalTheme.spacing[4],
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...MedicalTheme.shadow.card,
  borderWidth: 1,
  borderColor: MedicalTheme.colors.border.light,
  minHeight: 80,
},
linkContent: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
linkIconContainer: {
  width: 40,
  height: 40,
  borderRadius: MedicalTheme.borderRadius.md,
  backgroundColor: MedicalTheme.colors.primary[50],
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: MedicalTheme.spacing[3],
  flexShrink: 0,
},
linkTextContainer: {
  flex: 1,
  minHeight: 40,
  justifyContent: 'center',
},
linkTitle: {
  fontSize: MedicalTheme.typography.fontSize.base,
  fontWeight: MedicalTheme.typography.fontWeight.semibold,
  color: MedicalTheme.colors.text.primary,
  marginBottom: 2,
  lineHeight: 20,
},
linkDescription: {
  fontSize: MedicalTheme.typography.fontSize.sm,
  color: MedicalTheme.colors.text.secondary,
  lineHeight: 18,
},
});