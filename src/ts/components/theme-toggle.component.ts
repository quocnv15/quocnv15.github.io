/**
 * Theme Toggle Component
 *
 * A reusable component for managing theme toggle functionality
 */

import { SELECTORS, CSS_CLASSES, DATA_ATTRIBUTES, STORAGE_KEYS } from '../constants';
import { ConfigService } from '../services/config.service';
import type { ThemeMode } from '../types';

export class ThemeToggleComponent {
  private element: HTMLElement | null = null;
  private cleanupFunctions: (() => void)[] = [];
  private configService: ConfigService;

  constructor() {
    this.configService = ConfigService.getInstance();
  }

  /**
   * Initialize theme toggle functionality
   */
  public init(): void {
    this.createToggleIfNotExists();
    this.setupEventListeners();
    this.updateInitialState();
    console.log('🎨 Theme toggle component initialized');
  }

  /**
   * Create theme toggle button if it doesn't exist
   */
  private createToggleIfNotExists(): void {
    const existingToggle = document.querySelector(SELECTORS.THEME_TOGGLE);
    if (existingToggle) {
      this.element = existingToggle as HTMLElement;
      return;
    }

    this.element = this.createToggleButton();
    this.insertToggle();
  }

  /**
   * Create toggle button element
   */
  private createToggleButton(): HTMLElement {
    const button = document.createElement('button');
    button.className = CSS_CLASSES.THEME_TOGGLE;
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.setAttribute('title', 'Toggle dark mode');
    button.innerHTML = `<span class="${SELECTORS.THEME_ICON.replace('.', '')}">🌙</span>`;
    return button;
  }

  /**
   * Insert toggle button into the page
   */
  private insertToggle(): void {
    const header = document.querySelector(SELECTORS.SITE_HEADER);
    if (!header) {
      console.warn('⚠️ Could not find suitable location for theme toggle button');
      return;
    }
    header.appendChild(this.element!);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.element) return;

    const clickHandler = (e: Event) => {
      e.preventDefault();
      this.toggleTheme();
    };

    this.element.addEventListener('click', clickHandler);
    this.cleanupFunctions.push(() => {
      this.element?.removeEventListener('click', clickHandler);
    });

    // Watch for system theme changes
    this.setupSystemThemeWatcher();
  }

  /**
   * Setup system theme change watcher
   */
  private setupSystemThemeWatcher(): void {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const storedTheme = this.getStoredTheme();
      if (storedTheme === 'system') {
        this.applyTheme('system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy support
      mediaQuery.addListener(handleChange);
    }

    this.cleanupFunctions.push(() => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    });
  }

  /**
   * Update initial state of the toggle button
   */
  private updateInitialState(): void {
    const currentTheme = this.getCurrentTheme();
    this.updateButtonState(currentTheme);
  }

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): ThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    return 'system';
  }

  /**
   * Get current active theme
   */
  private getCurrentTheme(): ThemeMode {
    const stored = this.getStoredTheme();
    if (stored === 'system') {
      return this.getSystemTheme();
    }
    return stored;
  }

  /**
   * Get system preferred theme
   */
  private getSystemTheme(): ThemeMode {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Toggle between themes
   */
  public toggleTheme(): void {
    const current = this.getCurrentTheme();
    const next: ThemeMode = current === 'light' ? 'dark' : 'light';
    const stored = this.getStoredTheme();

    const newStored = stored === 'system' ? next : 'system';
    this.setStoredTheme(newStored);
    this.applyTheme(newStored);
  }

  /**
   * Set specific theme
   */
  public setTheme(theme: ThemeMode): void {
    this.setStoredTheme(theme);
    this.applyTheme(theme);
  }

  /**
   * Store theme preference
   */
  private setStoredTheme(theme: ThemeMode): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: ThemeMode): void {
    const actualTheme = theme === 'system' ? this.getSystemTheme() : theme;
    document.documentElement.setAttribute(DATA_ATTRIBUTES.THEME, actualTheme);

    this.updateButtonState(actualTheme);
    this.addTransitionClass();

    console.log(`🎨 Theme applied: ${actualTheme} (stored: ${theme})`);
  }

  /**
   * Update button state
   */
  private updateButtonState(actualTheme: ThemeMode): void {
    if (!this.element) return;

    const isActive = actualTheme === 'dark';
    this.element.classList.toggle(CSS_CLASSES.THEME_ACTIVE, isActive);
    this.element.setAttribute('aria-pressed', isActive.toString());

    const icon = this.element.querySelector(SELECTORS.THEME_ICON);
    if (icon) {
      icon.textContent = actualTheme === 'dark' ? '🌙' : '☀️';
    }

    this.element.setAttribute('title', actualTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  /**
   * Add transition class for smooth theme switching
   */
  private addTransitionClass(): void {
    document.documentElement.classList.add(CSS_CLASSES.THEME_TRANSITIONING);
    setTimeout(() => {
      document.documentElement.classList.remove(CSS_CLASSES.THEME_TRANSITIONING);
    }, 300);
  }

  /**
   * Cleanup component
   */
  public destroy(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
    this.element = null;
    console.log('🎨 Theme toggle component destroyed');
  }
}