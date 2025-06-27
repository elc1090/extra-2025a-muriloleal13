'use client';

import React from 'react';
import { useThemeClasses } from '@/contexts/ThemeContext';

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  label?: string;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const ScoreSlider: React.FC<ScoreSliderProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 0.1,
  label,
  name,
  required = false,
  error,
  disabled = false
}) => {
  const themeClasses = useThemeClasses();

  // Usar o valor passado ou valor no meio se não há valor definido
  const currentValue = value !== undefined && value !== null ? value : (max / 2);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };



  // Calcular a porcentagem para o gradiente
  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-bold ${themeClasses.textPrimary}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-2">
        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleSliderChange}
            disabled={disabled}
            name={name}
            className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed slider-custom
                       ${error ? 'ring-2 ring-red-500' : ''}`}
            style={{
              background: `linear-gradient(to right,
                #3b82f6 0%,
                #3b82f6 ${percentage}%,
                #e5e7eb ${percentage}%,
                #e5e7eb 100%)`
            }}
          />

          {/* Marcadores de valor */}
          <div className="flex justify-between text-xs mt-1">
            <span className={`${themeClasses.textSecondary} font-medium`}>{min}</span>
            <span className={`${themeClasses.textSecondary} font-medium`}>{max}</span>
          </div>
        </div>

        {/* Display do valor atual */}
        <div className="flex items-center justify-center">
          <div className={`px-2 py-1 rounded ${themeClasses.bgAccent} border ${themeClasses.border}`}>
            <span className={`text-sm font-bold ${themeClasses.textPrimary}`}>
              {currentValue.toFixed(1)}
            </span>
            <span className={`text-xs font-medium ${themeClasses.textSecondary} ml-1`}>
              / {max}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className={`text-xs font-medium ${themeClasses.error} flex items-center gap-1 mt-2`}>
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};
