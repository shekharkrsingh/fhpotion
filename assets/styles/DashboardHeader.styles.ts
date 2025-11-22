// app/(tabs)/components/DashboardHeader.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: MedicalTheme.spacing[6],
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    color: MedicalTheme.colors.text.secondary,
    marginBottom: MedicalTheme.spacing[1],
    fontWeight: MedicalTheme.typography.fontWeight.normal,
  },
  doctorName: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
  },
  notificationButton: {
    position: 'relative',
    padding: MedicalTheme.spacing[2],
  },
  notificationBadge: {
    position: 'absolute',
    right: MedicalTheme.spacing[2],
    top: MedicalTheme.spacing[2],
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MedicalTheme.colors.error[500],
  },
});