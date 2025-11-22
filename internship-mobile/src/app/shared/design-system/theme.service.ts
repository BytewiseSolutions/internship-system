import { Injectable, signal } from '@angular/core';
import { MobileDesignTokens, MobileLightTheme, MobileDarkTheme } from './design-tokens';

export type MobileTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class MobileThemeService {
  private currentTheme = signal<MobileTheme>('light');
  
  constructor() {
    this.initializeTheme();
  }
  
  get theme() {
    return this.currentTheme.asReadonly();
  }
  
  get tokens() {
    return MobileDesignTokens;
  }
  
  get themeColors() {
    return this.currentTheme() === 'light' ? MobileLightTheme : MobileDarkTheme;
  }
  
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  setTheme(theme: MobileTheme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    this.saveThemePreference(theme);
  }
  
  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    const systemTheme = this.getSystemTheme();
    const theme = savedTheme || systemTheme;
    
    this.setTheme(theme);
  }
  
  private applyTheme(theme: MobileTheme): void {
    const themeColors = theme === 'light' ? MobileLightTheme : MobileDarkTheme;
    
    // Apply CSS custom properties for mobile
    document.documentElement.style.setProperty('--ion-color-primary', MobileDesignTokens.colors.primary[800]);
    document.documentElement.style.setProperty('--ion-color-secondary', MobileDesignTokens.colors.secondary[500]);
    
    document.documentElement.style.setProperty('--ion-background-color', themeColors.background.primary);
    document.documentElement.style.setProperty('--ion-text-color', themeColors.text.primary);
    
    // Update body class for mobile
    document.body.className = document.body.className.replace(/mobile-theme-\w+/, '');
    document.body.classList.add(`mobile-theme-${theme}`);
  }
  
  private getSavedTheme(): MobileTheme | null {
    try {
      const saved = localStorage.getItem('mobile-theme');
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch {
      return null;
    }
  }
  
  private getSystemTheme(): MobileTheme {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  
  private saveThemePreference(theme: MobileTheme): void {
    try {
      localStorage.setItem('mobile-theme', theme);
    } catch {
      // Handle localStorage not available
    }
  }
}