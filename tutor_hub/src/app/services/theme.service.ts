import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'tutor-hub-theme';
  
  // Signal for current theme
  currentTheme = signal<Theme>(this.getStoredTheme());

  constructor() {
    // Apply theme whenever it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
    
    // Apply initial theme
    this.applyTheme(this.currentTheme());
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme();
  }

  isDarkMode(): boolean {
    return this.currentTheme() === 'dark';
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    // Check system preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    body.classList.add(`${theme}-theme`);
    
    // Update data attribute for CSS selectors
    body.setAttribute('data-theme', theme);
  }
}
