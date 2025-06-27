'use client';

import React, { useEffect } from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormType, EVALUATION_CRITERIA } from '@/types/forms';
import { useThemeClasses } from '@/contexts/ThemeContext';
import { Tooltip } from './Tooltip';
import { SignatureField } from './SignatureField';
import { ScoreSlider } from './ScoreSlider';

interface EvaluationTableProps {
  formType: FormType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
}

export const EvaluationTable: React.FC<EvaluationTableProps> = ({
  formType,
  register,
  watch,
  setValue,
  errors
}) => {
  const criteria = EVALUATION_CRITERIA[formType];
  const themeClasses = useThemeClasses();

  const scores = watch('scores') || {};
  const calculateFinalScore = () => {
    let totalScore = 0;
    let totalMaxScore = 0;

    criteria.forEach((criterion) => {
      const score = scores[criterion.id] || 0;

      const validScore = Math.min(score, criterion.maxScore);
      totalScore += validScore;
      totalMaxScore += criterion.maxScore;
    });


    return totalMaxScore > 0 ? (totalScore / totalMaxScore) * 10 : 0;
  };

  const finalScore = calculateFinalScore();


  useEffect(() => {
    setValue('finalScore', finalScore);
  }, [finalScore, setValue]);

  return (
    <div className={`${themeClasses.card} p-8 animate-slide-up`} style={{ animationDelay: '200ms' }}>
      <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
        <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
          <svg className={`h-5 w-5 ${themeClasses.textPrimary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        Critérios de Avaliação
      </h3>

      {/* Layout em Cards - Todos os tamanhos */}
      <div className="space-y-4">
        {/* Grid responsivo para os critérios */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {criteria.map((criterion) => (
            <div key={criterion.id} className={`${themeClasses.card} p-4 space-y-3`}>
              <div className="flex justify-between items-start">
                <h4 className={`text-sm font-semibold ${themeClasses.textPrimary} flex-1 pr-2`}>
                  {criterion.description}
                </h4>
                <span className={`text-xs font-bold ${themeClasses.textSecondary} bg-gray-100 dark:bg-gray-800 high-contrast:bg-gray-600 px-2 py-1 rounded`}>
                  Max: {criterion.maxScore}
                </span>
              </div>
              <div className="w-full">
                <ScoreSlider
                  value={scores[criterion.id] || criterion.maxScore / 2}
                  onChange={(value) => setValue(`scores.${criterion.id}`, value, { shouldValidate: true })}
                  max={criterion.maxScore}
                  step={0.1}
                  name={`scores.${criterion.id}`}
                  required
                  error={errors?.scores?.[criterion.id]?.message}
                />
              </div>
            </div>
          ))}

        </div>

        {/* Nota Final */}
        <div className={`${themeClasses.card} p-6 border-2 ${themeClasses.border}`}>
          <div className="text-center space-y-4">
            <h4 className={`text-xl font-bold ${themeClasses.textPrimary} uppercase tracking-wide`}>
              NOTA FINAL
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Tooltip content={`Nota final calculada: (${criteria.map(c => {
                const score = scores[c.id] || 0;
                const validScore = Math.min(score, c.maxScore);
                return `${validScore.toFixed(1)}`;
              }).join(' + ')}) / ${criteria.reduce((sum, c) => sum + c.maxScore, 0)} × 10 = ${finalScore.toFixed(1)}`}>
                <div className={`px-6 py-3 rounded-lg shadow-md text-3xl font-bold text-center
                               transition-all duration-300 border-2 cursor-help
                               ${finalScore >= 6
                                 ? 'bg-green-100 dark:bg-green-900/30 high-contrast:bg-green-400 border-green-500 text-green-700 dark:text-green-400 high-contrast:text-black'
                                 : 'bg-red-100 dark:bg-red-900/30 high-contrast:bg-red-400 border-red-500 text-red-700 dark:text-red-400 high-contrast:text-black'
                               }`}>
                  {finalScore.toFixed(1)}
                </div>
              </Tooltip>
              <div className={`px-6 py-3 rounded-full text-base font-bold text-center uppercase tracking-wide
                             transition-all duration-300 shadow-md
                             ${finalScore >= 6
                               ? 'bg-green-500 dark:bg-green-600 high-contrast:bg-green-400 text-white high-contrast:text-black'
                               : 'bg-red-500 dark:bg-red-600 high-contrast:bg-red-400 text-white high-contrast:text-black'
                             }`}>
                {finalScore >= 6 ? '✓ APROVADO' : '✗ REPROVADO'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label className={`block text-sm font-bold ${themeClasses.textPrimary} mb-3`}>
          Observações Gerais
        </label>
        <textarea
          {...register('generalComments')}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg shadow-sm transition-all duration-200
                     ${themeClasses.input} resize-none`}
          placeholder="Comentários gerais sobre a avaliação..."
        />
      </div>


      <div className="mt-8">
        <h4 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-6`}>
          Assinatura do Avaliador
        </h4>

        <div className="max-w-md">
          <SignatureField
            label="Assinatura"
            name="signatures.avaliador"
            value={watch('signatures.avaliador')}
            onChange={(signature) => setValue('signatures.avaliador', signature)}
            required
          />
        </div>
      </div>
    </div>
  );
};
