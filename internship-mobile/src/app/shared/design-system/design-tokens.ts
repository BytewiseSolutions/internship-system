// Mobile Design System Tokens
// Step 2: Week 5-6 - Design Foundation (Mobile)

export const MobileDesignTokens = {
  // Color Palette (same as web for consistency)
  colors: {
    primary: {
      50: '#e8f5e8',
      100: '#c8e6c8',
      200: '#a5d6a5',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50',
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20'
    },
    
    secondary: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800',
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100'
    },
    
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      1000: '#000000'
    },
    
    success: { light: '#81c784', main: '#4caf50', dark: '#388e3c' },
    warning: { light: '#ffb74d', main: '#ff9800', dark: '#f57c00' },
    error: { light: '#e57373', main: '#f44336', dark: '#d32f2f' },
    info: { light: '#64b5f6', main: '#2196f3', dark: '#1976d2' }
  },
  
  // Mobile-specific spacing (larger touch targets)
  spacing: {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48   // 48px
  },
  
  // Mobile typography
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Poppins, Inter, sans-serif'
    },
    
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  // Mobile border radius
  borderRadius: {
    sm: 4,
    base: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999
  },
  
  // Mobile shadows (Ionic compatible)
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    base: '0 2px 4px rgba(0, 0, 0, 0.12)',
    md: '0 4px 8px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.15)'
  }
};

// Mobile Theme Configuration
export const MobileLightTheme = {
  background: {
    primary: MobileDesignTokens.colors.neutral[0],
    secondary: MobileDesignTokens.colors.neutral[50],
    tertiary: MobileDesignTokens.colors.neutral[100]
  },
  text: {
    primary: MobileDesignTokens.colors.neutral[900],
    secondary: MobileDesignTokens.colors.neutral[700],
    tertiary: MobileDesignTokens.colors.neutral[600]
  },
  border: MobileDesignTokens.colors.neutral[300]
};

export const MobileDarkTheme = {
  background: {
    primary: MobileDesignTokens.colors.neutral[900],
    secondary: MobileDesignTokens.colors.neutral[800],
    tertiary: MobileDesignTokens.colors.neutral[700]
  },
  text: {
    primary: MobileDesignTokens.colors.neutral[50],
    secondary: MobileDesignTokens.colors.neutral[300],
    tertiary: MobileDesignTokens.colors.neutral[400]
  },
  border: MobileDesignTokens.colors.neutral[600]
};