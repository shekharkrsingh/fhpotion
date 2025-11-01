import { StyleSheet } from 'react-native';
import { MedicalTheme } from '@/newConstants/theme';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.overlay.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: MedicalTheme.spacing[9],
  },
  popupContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius.xl,
    padding: MedicalTheme.spacing[4],
    ...MedicalTheme.shadow.xl,
  },
  iconContainer: {
    position: 'absolute',
    top: MedicalTheme.spacing[4],
    right: MedicalTheme.spacing[4],
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: MedicalTheme.typography.fontSize.xl,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[1],
    marginTop: MedicalTheme.spacing[1],
    textAlign: 'center',
    paddingHorizontal: MedicalTheme.spacing[3],
    paddingRight: MedicalTheme.spacing[8], // Extra space for icon
  },
  message: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: MedicalTheme.spacing[4],
    paddingHorizontal: MedicalTheme.spacing[1],
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  singleButtonContainer: {
    justifyContent: 'flex-end',
  },
  dualButtonsContainer: {
    justifyContent: 'flex-end',
    gap: MedicalTheme.spacing[3],
  },
  primaryButton: {
    borderRadius: MedicalTheme.borderRadius.lg,
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[6],
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  secondaryButton: {
    backgroundColor: MedicalTheme.colors.background.primary,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.medium,
    borderRadius: MedicalTheme.borderRadius.lg,
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[6],
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  primaryButtonText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.inverse,
    textAlign: 'center',
  },
  secondaryButtonText: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default styles;