/**
 * Simple Theme Management for Personal Blog
 * 
 * Self-contained theme system with no external dependencies.
 * Supports light, dark, and system preference modes.
 */

type ThemeMode = 'light' | 'dark' | 'system';

class ThemeManager {
  private mode: ThemeMode = 'system';
  private listeners: Set<() => void> = new Set();
  private cleanupFns: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    // Load saved theme
    this.mode = this.loadTheme();
    
    // Apply theme immediately to prevent flash
    this.applyTheme();

    // Setup when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupUI());
    } else {
      this.setupUI();
    }

    // Watch system preference changes
    this.watchSystemTheme();

    console.log(`🎨 Theme initialized: ${this.mode}`);
  }

  private loadTheme(): ThemeMode {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch (e) {
      console.warn('Failed to load theme from localStorage');
    }
    return 'system';
  }

  private saveTheme(): void {
    try {
      localStorage.setItem('theme', this.mode);
    } catch (e) {
      console.warn('Failed to save theme to localStorage');
    }
  }

  private getEffectiveTheme(): 'light' | 'dark' {
    if (this.mode !== 'system') return this.mode;
    
    // Check system preference
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  private applyTheme(): void {
    const effective = this.getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', effective);
    
    // Notify listeners
    this.listeners.forEach(fn => fn());
  }

  private setupUI(): void {
    // Find all toggle buttons
    const buttons = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
    
    buttons.forEach(btn => {
      // Update button state
      this.updateButton(btn as HTMLElement);
      
      // Add click handler
      const handler = (e: Event) => {
        e.preventDefault();
        this.toggle();
      };
      btn.addEventListener('click', handler);
      this.cleanupFns.push(() => btn.removeEventListener('click', handler));
    });

    console.log(`🎨 Theme UI setup: ${buttons.length} toggle button(s)`);
  }

  private updateButton(btn: HTMLElement): void {
    const effective = this.getEffectiveTheme();
    const isDark = effective === 'dark';
    
    // Update aria-pressed
    btn.setAttribute('aria-pressed', isDark.toString());
    
    // Update title
    btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    
    // Update icon if exists
    const icon = btn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = isDark ? '🌙' : '☀️';
    }
    
    // Update active class
    btn.classList.toggle('active', isDark);
  }

  private watchSystemTheme(): void {
    if (!window.matchMedia) return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (this.mode === 'system') {
        this.applyTheme();
        // Update all buttons
        document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach(btn => {
          this.updateButton(btn as HTMLElement);
        });
      }
    };

    if (query.addEventListener) {
      query.addEventListener('change', handler);
      this.cleanupFns.push(() => query.removeEventListener('change', handler));
    }
  }

  /**
   * Toggle between light and dark (skip system)
   */
  public toggle(): void {
    const current = this.getEffectiveTheme();
    this.mode = current === 'light' ? 'dark' : 'light';
    
    this.saveTheme();
    this.applyTheme();
    
    // Update all toggle buttons
    document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach(btn => {
      this.updateButton(btn as HTMLElement);
    });

    console.log(`🎨 Theme toggled to: ${this.mode}`);
  }

  /**
   * Set specific theme
   */
  public setTheme(mode: ThemeMode): void {
    this.mode = mode;
    this.saveTheme();
    this.applyTheme();
    
    // Update all toggle buttons
    document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach(btn => {
      this.updateButton(btn as HTMLElement);
    });
  }

  /**
   * Get current mode
   */
  public getMode(): ThemeMode {
    return this.mode;
  }

  /**
   * Get effective theme (resolved system preference)
   */
  public getTheme(): 'light' | 'dark' {
    return this.getEffectiveTheme();
  }

  /**
   * Subscribe to theme changes
   */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Cleanup (for testing)
   */
  public destroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
    this.listeners.clear();
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();

// Export convenient functions
export const toggleTheme = () => themeManager.toggle();
export const setTheme = (mode: ThemeMode) => themeManager.setTheme(mode);
export const getTheme = () => themeManager.getTheme();
export const subscribeToTheme = (callback: () => void) => themeManager.subscribe(callback);

// Export type
export type { ThemeMode };
