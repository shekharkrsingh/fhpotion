import { MedicalTheme } from '@/newConstants/theme';
import { StyleSheet } from 'react-native';

export const appointmentCardStyles = StyleSheet.create({
  container: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius.xl,
    paddingVertical: MedicalTheme.spacing[1],
    paddingRight: MedicalTheme.spacing[4],
    paddingLeft: MedicalTheme.spacing[1],
    marginBottom: MedicalTheme.spacing[1.5],
    marginHorizontal: MedicalTheme.spacing[3],
    ...MedicalTheme.shadow.card,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  availabilityContainer: {
    alignItems: 'center',
    width: 80,
  },
  availabilityText: {
    fontSize: MedicalTheme.typography.fontSize.xxs,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    marginTop: MedicalTheme.spacing[1],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: MedicalTheme.colors.primary[100],
  },
  nameContainer: {
    flex: 1,
    marginHorizontal: MedicalTheme.spacing[3],
  },
  name: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: MedicalTheme.spacing[3],
    paddingVertical: MedicalTheme.spacing[.5],
    borderRadius: MedicalTheme.borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: MedicalTheme.spacing[1],
  },
  statusText: {
    fontSize: MedicalTheme.typography.fontSize.xxs,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.inverse,
  },
  treatedButton: {
    padding: MedicalTheme.spacing[1],
    borderRadius: MedicalTheme.borderRadius.full,
  },
  detailsContainer: {
    padding: MedicalTheme.spacing[4],
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: MedicalTheme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  detailIcon: {
    marginRight: MedicalTheme.spacing[3],
    width: 24,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    width: 100,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.primary,
    flex: 1,
    fontWeight: MedicalTheme.typography.fontWeight.normal,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: MedicalTheme.spacing[4],
  },
  actionButton: {
    paddingVertical: MedicalTheme.spacing[2],
    paddingHorizontal: MedicalTheme.spacing[4],
    borderRadius: MedicalTheme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionButtonText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
  },
});