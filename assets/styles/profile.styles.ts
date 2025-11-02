import { MedicalTheme } from '@/newConstants/theme';
import { StyleSheet, Platform } from 'react-native';

export const profileStyles = StyleSheet.create({
  // ===== LAYOUT STYLES =====
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.colors.background.secondary,
  },
  scrollContainer: {
    paddingBottom: MedicalTheme.spacing[8],
  },

  // ===== COVER SECTION =====
  coverContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  coverPhoto: {
    height: '100%',
    width: '100%',
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },

  // ===== NAVIGATION =====
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? MedicalTheme.spacing[12] : MedicalTheme.spacing[10],
    left: MedicalTheme.spacing[4],
    width: 40,
    height: 40,
    borderRadius: MedicalTheme.borderRadius.full,
    backgroundColor: MedicalTheme.colors.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: MedicalTheme.colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  // ===== PROFILE HEADER =====
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: MedicalTheme.spacing[6],
    paddingVertical: MedicalTheme.spacing[4],
    marginTop: -70,
    backgroundColor: MedicalTheme.colors.background.primary,
    marginHorizontal: MedicalTheme.spacing[4],
    borderRadius: MedicalTheme.borderRadius['2xl'],
    ...MedicalTheme.shadow.lg,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: MedicalTheme.spacing[4],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: MedicalTheme.borderRadius.full,
    borderWidth: 4,
    borderColor: MedicalTheme.colors.background.primary,
    backgroundColor: MedicalTheme.colors.neutral[100],
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: MedicalTheme.spacing[2],
    right: MedicalTheme.spacing[2],
    width: 16,
    height: 16,
    borderRadius: MedicalTheme.borderRadius.full,
    backgroundColor: MedicalTheme.colors.success[500],
    borderWidth: 2,
    borderColor: MedicalTheme.colors.background.primary,
  },

  // ===== BASIC INFO =====
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[1],
  },
  name: {
    fontSize: MedicalTheme.typography.fontSize['xl'],
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
    marginRight: MedicalTheme.spacing[1],
  },
  specialization: {
    fontSize: MedicalTheme.typography.fontSize.xs,
    color: MedicalTheme.colors.primary[500],
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginBottom: MedicalTheme.spacing[2],
  },
  experienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: MedicalTheme.spacing[3],
    paddingVertical: MedicalTheme.spacing[1],
    borderRadius: MedicalTheme.borderRadius.lg,
    marginTop: MedicalTheme.spacing[1],
    backgroundColor: MedicalTheme.colors.primary[500],
  },
  experienceText: {
    fontSize: MedicalTheme.typography.fontSize.xxs,
    color: MedicalTheme.colors.text.inverse,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginLeft: MedicalTheme.spacing[1],
  },

  // ===== ACTION BUTTONS =====
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: MedicalTheme.spacing[6],
    marginVertical: MedicalTheme.spacing[3],
    gap: MedicalTheme.spacing[3],
  },
  button: {
    flex: 1,
    borderRadius: MedicalTheme.borderRadius.lg,
    overflow: 'hidden',
    ...MedicalTheme.shadow.md,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: MedicalTheme.spacing[2.5],
    paddingHorizontal: MedicalTheme.spacing[1.5],
  },
  buttonText: {
    color: MedicalTheme.colors.text.inverse,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    marginLeft: MedicalTheme.spacing[1],
    fontSize: MedicalTheme.typography.fontSize.sm,
  },

  // ===== DETAILS CONTAINER =====
  detailsContainer: {
    paddingHorizontal: MedicalTheme.spacing[4],
  },

  // ===== SECTION STYLES =====
  section: {
    marginBottom: MedicalTheme.spacing[5],
    backgroundColor: MedicalTheme.colors.background.primary,
    borderRadius: MedicalTheme.borderRadius.xl,
    padding: MedicalTheme.spacing[5],
    ...MedicalTheme.shadow.sm,
    borderWidth: 1,
    borderColor: MedicalTheme.colors.border.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[4],
  },
  sectionTitle: {
    fontSize: MedicalTheme.typography.fontSize.lg,
    fontWeight: MedicalTheme.typography.fontWeight.bold,
    color: MedicalTheme.colors.text.primary,
    marginLeft: MedicalTheme.spacing[2],
  },
  sectionContent: {
    fontSize: MedicalTheme.typography.fontSize.base,
    color: MedicalTheme.colors.text.secondary,
  },

  // ===== INFO CONTAINER =====
  infoContainer: {
    backgroundColor: MedicalTheme.colors.background.secondary,
    borderRadius: MedicalTheme.borderRadius.lg,
    padding: MedicalTheme.spacing[1],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: MedicalTheme.spacing[3],
    paddingHorizontal: MedicalTheme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: MedicalTheme.colors.border.light,
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: MedicalTheme.borderRadius.lg,
    backgroundColor: MedicalTheme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: MedicalTheme.spacing[3],
  },
  infoText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    flex: 1,
    fontWeight: MedicalTheme.typography.fontWeight.medium,
  },

  // ===== PROFESSIONAL INFO =====
  professionalInfo: {
    gap: MedicalTheme.spacing[4],
  },
  listContainer: {
    gap: MedicalTheme.spacing[2],
  },
  listTitle: {
    fontSize: MedicalTheme.typography.fontSize.base,
    fontWeight: MedicalTheme.typography.fontWeight.semibold,
    color: MedicalTheme.colors.text.primary,
    marginBottom: MedicalTheme.spacing[1],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: MedicalTheme.spacing[1],
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: MedicalTheme.borderRadius.full,
    backgroundColor: MedicalTheme.colors.primary[500],
    marginTop: MedicalTheme.spacing[2],
    marginRight: MedicalTheme.spacing[3],
  },
  listText: {
    fontSize: MedicalTheme.typography.fontSize.sm,
    color: MedicalTheme.colors.text.secondary,
    flex: 1,
  },

  // ===== LOADING & STATES =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MedicalTheme.colors.background.secondary,
  },

  // ===== EMPTY SCREEN STYLES (for inline usage) =====
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: MedicalTheme.borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: MedicalTheme.spacing[4],
  },
});

// Utility functions for theme-based styling
export const ProfileStyleUtils = {
  // Get experience badge color based on years
  getExperienceColor: (years: number): string => {
    if (years >= 20) return MedicalTheme.colors.warning[600];
    if (years >= 10) return MedicalTheme.colors.secondary[500];
    if (years >= 5) return MedicalTheme.colors.primary[500];
    return MedicalTheme.colors.success[500];
  },

  // Get button gradient colors based on type
  getButtonGradient: (buttonId: string): string[] => {
    const gradients = {
      edit: [MedicalTheme.colors.primary[500], MedicalTheme.colors.primary[600]],
      settings: [MedicalTheme.colors.secondary[500], MedicalTheme.colors.secondary[600]],
      book: [MedicalTheme.colors.success[500], MedicalTheme.colors.success[600]],
    };
    return gradients[buttonId as keyof typeof gradients] || gradients.edit;
  },

  // Get section icon color
  getSectionIconColor: (): string => MedicalTheme.colors.primary[500],

  // Get info icon background color
  getInfoIconBackground: (): string => MedicalTheme.colors.primary[50],
};

// Type definitions for better TypeScript support
export type ProfileStyles = typeof profileStyles;
export type ProfileStyleUtils = typeof ProfileStyleUtils;