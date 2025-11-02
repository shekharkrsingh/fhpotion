import { MedicalTheme } from '@/newConstants/theme';
import { StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: MedicalTheme.spacing[4],
    paddingVertical: MedicalTheme.spacing[3],
    backgroundColor: MedicalTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  headerTitle: {
    fontSize: MedicalTheme.typography.fontSize['2xl'],
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
  },
  markAllRead: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.primary[500],
  },
  notificationList: {
    padding: MedicalTheme.spacing[4],
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[4],
    marginBottom: MedicalTheme.spacing[3],
    alignItems: 'flex-start',
    backgroundColor: MedicalTheme.colors.background.primary,
    ...MedicalTheme.shadow.card,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: MedicalTheme.spacing[3],
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: MedicalTheme.spacing[1],
  },
  notificationTitle: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    flex: 1,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: MedicalTheme.spacing[2],
    marginTop: MedicalTheme.spacing[0.5],
  },
  notificationMessage: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    marginBottom: MedicalTheme.spacing[1],
    color: MedicalTheme.colors.text.secondary,
  },
  notificationTime: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.text.tertiary,
  },
});