// In your splashScreen.styles.ts
import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.background.primary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[8],
  },
  logo: {
    width: 120,
    height: 120,
  },
  loadingBarContainer: {
    width: '60%',
    height: 4,
    backgroundColor: MedicalTheme.colors.neutral[200],
    borderRadius: MedicalTheme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: MedicalTheme.spacing[8],
  },
  loadingBar: {
    height: '100%',
    borderRadius: MedicalTheme.borderRadius.full,
  },
  brandContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: MedicalTheme.spacing[12],
  },
  brandMark: {
    width: 32,
    height: 32,
    marginBottom: MedicalTheme.spacing[2],
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
    color: MedicalTheme.colors.text.secondary,
    letterSpacing: MedicalTheme.typography.letterSpacing.wide,
  },
});