import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'dojang_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return (stored as Theme) || 'dark';
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  // Détecter le thème système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Appliquer le thème
  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;

    root.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setCustomTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  return {
    theme,
    effectiveTheme,
    setTheme: setCustomTheme,
    toggleTheme,
    isDark: effectiveTheme === 'dark',
  };
}
