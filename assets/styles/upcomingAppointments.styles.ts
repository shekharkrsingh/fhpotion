// app/(tabs)/components/UpcomingAppointments.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius['2xl'],
    padding: MedicalTheme.spacing[6],
    marginBottom: MedicalTheme.spacing[8],
    ...MedicalTheme.shadow.lg,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[5],
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: '600',
    color: MedicalTheme.colors.text.primary,
  },
  viewAll: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: '500',
    color: MedicalTheme.colors.primary[500],
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: MedicalTheme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  timeContainer: {
    backgroundColor: MedicalTheme.colors.primary[50],
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[3],
    marginRight: MedicalTheme.spacing[4],
    alignItems: 'center',
    minWidth: 70,
  },
  timeText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: MedicalTheme.colors.primary[600],
  },
  dateText: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.primary[400],
    marginTop: MedicalTheme.spacing[0.5],
  },
  infoContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: '600',
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[0.5],
  },
  appointmentType: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: MedicalTheme.spacing[8],
  },
  emptyText: {
    marginTop: MedicalTheme.spacing[2],
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.secondary,
  },
});