'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Sparkles, ArrowLeft } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ showBackButton = false, title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 high-contrast:bg-black shadow-lg border-b border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo e Navegação */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-lg
                         bg-gray-100 dark:bg-gray-700 high-contrast:bg-gray-900
                         text-gray-700 dark:text-gray-200 high-contrast:text-yellow-400
                         hover:bg-gray-200 dark:hover:bg-gray-600 high-contrast:hover:bg-gray-800
                         border border-gray-300 dark:border-gray-600 high-contrast:border-yellow-400
                         transition-all duration-200 group text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Voltar
              </Link>
            )}

            <Link href="/" className="flex items-center space-x-3 group">
              {/* Logo com animação */}
              <div className="relative p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 high-contrast:bg-yellow-400
                             group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="h-8 w-8 text-gray-900 dark:text-white high-contrast:text-black" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-gray-600 dark:text-gray-300 high-contrast:text-yellow-300
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Nome da aplicação */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white high-contrast:text-yellow-400
                               group-hover:text-blue-600 dark:group-hover:text-blue-400
                               high-contrast:group-hover:text-yellow-300 transition-colors duration-200">
                  EvalTCC
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 high-contrast:text-yellow-400 font-medium">
                  Avaliação Acadêmica
                </p>
              </div>
            </Link>
          </div>

          {/* Título da página (se fornecido) */}
          {title && (
            <div className="hidden md:block text-center flex-1 mx-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white high-contrast:text-yellow-400">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-300 high-contrast:text-yellow-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Seletor de tema */}
          <div className="flex items-center">
            <ThemeSelector />
          </div>
        </div>

        {/* Título mobile (se fornecido) */}
        {title && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white high-contrast:text-yellow-400">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-300 high-contrast:text-yellow-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export function SimpleHeader() {
  return (
    <header className="bg-white dark:bg-gray-900 high-contrast:bg-black shadow-sm border-b border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 high-contrast:bg-yellow-400
                           group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="h-6 w-6 text-gray-900 dark:text-white high-contrast:text-black" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white high-contrast:text-yellow-400">
                EvalTCC
              </span>
            </div>
          </Link>

          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
