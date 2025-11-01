// theme/index.ts - Complete Professional Medical Theme
export const MedicalTheme = {
  // ===== COLOR SYSTEM =====
  colors: {
    // Primary Brand Colors (Medical Blue)
    primary: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#0EA5E9', // Main brand color - Trustworthy blue
      600: '#0284C7',
      700: '#0369A1',
      800: '#075985',
      900: '#0C4A6E',
    } as const,

    // Secondary Colors (Professional Teal)
    secondary: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6', // Complementary teal
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    } as const,

    // Neutral Colors (Professional Gray Scale)
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    } as const,

    // Semantic Colors
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E', // Success green
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    } as const,

    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Warning amber
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    } as const,

    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444', // Error red
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    } as const,

    // Medical Specific Colors
    medical: {
      stethoscope: '#0EA5E9',
      heartbeat: '#EF4444',
      prescription: '#8B5CF6',
      lab: '#10B981',
      emergency: '#DC2626',
      wellness: '#22C55E',
    } as const,

    // Background Colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      inverse: '#0F172A',
    } as const,

    // Text Colors
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#64748B',
      inverse: '#FFFFFF',
      disabled: '#94A3B8',
      success: '#15803D',
      warning: '#B45309',
      error: '#B91C1C',
    } as const,

    // Border Colors
    border: {
      light: '#E2E8F0',
      medium: '#CBD5E1',
      dark: '#94A3B8',
      focus: '#0EA5E9',
      error: '#EF4444',
    } as const,

    // Overlay Colors
    overlay: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(15, 23, 42, 0.6)',
      backdrop: 'rgba(15, 23, 42, 0.4)',
    } as const,
  },

  // ===== TYPOGRAPHY SYSTEM =====
  typography: {
    // Font Families
    fontFamily: {
      primary: 'System',
      monospace: 'Courier New',
    } as const,

    // Font Sizes (px)
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    } as const,

    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    } as const,

    // Font Weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    } as const,

    // Letter Spacing
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    } as const,

    // Text Styles
    text: {
      // Headings
      heading1: {
        fontSize: '3xl',
        fontWeight: 'bold',
        lineHeight: 'tight',
        letterSpacing: 'tight',
        color: 'primary',
      } as const,
      heading2: {
        fontSize: '2xl',
        fontWeight: 'semibold',
        lineHeight: 'tight',
        letterSpacing: 'tight',
        color: 'primary',
      } as const,
      heading3: {
        fontSize: 'xl',
        fontWeight: 'semibold',
        lineHeight: 'tight',
        color: 'primary',
      } as const,
      heading4: {
        fontSize: 'lg',
        fontWeight: 'semibold',
        lineHeight: 'normal',
        color: 'primary',
      } as const,

      // Body Text
      bodyLarge: {
        fontSize: 'lg',
        fontWeight: 'normal',
        lineHeight: 'relaxed',
        color: 'primary',
      } as const,
      body: {
        fontSize: 'base',
        fontWeight: 'normal',
        lineHeight: 'normal',
        color: 'primary',
      } as const,
      bodySmall: {
        fontSize: 'sm',
        fontWeight: 'normal',
        lineHeight: 'normal',
        color: 'secondary',
      } as const,

      // Captions
      caption: {
        fontSize: 'sm',
        fontWeight: 'normal',
        lineHeight: 'normal',
        color: 'tertiary',
      } as const,
      captionSmall: {
        fontSize: 'xs',
        fontWeight: 'normal',
        lineHeight: 'normal',
        color: 'tertiary',
      } as const,
      captionMicro: {
        fontSize: 10,
        fontWeight: 'medium',
        lineHeight: 'tight',
        color: 'tertiary',
        letterSpacing: 'wide',
      } as const,

      // Interactive Text
      buttonLarge: {
        fontSize: 'lg',
        fontWeight: 'semibold',
        lineHeight: 'normal',
        color: 'inverse',
      } as const,
      button: {
        fontSize: 'base',
        fontWeight: 'semibold',
        lineHeight: 'normal',
        color: 'inverse',
      } as const,
      buttonSmall: {
        fontSize: 'sm',
        fontWeight: 'semibold',
        lineHeight: 'normal',
        color: 'inverse',
      } as const,
      link: {
        fontSize: 'base',
        fontWeight: 'medium',
        lineHeight: 'normal',
        color: 'primary.500',
      } as const,

      // Medical Specific
      patientName: {
        fontSize: 'xl',
        fontWeight: 'semibold',
        lineHeight: 'tight',
        color: 'primary',
      } as const,
      medicalValue: {
        fontSize: '2xl',
        fontWeight: 'bold',
        lineHeight: 'tight',
        color: 'primary',
      } as const,
      dosage: {
        fontSize: 'base',
        fontWeight: 'medium',
        lineHeight: 'normal',
        fontFamily: 'monospace',
        color: 'primary',
      } as const,
    },
  },

  // ===== SPACING SYSTEM =====
  spacing: {
    // Base unit: 4px
    px: 1,
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
  } as const,

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  } as const,

  // ===== SHADOWS & ELEVATION =====
  shadow: {
    // iOS Shadows
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    } as const,
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    } as const,
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    } as const,
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    } as const,

    // Medical Specific
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    } as const,
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    } as const,
  },

  // ===== COMPONENT THEMES =====
  components: {
    // Button Styles
    button: {
      // Primary Button
      primary: {
        container: {
          backgroundColor: 'primary.500',
          paddingVertical: 'spacing.3',
          paddingHorizontal: 'spacing.6',
          borderRadius: 'borderRadius.lg',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          minHeight: 44,
        },
        text: {
          variant: 'text.button',
          color: 'text.inverse',
        },
        states: {
          pressed: {
            backgroundColor: 'primary.600',
            transform: [{ scale: 0.98 }],
          },
          disabled: {
            backgroundColor: 'neutral.300',
            opacity: 0.6,
          },
          loading: {
            opacity: 0.7,
          },
        },
      } as const,

      // Secondary Button
      secondary: {
        container: {
          backgroundColor: 'transparent',
          paddingVertical: 'spacing.3',
          paddingHorizontal: 'spacing.6',
          borderRadius: 'borderRadius.lg',
          borderWidth: 2,
          borderColor: 'primary.500',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          minHeight: 44,
        },
        text: {
          variant: 'text.button',
          color: 'primary.500',
        },
        states: {
          pressed: {
            backgroundColor: 'primary.50',
            borderColor: 'primary.600',
          },
          disabled: {
            borderColor: 'neutral.300',
            opacity: 0.6,
          },
        },
      } as const,

      // Ghost Button
      ghost: {
        container: {
          backgroundColor: 'transparent',
          paddingVertical: 'spacing.2',
          paddingHorizontal: 'spacing.4',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          minHeight: 40,
        },
        text: {
          variant: 'text.buttonSmall',
          color: 'primary.500',
        },
        states: {
          pressed: {
            backgroundColor: 'primary.50',
          },
          disabled: {
            opacity: 0.5,
          },
        },
      } as const,

      // Danger Button
      danger: {
        container: {
          backgroundColor: 'error.500',
          paddingVertical: 'spacing.3',
          paddingHorizontal: 'spacing.6',
          borderRadius: 'borderRadius.lg',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          minHeight: 44,
        },
        text: {
          variant: 'text.button',
          color: 'text.inverse',
        },
        states: {
          pressed: {
            backgroundColor: 'error.600',
          },
          disabled: {
            backgroundColor: 'neutral.300',
            opacity: 0.6,
          },
        },
      } as const,

      // Sizes
      sizes: {
        small: {
          paddingVertical: 'spacing.2',
          paddingHorizontal: 'spacing.4',
          minHeight: 36,
          text: 'text.buttonSmall',
        } as const,
        medium: {
          paddingVertical: 'spacing.3',
          paddingHorizontal: 'spacing.6',
          minHeight: 44,
          text: 'text.button',
        } as const,
        large: {
          paddingVertical: 'spacing.4',
          paddingHorizontal: 'spacing.8',
          minHeight: 52,
          text: 'text.buttonLarge',
        } as const,
      },
    },

    // Input Styles
    input: {
      default: {
        container: {
          backgroundColor: 'background.primary',
          borderWidth: 1,
          borderColor: 'border.medium',
          borderRadius: 'borderRadius.md',
          paddingVertical: 'spacing.3',
          paddingHorizontal: 'spacing.4',
          minHeight: 48,
        },
        text: {
          variant: 'text.body',
          color: 'text.primary',
        },
        placeholder: {
          color: 'text.tertiary',
        },
        label: {
          variant: 'text.bodySmall',
          color: 'text.secondary',
          marginBottom: 'spacing.2',
        },
        states: {
          focused: {
            borderColor: 'border.focus',
            shadow: 'shadow.sm',
          },
          error: {
            borderColor: 'border.error',
          },
          disabled: {
            backgroundColor: 'background.tertiary',
            borderColor: 'border.light',
            opacity: 0.6,
          },
        },
      } as const,

      search: {
        container: {
          backgroundColor: 'background.secondary',
          borderRadius: 'borderRadius.lg',
          paddingVertical: 'spacing.2.5',
          paddingHorizontal: 'spacing.4',
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          minHeight: 44,
        },
        icon: {
          marginRight: 'spacing.2',
          color: 'text.tertiary',
        },
      } as const,

      medical: {
        container: {
          backgroundColor: 'background.primary',
          borderWidth: 1,
          borderColor: 'border.medium',
          borderRadius: 'borderRadius.md',
          paddingVertical: 'spacing.3',
          paddingHorizontal: 'spacing.4',
          minHeight: 52,
        },
        text: {
          variant: 'text.dosage',
          color: 'text.primary',
        },
      } as const,
    },

    // Card Styles
    card: {
      default: {
        container: {
          backgroundColor: 'background.primary',
          borderRadius: 'borderRadius.xl',
          padding: 'spacing.4',
          shadow: 'shadow.card',
        },
      } as const,
      elevated: {
        container: {
          backgroundColor: 'background.primary',
          borderRadius: 'borderRadius.xl',
          padding: 'spacing.6',
          shadow: 'shadow.lg',
        },
      } as const,
      outlined: {
        container: {
          backgroundColor: 'background.primary',
          borderRadius: 'borderRadius.xl',
          padding: 'spacing.4',
          borderWidth: 1,
          borderColor: 'border.light',
        },
      } as const,
      medical: {
        container: {
          backgroundColor: 'background.primary',
          borderRadius: 'borderRadius.xl',
          padding: 'spacing.5',
          shadow: 'shadow.card',
          borderLeftWidth: 4,
          borderLeftColor: 'primary.500',
        },
      } as const,
    },

    // Appointment Specific Components
    appointment: {
      status: {
        scheduled: {
          backgroundColor: 'primary.50',
          textColor: 'primary.700',
          borderColor: 'primary.200',
        } as const,
        confirmed: {
          backgroundColor: 'success.50',
          textColor: 'success.700',
          borderColor: 'success.200',
        } as const,
        inProgress: {
          backgroundColor: 'warning.50',
          textColor: 'warning.700',
          borderColor: 'warning.200',
        } as const,
        completed: {
          backgroundColor: 'neutral.100',
          textColor: 'neutral.700',
          borderColor: 'neutral.300',
        } as const,
        cancelled: {
          backgroundColor: 'error.50',
          textColor: 'error.700',
          borderColor: 'error.200',
        } as const,
        noShow: {
          backgroundColor: 'neutral.200',
          textColor: 'neutral.800',
          borderColor: 'neutral.400',
        } as const,
      } as const,

      priority: {
        low: {
          color: 'success.500',
          backgroundColor: 'success.50',
        } as const,
        medium: {
          color: 'warning.500',
          backgroundColor: 'warning.50',
        } as const,
        high: {
          color: 'error.500',
          backgroundColor: 'error.50',
        } as const,
        emergency: {
          color: 'error.600',
          backgroundColor: 'error.100',
        } as const,
      } as const,

      card: {
        container: {
          backgroundColor: 'background.primary',
          borderRadius: 'borderRadius.xl',
          padding: 'spacing.4',
          shadow: 'shadow.card',
          borderLeftWidth: 4,
        },
        header: {
          flexDirection: 'row' as const,
          justifyContent: 'space-between' as const,
          alignItems: 'flex-start' as const,
          marginBottom: 'spacing.3',
        },
        timeSlot: {
          backgroundColor: 'primary.50',
          paddingVertical: 'spacing.1',
          paddingHorizontal: 'spacing.2',
          borderRadius: 'borderRadius.sm',
        },
      } as const,
    },

    // Medical Indicators
    medical: {
      patientAvatar: {
        container: {
          width: 56,
          height: 56,
          borderRadius: 'borderRadius.full',
          backgroundColor: 'primary.100',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
        },
        text: {
          variant: 'text.body',
          fontWeight: 'semibold',
          color: 'primary.600',
        },
        sizes: {
          small: { width: 40, height: 40 },
          medium: { width: 56, height: 56 },
          large: { width: 72, height: 72 },
        },
      } as const,

      vitalSign: {
        normal: {
          color: 'success.500',
          backgroundColor: 'success.50',
        } as const,
        warning: {
          color: 'warning.500',
          backgroundColor: 'warning.50',
        } as const,
        critical: {
          color: 'error.500',
          backgroundColor: 'error.50',
        } as const,
      } as const,

      badge: {
        container: {
          paddingVertical: 'spacing.1',
          paddingHorizontal: 'spacing.2',
          borderRadius: 'borderRadius.full',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
        },
        text: {
          variant: 'text.captionMicro',
          fontWeight: 'medium',
        },
      } as const,
    },

    // Navigation Components
    navigation: {
      tabBar: {
        container: {
          backgroundColor: 'background.primary',
          borderTopWidth: 1,
          borderTopColor: 'border.light',
          paddingBottom: 'spacing.4',
          paddingTop: 'spacing.2',
        },
        item: {
          flex: 1,
          alignItems: 'center' as const,
          paddingVertical: 'spacing.2',
        },
        icon: {
          size: 24,
          activeColor: 'primary.500',
          inactiveColor: 'neutral.400',
        },
        label: {
          variant: 'text.captionSmall',
          marginTop: 'spacing.1',
        },
      } as const,

      header: {
        container: {
          backgroundColor: 'background.primary',
          borderBottomWidth: 1,
          borderBottomColor: 'border.light',
          paddingHorizontal: 'spacing.4',
          paddingVertical: 'spacing.3',
        },
        medical: {
          container: {
            backgroundColor: 'primary.500',
            borderBottomWidth: 0,
          },
        } as const,
      } as const,
    },
  },

  // ===== LAYOUT CONSTANTS =====
  layout: {
    // Screen Layouts
    screen: {
      padding: 'spacing.4',
      margin: 'spacing.4',
      maxWidth: 1200,
    } as const,

    // Container Sizes
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    } as const,

    // Z-index Scale
    zIndex: {
      hide: -1,
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800,
    } as const,

    // Breakpoints (for responsive design)
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    } as const,
  },

  // ===== ANIMATION CONSTANTS =====
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    } as const,
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    } as const,
    scale: {
      pressed: 0.98,
      hover: 1.02,
    } as const,
  },

  // ===== ACCESSIBILITY =====
  accessibility: {
    // Minimum touch target size
    minTouchTarget: 44,
    
    // Focus rings
    focusRing: {
      width: 2,
      offset: 2,
      color: 'primary.500',
    } as const,

    // Screen reader only
    srOnly: {
      position: 'absolute',
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap' as const,
      borderWidth: 0,
    } as const,
  },
} as const;

// ===== TYPE DEFINITIONS =====
export type Theme = typeof MedicalTheme;
export type ColorPalette = keyof typeof MedicalTheme.colors;
export type SpacingScale = keyof typeof MedicalTheme.spacing;
export type BorderRadiusScale = keyof typeof MedicalTheme.borderRadius;
export type TypographyVariant = keyof typeof MedicalTheme.typography.text;

// ===== THEME HOOK =====
export const useTheme = () => {
  return MedicalTheme;
};

// ===== UTILITY FUNCTIONS =====
export const ThemeUtils = {
  // Get spacing value
  spacing: (value: SpacingScale): number => {
    return MedicalTheme.spacing[value];
  },

  // Get color value
  color: (path: string): string => {
    const [category, shade] = path.split('.');
    return (MedicalTheme.colors as any)[category]?.[shade] || path;
  },

  // Get typography style
  text: (variant: TypographyVariant) => {
    return MedicalTheme.typography.text[variant];
  },

  // Create responsive style
  responsive: (breakpoint: keyof typeof MedicalTheme.layout.breakpoints, styles: any) => {
    return {
      [`@media (min-width: ${MedicalTheme.layout.breakpoints[breakpoint]}px)`]: styles,
    };
  },

  // Create animation
  animation: (
    property: string,
    duration: keyof typeof MedicalTheme.animation.duration = 'normal',
    easing: keyof typeof MedicalTheme.animation.easing = 'easeInOut'
  ) => ({
    transitionProperty: property,
    transitionDuration: `${MedicalTheme.animation.duration[duration]}ms`,
    transitionTimingFunction: MedicalTheme.animation.easing[easing],
  }),
};

export default MedicalTheme;