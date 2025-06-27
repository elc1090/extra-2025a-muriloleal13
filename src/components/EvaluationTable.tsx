'use client';

import React, { useEffect } from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormType, EVALUATION_CRITERIA } from '@/types/forms';
import { useThemeClasses } from '@/contexts/ThemeContext';
import { Tooltip } from './Tooltip';
import { SignatureField } from './SignatureField';

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

      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${themeClasses.border}`}>
          <thead className={`${themeClasses.bgSecondary}`}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-bold ${themeClasses.textPrimary} uppercase tracking-wider`}>
                Critério
              </th>
              <th className={`px-6 py-4 text-center text-xs font-bold ${themeClasses.textPrimary} uppercase tracking-wider`}>
                Nota Máxima
              </th>
              <th className={`px-6 py-4 text-left text-xs font-bold ${themeClasses.textPrimary} uppercase tracking-wider`}>
                Nota Obtida
              </th>
              <th className={`px-6 py-4 text-left text-xs font-bold ${themeClasses.textPrimary} uppercase tracking-wider`}>
                Observações
              </th>
            </tr>
          </thead>
          <tbody className={`${themeClasses.bgPrimary} divide-y ${themeClasses.border}`}>
            {criteria.map((criterion) => (
              <tr key={criterion.id} className={`hover:${themeClasses.bgSecondary} transition-colors duration-200`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${themeClasses.textPrimary}`}>
                  {criterion.description}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-center`}>
                  <span className={`text-lg font-bold ${themeClasses.textPrimary}`}>
                    {criterion.maxScore}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Tooltip content={`Digite uma nota de 0 a ${criterion.maxScore} para ${criterion.description.toLowerCase()}`}>
                    <div className="flex items-center gap-3">
                      <input
                        {...register(`scores.${criterion.id}`, {
                          required: 'Nota é obrigatória',
                          min: { value: 0, message: 'Nota mínima é 0' },
                          max: { value: criterion.maxScore, message: `Nota máxima é ${criterion.maxScore}` },
                          valueAsNumber: true,
                          validate: (value) => {
                            if (value > criterion.maxScore) {
                              return `Nota não pode ser maior que ${criterion.maxScore}`;
                            }
                            if (value < 0) {
                              return 'Nota não pode ser negativa';
                            }
                            return true;
                          }
                        })}
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        step="0.1"
                        className={`w-20 px-3 py-2 rounded-lg shadow-sm transition-all duration-200
                                   ${themeClasses.input} font-bold text-center text-base
                                   border-2 focus:scale-105 hover:shadow-md
                                   ${errors?.scores?.[criterion.id] ?
                                     'border-red-500 dark:border-red-400 high-contrast:border-red-400 animate-pulse' : ''}`}
                        placeholder="0.0"
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;
                          let value = parseFloat(target.value);

                          if (isNaN(value)) value = 0;
                          if (value > criterion.maxScore) value = criterion.maxScore;
                          if (value < 0) value = 0;

                          setValue(`scores.${criterion.id}`, value, { shouldValidate: true });
                          if (parseFloat(target.value) !== value) {
                            target.value = value.toString();
                          }
                        }}
                      />
                      <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                        / {criterion.maxScore}
                      </span>
                    </div>
                  </Tooltip>
                  {errors?.scores?.[criterion.id] && (
                    <p className={`mt-2 text-xs font-medium ${themeClasses.error} flex items-center gap-1`}>
                      <span>⚠</span>
                      {errors.scores[criterion.id].message}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <textarea
                    {...register(`comments.${criterion.id}`)}
                    rows={2}
                    className={`w-full px-3 py-2 rounded-lg shadow-sm transition-all duration-200
                               ${themeClasses.input} text-sm resize-none`}
                    placeholder="Observações sobre este critério..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className={`${themeClasses.bgAccent} border-t-2 ${themeClasses.border}`}>
            <tr>
              <td className={`px-6 py-5 whitespace-nowrap text-sm font-bold ${themeClasses.textPrimary} uppercase tracking-wide`}>
                NOTA FINAL
              </td>
              <td className={`px-6 py-5 text-center whitespace-nowrap text-sm ${themeClasses.textSecondary} font-medium`}>
                -
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <Tooltip content={`Nota final calculada: (${criteria.map(c => {
                  const score = scores[c.id] || 0;
                  const validScore = Math.min(score, c.maxScore);
                  return `${validScore.toFixed(1)}`;
                }).join(' + ')}) / ${criteria.reduce((sum, c) => sum + c.maxScore, 0)} × 10 = ${finalScore.toFixed(1)}`}>
                  <div className={`w-24 px-3 py-2 rounded-lg shadow-md text-xl font-bold text-center
                                 transition-all duration-300 border-2 cursor-help
                                 ${finalScore >= 6
                                   ? 'bg-green-100 dark:bg-green-900/30 high-contrast:bg-green-400 border-green-500 text-green-700 dark:text-green-400 high-contrast:text-black'
                                   : 'bg-red-100 dark:bg-red-900/30 high-contrast:bg-red-400 border-red-500 text-red-700 dark:text-red-400 high-contrast:text-black'
                                 }`}>
                    {finalScore.toFixed(1)}
                  </div>
                </Tooltip>
              </td>
              <td className="px-6 py-5">
                <div className={`px-4 py-2 rounded-full text-sm font-bold text-center uppercase tracking-wide
                               transition-all duration-300 shadow-md
                               ${finalScore >= 6
                                 ? 'bg-green-500 dark:bg-green-600 high-contrast:bg-green-400 text-white high-contrast:text-black'
                                 : 'bg-red-500 dark:bg-red-600 high-contrast:bg-red-400 text-white high-contrast:text-black'
                               }`}>
                  {finalScore >= 6 ? '✓ APROVADO' : '✗ REPROVADO'}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
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
