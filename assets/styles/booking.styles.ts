import { MedicalTheme } from '@/newConstants/theme';
import { StyleSheet } from 'react-native';

export const bookingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.secondary,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: MedicalTheme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  filterButton: {
    paddingHorizontal: MedicalTheme.spacing[5],
    paddingVertical: MedicalTheme.spacing[2],
    borderRadius: MedicalTheme.borderRadius.md,
    marginHorizontal: MedicalTheme.spacing[1],
  },
  activeButton: {
    backgroundColor: MedicalTheme.colors.primary[500],
  },
  filterText: {
    color: MedicalTheme.colors.text.secondary,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    fontSize: MedicalTheme.typography.fontSize.sm,
  },
  activeFilterText: {
    color: MedicalTheme.colors.text.inverse,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
  },
  listContent: {
    paddingBottom: MedicalTheme.spacing[6],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.primary[50],
  },
});

export const bookingHeaderStyles = StyleSheet.create({
  boookingHeader: {
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingVertical: MedicalTheme.spacing[2],
    backgroundColor: MedicalTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[1],
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MedicalTheme.spacing[2],
  },
  iconButton: {
    padding: MedicalTheme.spacing[2],
    borderRadius: MedicalTheme.borderRadius.md,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.error[50],
    paddingHorizontal: MedicalTheme.spacing[3],
    paddingVertical: MedicalTheme.spacing[2],
    borderRadius: MedicalTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.error[200],
  },
  emergencyButtonText: {
    color: MedicalTheme.colors.error[700],
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    fontSize: MedicalTheme.typography.fontSize.sm,
    marginLeft: MedicalTheme.spacing[1],
  },
  searchContainer: {
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderRadius: MedicalTheme.borderRadius.lg,
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingVertical: MedicalTheme.spacing[2],
    marginTop: MedicalTheme.spacing[2],
  },
  searchInput: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.primary,
    padding: 0,
  },
  hidden: {
    display: 'none',
  },
   markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.primary[50],
    paddingHorizontal: MedicalTheme.spacing[3],
    paddingVertical: MedicalTheme.spacing[2],
    borderRadius: MedicalTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.primary[200],
  },
  markButtonText: {
    color: MedicalTheme.colors.primary[700],
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    fontSize: MedicalTheme.typography.fontSize.sm,
    marginLeft: MedicalTheme.spacing[1],
    marginRight: MedicalTheme.spacing[1],
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  dropdownContainer: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[2],
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: MedicalTheme.spacing[2],
    paddingHorizontal: MedicalTheme.spacing[3],
    borderRadius: MedicalTheme.borderRadius.md,
  },
  dropdownItemSelected: {
    backgroundColor: MedicalTheme.colors.primary[50],
  },
  dropdownItemText: {
    flex: 1,
    marginLeft: MedicalTheme.spacing[2],
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.primary,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
  },
});

