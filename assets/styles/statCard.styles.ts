// app/(tabs)/components/StatCard.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '47%',
    borderRadius: MedicalTheme.borderRadius['2xl'],
    padding: MedicalTheme.spacing[5],
    ...MedicalTheme.shadow.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: MedicalTheme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[3],
  },
  value: {
    fontSize: MedicalTheme.typography.fontSize['3xl'],
    color: 'white',
    fontWeight: '700',
    marginBottom: MedicalTheme.spacing[1],
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: MedicalTheme.spacing[1],
    fontWeight: '600',
  },
  subtitle: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
  decoration: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.5,
  },
});