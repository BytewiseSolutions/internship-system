// Design System Tokens
// Step 2: Week 5-6 - Design Foundation

export const DesignTokens = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      50: '#e8f5e8',
      100: '#c8e6c8',
      200: '#a5d6a5',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50', // Main primary
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32', // Current primary
      900: '#1b5e20'
    },
    
    // Secondary Colors
    secondary: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800', // Main secondary
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100'
    },
    
    // Neutral Colors
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
    
    // Semantic Colors
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c'
    },
    
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00'
    },
    
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f'
    },
    
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2'
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      secondary: "'Poppins', 'Inter', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem'      // 96px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-Index
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
    tooltip: 1800
  }
};

// Theme Configuration
export const LightTheme = {
  background: {
    primary: DesignTokens.colors.neutral[0],
    secondary: DesignTokens.colors.neutral[50],
    tertiary: DesignTokens.colors.neutral[100]
  },
  text: {
    primary: DesignTokens.colors.neutral[900],
    secondary: DesignTokens.colors.neutral[700],
    tertiary: DesignTokens.colors.neutral[600]
  },
  border: DesignTokens.colors.neutral[300]
};

export const DarkTheme = {
  background: {
    primary: DesignTokens.colors.neutral[900],
    secondary: DesignTokens.colors.neutral[800],
    tertiary: DesignTokens.colors.neutral[700]
  },
  text: {
    primary: DesignTokens.colors.neutral[50],
    secondary: DesignTokens.colors.neutral[300],
    tertiary: DesignTokens.colors.neutral[400]
  },
  border: DesignTokens.colors.neutral[600]
};