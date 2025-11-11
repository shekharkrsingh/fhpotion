// EditAppointmentForm.styles.ts
import { MedicalTheme } from '@/newConstants/theme';
import { StyleSheet } from 'react-native';

export const editFormStyles = StyleSheet.create({
  // Container Styles
  inputContainer: {
    marginBottom: MedicalTheme.spacing[4],
  },
  
  label: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[1],
    marginLeft: MedicalTheme.spacing[1],
  },
  
  required: {
    color: MedicalTheme.colors.error[500],
  },
  
  // Input Styles
  input: {
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.md,
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[4],
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
    minHeight: 48,
  },
  
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  inputError: {
    borderColor: MedicalTheme.colors.error[500],
    backgroundColor: MedicalTheme.colors.error[50],
  },
  
  errorText: {
    color: MedicalTheme.colors.error[500],
    fontSize: MedicalTheme.typography.fontSize.xs,
    marginTop: MedicalTheme.spacing[1],
    marginLeft: MedicalTheme.spacing[1],
  },
  
  // Date/Time Picker Styles
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MedicalTheme.spacing[2],
  },
  
  dateTimeButton: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.md,
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: MedicalTheme.spacing[2],
    minHeight: 48,
  },
  
  dateTimeButtonActive: {
    borderColor: MedicalTheme.colors.primary[500],
    backgroundColor: MedicalTheme.colors.primary[50],
  },
  
  dateTimeText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.primary,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
  },
  
  dateTimeTextActive: {
    color: MedicalTheme.colors.primary[600],
  },
  
  // Picker Modal Styles
  pickerModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  
  pickerContainer: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderTopLeftRadius: MedicalTheme.borderRadius.xl,
    borderTopRightRadius: MedicalTheme.borderRadius.xl,
    padding: MedicalTheme.spacing[4],
    maxHeight: '50%',
  },
  
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[4],
    paddingBottom: MedicalTheme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  
  pickerTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
  },
  
  pickerActions: {
    flexDirection: 'row',
    gap: MedicalTheme.spacing[2],
  },
  
  pickerButton: {
    paddingVertical: MedicalTheme.spacing[2],
    paddingHorizontal: MedicalTheme.spacing[4],
    borderRadius: MedicalTheme.borderRadius.md,
  },
  
  pickerCancelButton: {
    backgroundColor: MedicalTheme.colors.neutral[100],
  },
  
  pickerConfirmButton: {
    backgroundColor: MedicalTheme.colors.primary[500],
  },
  
  pickerButtonText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
  },
  
  pickerCancelText: {
    color: MedicalTheme.colors.text.secondary,
  },
  
  pickerConfirmText: {
    color: MedicalTheme.colors.text.inverse,
  },
  
  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.overlay.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: MedicalTheme.spacing[4],
  },
  
  modalContainer: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius.xl,
    padding: MedicalTheme.spacing[6],
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: MedicalTheme.colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  
  modalHeader: {
    marginBottom: MedicalTheme.spacing[4],
  },
  
  modalTitle: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[2],
  },
  
  modalSubtitle: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    lineHeight: MedicalTheme.typography.lineHeight.normal,
  },
  
  warningText: {
    color: MedicalTheme.colors.warning[600],
    fontWeight: MedicalTheme.typography.fontWeight.medium,
  },
  
  // Form Section Styles
  formSection: {
    marginBottom: MedicalTheme.spacing[4],
  },
  
  sectionTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[3],
    paddingBottom: MedicalTheme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  
  // Contact Info Styles
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MedicalTheme.spacing[1],
  },
  
  contactLength: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.text.tertiary,
    marginLeft: MedicalTheme.spacing[2],
  },
  
  contactLengthError: {
    color: MedicalTheme.colors.error[500],
  },
  
  contactLengthValid: {
    color: MedicalTheme.colors.success[500],
  },
});