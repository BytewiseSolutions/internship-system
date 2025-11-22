import { Injectable, signal } from '@angular/core';
import { DesignTokens, LightTheme, DarkTheme } from './design-tokens';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<Theme>('light');
  
  constructor() {
    this.initializeTheme();
  }
  
  get theme() {
    return this.currentTheme.asReadonly();
  }
  
  get tokens() {
    return DesignTokens;
  }
  
  get themeColors() {
    return this.currentTheme() === 'light' ? LightTheme : DarkTheme;
  }
  
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  setTheme(theme: Theme): void {
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
  
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    const themeColors = theme === 'light' ? LightTheme : DarkTheme;
    
    // Apply CSS custom properties
    root.style.setProperty('--color-bg-primary', themeColors.background.primary);
    root.style.setProperty('--color-bg-secondary', themeColors.background.secondary);
    root.style.setProperty('--color-bg-tertiary', themeColors.background.tertiary);
    
    root.style.setProperty('--color-text-primary', themeColors.text.primary);
    root.style.setProperty('--color-text-secondary', themeColors.text.secondary);
    root.style.setProperty('--color-text-tertiary', themeColors.text.tertiary);
    
    root.style.setProperty('--color-border', themeColors.border);
    
    // Apply primary colors
    root.style.setProperty('--color-primary-50', DesignTokens.colors.primary[50]);
    root.style.setProperty('--color-primary-500', DesignTokens.colors.primary[500]);
    root.style.setProperty('--color-primary-800', DesignTokens.colors.primary[800]);
    
    // Apply secondary colors
    root.style.setProperty('--color-secondary-500', DesignTokens.colors.secondary[500]);
    root.style.setProperty('--color-secondary-700', DesignTokens.colors.secondary[700]);
    
    // Update body class
    document.body.className = document.body.className.replace(/theme-\w+/, '');
    document.body.classList.add(`theme-${theme}`);
  }
  
  private getSavedTheme(): Theme | null {
    try {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch {
      return null;
    }
  }
  
  private getSystemTheme(): Theme {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  
  private saveThemePreference(theme: Theme): void {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Handle localStorage not available
    }
  }
}