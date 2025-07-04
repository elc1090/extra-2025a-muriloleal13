'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { useThemeClasses } from '@/contexts/ThemeContext';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'time' | 'textarea' | 'select';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
  disabled?: boolean;
  mask?: string;
  maxLength?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
  required = false,
  options = [],
  rows = 3,
  className = '',
  disabled = false,
  mask,
  maxLength
}) => {
  const themeClasses = useThemeClasses();

  // Função para aplicar máscara
  const applyMask = (value: string, maskPattern: string) => {
    if (!maskPattern) return value;

    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara baseada no padrão
    if (maskPattern === 'YYYY/N') {
      if (numbers.length <= 4) {
        return numbers;
      } else {
        return `${numbers.slice(0, 4)}/${numbers.slice(4, 5)}`;
      }
    }

    return value;
  };

  const baseInputClasses = `
    ${themeClasses.input} w-full px-4 py-3 rounded-lg shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? `border-red-500 dark:border-red-400 high-contrast:border-red-400
               focus:ring-red-500 dark:focus:ring-red-400 high-contrast:focus:ring-red-400` : ''}
    ${className}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...register(name, { required })}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            {...register(name, { required })}
            disabled={disabled}
            className={baseInputClasses}
          >
            <option value="">Selecione...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            {...register(name, {
              required,
              onChange: mask ? (e) => {
                const maskedValue = applyMask(e.target.value, mask);
                e.target.value = maskedValue;
              } : undefined
            })}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
            maxLength={maxLength}
            onInput={mask ? (e) => {
              const target = e.target as HTMLInputElement;
              target.value = applyMask(target.value, mask);
            } : undefined}
          />
        );
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor={name} className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
        {label}
        {required && (
          <span className="text-red-500 dark:text-red-400 high-contrast:text-red-400 ml-1 font-bold">
            *
          </span>
        )}
      </label>
      {renderInput()}
      {error && (
        <p className={`mt-2 text-sm font-medium ${themeClasses.error} flex items-center gap-1`}>
          <span className="text-xs">⚠</span>
          {error.message || 'Este campo é obrigatório'}
        </p>
      )}
    </div>
  );
};
