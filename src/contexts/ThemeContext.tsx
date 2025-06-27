'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const savedTheme = localStorage.getItem('tcc-forms-theme') as Theme;
      if (savedTheme && ['light', 'dark', 'high-contrast'].includes(savedTheme)) {
        setTheme(savedTheme);
      } else {

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

        if (prefersHighContrast) {
          setTheme('high-contrast');
        } else if (prefersDark) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      }
    } catch (error) {
      console.warn('Error loading theme preference:', error);
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem('tcc-forms-theme', theme);


        const root = document.documentElement;
        root.classList.remove('light', 'dark', 'high-contrast');
        root.classList.add(theme);


        root.setAttribute('data-theme', theme);
      } catch (error) {
        console.warn('Error saving theme preference:', error);
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme
  };

  // Renderizar sempre, mas com tema padrão se não montado
  return (
    <ThemeContext.Provider value={value}>
      <div className={mounted ? '' : 'opacity-0'} style={{ transition: 'opacity 0.3s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook seguro que retorna tema padrão se contexto não estiver disponível
export function useThemeSafe() {
  const context = useContext(ThemeContext);
  return context || { theme: 'light' as Theme, setTheme: () => {}, toggleTheme: () => {} };
}

// Hook para obter classes CSS baseadas no tema
export function useThemeClasses() {
  const context = useContext(ThemeContext);
  const theme = context?.theme || 'light';

  const classes = {
    // Backgrounds
    bgPrimary: {
      light: 'bg-white',
      dark: 'bg-gray-900',
      'high-contrast': 'bg-black'
    }[theme],

    bgSecondary: {
      light: 'bg-gray-50',
      dark: 'bg-gray-800',
      'high-contrast': 'bg-gray-900'
    }[theme],

    bgAccent: {
      light: 'bg-blue-50',
      dark: 'bg-blue-900/20',
      'high-contrast': 'bg-yellow-400'
    }[theme],

    // Text colors
    textPrimary: {
      light: 'text-gray-900',
      dark: 'text-white',
      'high-contrast': 'text-white'
    }[theme],

    textSecondary: {
      light: 'text-gray-600',
      dark: 'text-gray-300',
      'high-contrast': 'text-yellow-400'
    }[theme],

    textMuted: {
      light: 'text-gray-500',
      dark: 'text-gray-400',
      'high-contrast': 'text-yellow-300'
    }[theme],

    // Borders
    border: {
      light: 'border-gray-200',
      dark: 'border-gray-700',
      'high-contrast': 'border-yellow-400'
    }[theme],

    borderInput: {
      light: 'border-gray-300',
      dark: 'border-gray-600',
      'high-contrast': 'border-yellow-400'
    }[theme],

    // Buttons
    btnPrimary: {
      light: 'bg-blue-600 hover:bg-blue-700 text-white',
      dark: 'bg-blue-500 hover:bg-blue-600 text-white',
      'high-contrast': 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold'
    }[theme],

    btnSecondary: {
      light: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
      dark: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600',
      'high-contrast': 'bg-black hover:bg-gray-900 text-yellow-400 border-2 border-yellow-400 font-bold'
    }[theme],

    // Cards
    card: {
      light: 'bg-white border border-gray-200 shadow-sm',
      dark: 'bg-gray-800 border border-gray-700 shadow-lg',
      'high-contrast': 'bg-black border-2 border-yellow-400 shadow-xl'
    }[theme],

    // Form inputs
    input: {
      light: 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
      dark: 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400',
      'high-contrast': 'bg-black border-2 border-yellow-400 text-yellow-400 focus:border-yellow-300 focus:ring-yellow-300 font-bold'
    }[theme],

    // Status colors
    success: {
      light: 'text-green-600 bg-green-100',
      dark: 'text-green-400 bg-green-900/20',
      'high-contrast': 'text-black bg-yellow-400 font-bold'
    }[theme],

    error: {
      light: 'text-red-600 bg-red-100',
      dark: 'text-red-400 bg-red-900/20',
      'high-contrast': 'text-yellow-400 bg-black border border-yellow-400 font-bold'
    }[theme],

    // Gradients
    gradient: {
      light: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      dark: 'bg-gradient-to-br from-gray-900 to-gray-800',
      'high-contrast': 'bg-black'
    }[theme]
  };

  return classes;
}
