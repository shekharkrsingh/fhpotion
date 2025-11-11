import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const reportScreenStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.primary,
  },
  contentContainer: {
    padding: MedicalTheme.spacing[4],
    paddingTop: MedicalTheme.spacing[2],
  },

  // Header Styles
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingVertical: MedicalTheme.spacing[3],
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
    shadowColor: MedicalTheme.colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: {
    padding: MedicalTheme.spacing[2],
    backgroundColor: MedicalTheme.colors.primary[50],
    borderRadius: MedicalTheme.borderRadius.md,
    marginRight: MedicalTheme.spacing[2],
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.text.secondary,
    marginTop: MedicalTheme.spacing[1],
    textAlign: 'center',
  },
  contactButton: {
    padding: MedicalTheme.spacing[2],
    backgroundColor: MedicalTheme.colors.primary[50],
    borderRadius: MedicalTheme.borderRadius.md,
    marginLeft: MedicalTheme.spacing[2],
  },

  // Content Styles
  title: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[6],
    textAlign: 'center',
  },
  section: {
    marginBottom: MedicalTheme.spacing[6],
  },
  sectionTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[3],
  },

  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MedicalTheme.spacing[2],
  },
  quickActionButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    gap: MedicalTheme.spacing[1],
    shadowColor: MedicalTheme.colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.primary,
    textAlign: 'center',
  },

  // Input Styles
  inputContainer: {
    marginBottom: MedicalTheme.spacing[4],
  },
  label: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[1],
  },
  required: {
    color: MedicalTheme.colors.error[500],
  },
  input: {
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.md,
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[4],
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
    shadowColor: MedicalTheme.colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: MedicalTheme.colors.error[500],
    backgroundColor: MedicalTheme.colors.error[50],
  },
  hint: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.text.tertiary,
    marginTop: MedicalTheme.spacing[1],
    fontStyle: 'italic',
  },

  // Error Styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.error[50],
    padding: MedicalTheme.spacing[3],
    borderRadius: MedicalTheme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: MedicalTheme.colors.error[500],
    marginBottom: MedicalTheme.spacing[4],
    gap: MedicalTheme.spacing[2],
  },
  errorText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.error[700],
    flex: 1,
  },

  // Button Styles
  primaryButton: {
    backgroundColor: MedicalTheme.colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: MedicalTheme.spacing[4],
    paddingHorizontal: MedicalTheme.spacing[4],
    borderRadius: MedicalTheme.borderRadius.lg,
    gap: MedicalTheme.spacing[2],
    shadowColor: MedicalTheme.colors.primary[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.inverse,
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Actions Section Styles
  actionsSection: {
    marginBottom: MedicalTheme.spacing[6],
    padding: MedicalTheme.spacing[4],
    backgroundColor: MedicalTheme.colors.success[50],
    borderRadius: MedicalTheme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: MedicalTheme.colors.success[500],
    shadowColor: MedicalTheme.colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsDescription: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[3],
    // lineHeight: MedicalTheme.typography.lineHeight.normal,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: MedicalTheme.spacing[2],
  },
  downloadButton: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.success[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: MedicalTheme.spacing[3],
    borderRadius: MedicalTheme.borderRadius.md,
    gap: MedicalTheme.spacing[2],
    shadowColor: MedicalTheme.colors.success[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.secondary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: MedicalTheme.spacing[3],
    borderRadius: MedicalTheme.borderRadius.md,
    gap: MedicalTheme.spacing[2],
    shadowColor: MedicalTheme.colors.secondary[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.inverse,
  },
  shareButtonText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.inverse,
  },

  // Info Section Styles
  infoSection: {
    backgroundColor: MedicalTheme.colors.primary[50],
    padding: MedicalTheme.spacing[4],
    borderRadius: MedicalTheme.borderRadius.lg,
    marginTop: MedicalTheme.spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: MedicalTheme.colors.primary[300],
  },
  infoTitle: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.primary[700],
    marginBottom: MedicalTheme.spacing[2],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[2],
    gap: MedicalTheme.spacing[2],
  },
  infoText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.primary[700],
    flex: 1,
  },
});