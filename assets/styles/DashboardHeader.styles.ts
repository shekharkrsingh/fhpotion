// app/(tabs)/components/DashboardHeader.styles.ts
import { StyleSheet, Platform } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingVertical: MedicalTheme.spacing[4],
    backgroundColor: MedicalTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
    marginBottom: MedicalTheme.spacing[4],
    ...Platform.select({
      ios: {
        shadowColor: MedicalTheme.colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
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