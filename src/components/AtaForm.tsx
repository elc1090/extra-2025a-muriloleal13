'use client';

import React, { useEffect } from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useThemeClasses } from '@/contexts/ThemeContext';
import { FormField } from './FormField';
import { SignatureField } from './SignatureField';
import { ScoreSlider } from './ScoreSlider';

interface AtaFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
}

export const AtaForm: React.FC<AtaFormProps> = ({ register, watch, setValue }) => {
  const themeClasses = useThemeClasses();

  const scores = watch('scores') || {};
  const notaFinal = scores.nota_final || 0;

  useEffect(() => {
    setValue('finalScore', notaFinal);
  }, [notaFinal, setValue]);

  return (
    <div className={`${themeClasses.card} p-8 animate-slide-up`} style={{ animationDelay: '200ms' }}>
      <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
        <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
          <svg className={`h-5 w-5 ${themeClasses.textPrimary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        Informações da Ata
      </h3>

      <div className="space-y-6">

        <div>
          <h4 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-4`}>
            Informações do Trabalho
          </h4>

          <div className="space-y-4">
            <FormField
              label="Título do Trabalho"
              name="studentInfo.title"
              register={register}
              placeholder="Título completo do trabalho de conclusão de curso"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nome do Aluno"
                name="studentInfo.name"
                register={register}
                placeholder="Nome completo do aluno"
                required
              />

              <FormField
                label="Curso"
                name="studentInfo.course"
                type="select"
                register={register}
                options={[
                  { value: 'CC', label: 'Ciência da Computação' },
                  { value: 'SI', label: 'Sistemas de Informação' }
                ]}
                required
              />
            </div>
          </div>
        </div>


        <div>
          <h4 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-4`}>
            Banca Avaliadora
          </h4>

          <div className="space-y-4">
            <FormField
              label="Nome do Professor(a) Orientador(a)"
              name="evaluatorInfo.name"
              register={register}
              placeholder="Nome completo do orientador"
              required
            />

            <FormField
              label="Nome do Professor(a) Avaliador(a) 1"
              name="evaluatorInfo2.name"
              register={register}
              placeholder="Nome completo do primeiro avaliador"
              required
            />

            <FormField
              label="Nome do Professor(a) Avaliador(a) 2"
              name="evaluatorInfo3.name"
              register={register}
              placeholder="Nome completo do segundo avaliador"
            />
          </div>
        </div>


        <div>
          <h4 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-4`}>
            Informações da Apresentação
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Data"
              name="evaluationDate"
              type="date"
              register={register}
              required
            />

            <FormField
              label="Hora"
              name="presentationTime"
              type="time"
              register={register}
              required
            />

            <FormField
              label="Sala"
              name="room"
              register={register}
              placeholder="Ex: Sala 123"
              required
            />
          </div>
        </div>


        <div>
          <h4 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-4`}>
            Avaliação
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className={`block text-sm font-bold ${themeClasses.textPrimary}`}>
                Nota Final *
              </label>
              <div className="space-y-3">
                <ScoreSlider
                  value={notaFinal || 5}
                  onChange={(value) => setValue('scores.nota_final', value, { shouldValidate: true })}
                  max={10}
                  step={0.1}
                  name="scores.nota_final"
                  required
                />
                <div className="flex justify-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                                 transition-all duration-300 shadow-md uppercase tracking-wide
                                 ${notaFinal >= 6
                                   ? 'bg-green-500 dark:bg-green-600 high-contrast:bg-green-400 text-white high-contrast:text-black'
                                   : 'bg-red-500 dark:bg-red-600 high-contrast:bg-red-400 text-white high-contrast:text-black'
                                 }`}>
                    {notaFinal >= 6 ? '✓ APROVADO' : '✗ REPROVADO'}
                  </span>
                </div>
              </div>
            </div>

            <FormField
              label="Data Final para Entrega da Cópia Definitiva"
              name="finalDeliveryDate"
              type="date"
              register={register}
            />
          </div>
        </div>


        <div>
          <label className={`block text-sm font-bold ${themeClasses.textPrimary} mb-3`}>
            Observações
          </label>
          <textarea
            {...register('generalComments')}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg shadow-sm transition-all duration-200
                       ${themeClasses.input} resize-none`}
            placeholder="Observações gerais sobre a apresentação..."
          />
        </div>


        <div>
          <h4 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-6`}>
            Assinaturas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignatureField
              label="Assinatura do(a) Orientador(a)"
              name="signatures.orientador"
              value={watch('signatures.orientador')}
              onChange={(signature) => setValue('signatures.orientador', signature)}
              required
            />

            <SignatureField
              label="Assinatura do(a) Avaliador(a) 1"
              name="signatures.avaliador1"
              value={watch('signatures.avaliador1')}
              onChange={(signature) => setValue('signatures.avaliador1', signature)}
              required
            />

            <SignatureField
              label="Assinatura do(a) Avaliador(a) 2"
              name="signatures.avaliador2"
              value={watch('signatures.avaliador2')}
              onChange={(signature) => setValue('signatures.avaliador2', signature)}
            />

            <SignatureField
              label="Assinatura do Estudante"
              name="signatures.estudante"
              value={watch('signatures.estudante')}
              onChange={(signature) => setValue('signatures.estudante', signature)}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
