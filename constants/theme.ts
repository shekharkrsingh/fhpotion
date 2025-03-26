export const primaryColors = {
    primary: '#2D7FF9',
    primaryDark: '#1A5DC6',
    primaryLight: '#E6F0FF',
  };
  
  export const secondaryColors = {
    secondary: '#4ECDC4',
    success: '#38A169',
    warning: '#DD6B20',
    danger: '#E53E3E',
    info: '#3182CE',
  };
  
  export const neutralColors = {
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F8FAFC',
    gray200: '#EDF2F7',
    gray300: '#E2E8F0',
    gray400: '#CBD5E0',
    gray500: '#A0AEC0',
    gray600: '#718096',
    gray700: '#4A5568',
    gray800: '#2D3748',
    gray900: '#1A202C',
  };
  
  export const semanticColors = {
    appointmentBooked: '#4A90E2',
    appointmentCompleted: '#38A169',
    appointmentCancelled: '#E53E3E',
    appointmentPending: '#F5A623',
    emergency: '#F56565',
    prescription: '#9F7AEA',
  };
  
  export const AppTheme = {
    colors: {
      ...primaryColors,
      ...secondaryColors,
      ...neutralColors,
      ...semanticColors,
      button: {
        primaryBg: primaryColors.primary,
        primaryText: neutralColors.white,
        secondaryBg: neutralColors.white,
        secondaryText: primaryColors.primary,
        disabledBg: neutralColors.gray300,
        disabledText: neutralColors.gray500,
      },
      input: {
        border: neutralColors.gray300,
        borderFocused: primaryColors.primary,
        placeholder: neutralColors.gray500,
        text: neutralColors.gray800,
        background: neutralColors.white,
      },
      card: {
        background: neutralColors.white,
        shadow: 'rgba(0, 0, 0, 0.05)',
        border: neutralColors.gray200,
      },
      statusBar: {
        background: primaryColors.primary,
        content: 'light-content',
      },
      navigation: {
        background: neutralColors.white,
        text: neutralColors.gray800,
        active: primaryColors.primary,
        inactive: neutralColors.gray500,
      },
    },
    typography: {
      heading1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: neutralColors.gray900,
      },
      heading2: {
        fontSize: 24,
        fontWeight: '600',
        color: neutralColors.gray800,
      },
      heading3: {
        fontSize: 20,
        fontWeight: '600',
        color: neutralColors.gray800,
      },
      body: {
        fontSize: 16,
        color: neutralColors.gray700,
      },
      caption: {
        fontSize: 14,
        color: neutralColors.gray600,
      },
      button: {
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      xxl: 24,
      full: 100,
    },
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      },
    },
  };
  