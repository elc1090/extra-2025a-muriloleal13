'use client';

import React, { useState } from 'react';
import { Sun, Moon, Eye, ChevronDown } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      value: 'light' as Theme,
      label: 'Claro',
      icon: Sun,
      description: 'Tema claro padrão'
    },
    {
      value: 'dark' as Theme,
      label: 'Escuro',
      icon: Moon,
      description: 'Tema escuro para ambientes com pouca luz'
    },
    {
      value: 'high-contrast' as Theme,
      label: 'Alto Contraste',
      icon: Eye,
      description: 'Tema com alto contraste para acessibilidade'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
                   bg-white dark:bg-gray-800 high-contrast:bg-black
                   border-gray-300 dark:border-gray-600 high-contrast:border-yellow-400
                   text-gray-700 dark:text-gray-200 high-contrast:text-yellow-400
                   hover:bg-gray-50 dark:hover:bg-gray-700 high-contrast:hover:bg-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-500 high-contrast:focus:ring-yellow-400"
        aria-label="Selecionar tema"
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentTheme?.label}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar o dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-20
                          bg-white dark:bg-gray-800 high-contrast:bg-black
                          border border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400
                          ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;
                
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors
                               hover:bg-gray-50 dark:hover:bg-gray-700 high-contrast:hover:bg-gray-900
                               ${isSelected 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 high-contrast:bg-yellow-400/20' 
                                 : ''
                               }`}
                  >
                    <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0
                                     ${isSelected 
                                       ? 'text-blue-600 dark:text-blue-400 high-contrast:text-yellow-400' 
                                       : 'text-gray-400 dark:text-gray-500 high-contrast:text-yellow-300'
                                     }`} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium
                                      ${isSelected 
                                        ? 'text-blue-900 dark:text-blue-100 high-contrast:text-yellow-400' 
                                        : 'text-gray-900 dark:text-gray-100 high-contrast:text-yellow-400'
                                      }`}>
                        {themeOption.label}
                        {isSelected && (
                          <span className="ml-2 text-xs
                                         text-blue-600 dark:text-blue-400 high-contrast:text-yellow-300">
                            ✓ Ativo
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 high-contrast:text-yellow-300 mt-1">
                        {themeOption.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400 px-4 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 high-contrast:text-yellow-300">
                O tema será salvo automaticamente
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
