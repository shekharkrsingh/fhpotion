// app/(tabs)/components/StatsCards.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: MedicalTheme.spacing[8],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MedicalTheme.spacing[4],
  },
});