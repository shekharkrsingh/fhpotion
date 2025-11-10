import { StyleSheet, Dimensions } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  section: {
    backgroundColor: MedicalTheme.colors.background.primary,
    marginHorizontal: MedicalTheme.spacing[4],
    marginVertical: MedicalTheme.spacing[1],
    borderRadius: MedicalTheme.borderRadius.lg,
    overflow: 'hidden',
    ...MedicalTheme.shadow.card,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: MedicalTheme.spacing[4],
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: MedicalTheme.borderRadius.md,
    backgroundColor: MedicalTheme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: MedicalTheme.spacing[3],
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: 2,
  },
  currentValue: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
  },
  emptyValue: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.disabled,
    fontStyle: 'italic',
  },
  chevronContainer: {
    marginLeft: MedicalTheme.spacing[2],
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
  modalSubtitle: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
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
    marginBottom: MedicalTheme.spacing[5],
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
    marginBottom: MedicalTheme.spacing[2],
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  inputHelpText: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.text.tertiary,
    fontStyle: 'italic',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: MedicalTheme.colors.text.inverse,
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginLeft: MedicalTheme.spacing[2],
  },
  // Layout
  row: {
    flexDirection: 'row',
    gap: MedicalTheme.spacing[3],
  },
  flex1: {
    flex: 1,
  },
  // Availability Styles
  availabilitySection: {
    marginBottom: MedicalTheme.spacing[6],
  },
  sectionLabel: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[1],
  },
  sectionDescription: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[4],
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MedicalTheme.spacing[2],
  },
  dayButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[2],
    borderRadius: MedicalTheme.borderRadius.md,
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: MedicalTheme.colors.primary[500],
    borderColor: MedicalTheme.colors.primary[500],
  },
  dayButtonText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.secondary,
  },
  dayButtonTextSelected: {
    color: MedicalTheme.colors.text.inverse,
  },
  selectedDaysText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: MedicalTheme.spacing[2],
  },
  addTimeSlotContainer: {
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
    marginBottom: MedicalTheme.spacing[4],
  },
  timeSlotLabel: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[3],
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: MedicalTheme.spacing[3],
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[1],
  },
  timeInput: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
    borderRadius: MedicalTheme.borderRadius.md,
    padding: MedicalTheme.spacing[3],
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.primary,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    marginBottom: MedicalTheme.spacing[5],
  },
  addTimeButton: {
    backgroundColor: MedicalTheme.colors.primary[500],
    width: 44,
    height: 44,
    borderRadius: MedicalTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[1],
  },
  currentTimeSlots: {
    gap: MedicalTheme.spacing[2],
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
  },
  timeSlotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: MedicalTheme.spacing[2],
  },
  timeSlotText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.primary,
  },
  removeTimeButton: {
    padding: MedicalTheme.spacing[2],
  },
  summarySection: {
    marginBottom: MedicalTheme.spacing[4],
  },
  summaryCard: {
    backgroundColor: MedicalTheme.colors.primary[50],
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.primary[200],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: MedicalTheme.spacing[2],
    marginBottom: MedicalTheme.spacing[2],
  },
  summaryText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.primary[700],
    flex: 1,
  },
  summaryLabel: {
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
  },
  // List Styles
  listSection: {
    marginBottom: MedicalTheme.spacing[6],
  },
  addItemContainer: {
    gap: MedicalTheme.spacing[3],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MedicalTheme.colors.primary[500],
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    marginBottom: MedicalTheme.spacing[2],
  },
  addButtonText: {
    color: MedicalTheme.colors.text.inverse,
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginLeft: MedicalTheme.spacing[2],
  },
  listContainer: {
    gap: MedicalTheme.spacing[2],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
    gap: MedicalTheme.spacing[3],
  },
  listItemIcon: {
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.primary,
  },
  removeButton: {
    padding: MedicalTheme.spacing[1],
    marginTop: 2,
  },
  // Empty States
  emptyState: {
    alignItems: 'center',
    padding: MedicalTheme.spacing[10],
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderRadius: MedicalTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.tertiary,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    marginTop: MedicalTheme.spacing[3],
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.disabled,
    textAlign: 'center',
    marginTop: MedicalTheme.spacing[1],
  },
});