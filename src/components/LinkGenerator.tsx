'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Copy, Share2, ExternalLink } from 'lucide-react';
import { FormField } from './FormField';
import { PrefilledData, FormType } from '@/types/forms';
import { generatePrefilledUrl, copyToClipboard, shareUrl, getFormTitle } from '@/utils/urlUtils';
import { useThemeClasses } from '@/contexts/ThemeContext';

interface LinkGeneratorProps {
  formType: FormType;
}

export const LinkGenerator: React.FC<LinkGeneratorProps> = ({ formType }) => {
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const themeClasses = useThemeClasses();

  const { register, handleSubmit, reset } = useForm<PrefilledData>();

  const courseOptions = [
    { value: 'CC', label: 'Ciência da Computação' },
    { value: 'SI', label: 'Sistemas de Informação' }
  ];

  const onSubmit = (data: PrefilledData) => {
    const url = generatePrefilledUrl(formType, data);
    setGeneratedUrl(url);
  };

  const handleCopyUrl = async () => {
    if (generatedUrl) {
      const success = await copyToClipboard(generatedUrl);
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }
  };

  const handleShareUrl = async () => {
    if (generatedUrl) {
      await shareUrl(generatedUrl, getFormTitle(formType));
    }
  };

  const handleOpenUrl = () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  };

  const handleClearForm = () => {
    reset();
    setGeneratedUrl('');
  };

  return (
    <div className={`${themeClasses.card} p-6 sm:p-8`}>
      <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
        <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
          <Share2 className={`h-5 w-5 ${themeClasses.textPrimary}`} />
        </div>
        <span className="hidden sm:inline">Gerador de Link Pré-preenchido</span>
        <span className="sm:hidden">Gerador de Link</span>
      </h3>

      <p className={`text-sm ${themeClasses.textSecondary} mb-6`}>
        Preencha os campos abaixo para gerar um link que pré-preencherá o formulário com essas informações.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Nome do Aluno"
            name="studentName"
            register={register}
            placeholder="Nome completo do aluno"
          />

          <FormField
            label="Matrícula"
            name="registration"
            register={register}
            placeholder="Número da matrícula"
          />

          <FormField
            label="Curso"
            name="course"
            type="select"
            register={register}
            options={courseOptions}
          />

          <FormField
            label="Semestre/Ano"
            name="semester"
            register={register}
            placeholder="Ex: 2025/1"
            mask="YYYY/N"
            maxLength={6}
          />

          <FormField
            label="Orientador"
            name="advisor"
            register={register}
            placeholder="Nome do orientador"
          />

          <FormField
            label="Coorientador"
            name="coadvisor"
            register={register}
            placeholder="Nome do coorientador (opcional)"
          />
        </div>

        <FormField
          label="Título do Trabalho"
          name="title"
          register={register}
          placeholder="Título completo do TCC"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Nome do Avaliador"
            name="evaluatorName"
            register={register}
            placeholder="Nome do professor avaliador"
          />

          <FormField
            label="Instituição do Avaliador"
            name="evaluatorInstitution"
            register={register}
            placeholder="Ex: UFSM"
          />
        </div>

        <FormField
          label="Data da Avaliação"
          name="evaluationDate"
          type="date"
          register={register}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="submit"
            className={`${themeClasses.btnPrimary} px-6 py-3 rounded-lg font-semibold
                       transition-all duration-200 hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-offset-2
                       shadow-md hover:shadow-lg flex-1 sm:flex-none`}
          >
            Gerar Link
          </button>

          <button
            type="button"
            onClick={handleClearForm}
            className={`${themeClasses.btnSecondary} px-6 py-3 rounded-lg font-semibold
                       transition-all duration-200 hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-offset-2
                       shadow-md hover:shadow-lg flex-1 sm:flex-none`}
          >
            Limpar
          </button>
        </div>
      </form>

      {generatedUrl && (
        <div className={`mt-8 p-4 sm:p-6 ${themeClasses.bgAccent} rounded-xl border ${themeClasses.border} animate-slide-up`}>
          <h4 className={`text-lg font-bold ${themeClasses.textPrimary} mb-4 flex items-center gap-2`}>
            <ExternalLink className={`h-5 w-5 ${themeClasses.textPrimary}`} />
            <span className="hidden sm:inline">Link Gerado:</span>
            <span className="sm:hidden">Link:</span>
          </h4>

          <div className="mb-4">
            <input
              type="text"
              value={generatedUrl}
              readOnly
              className={`w-full px-4 py-3 ${themeClasses.input} rounded-lg text-xs sm:text-sm font-mono
                         focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text
                         break-all`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyUrl}
              className={`flex items-center justify-center gap-2 px-4 py-2
                         bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600
                         high-contrast:bg-green-400 high-contrast:hover:bg-green-500
                         text-white high-contrast:text-black high-contrast:font-bold
                         rounded-lg transition-all duration-200 hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         shadow-md hover:shadow-lg text-sm font-semibold flex-1 sm:flex-none`}
            >
              <Copy size={16} />
              Copiar
            </button>

            <button
              onClick={handleShareUrl}
              className={`flex items-center justify-center gap-2 px-4 py-2
                         ${themeClasses.btnPrimary} rounded-lg transition-all duration-200 hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-offset-2
                         shadow-md hover:shadow-lg text-sm font-semibold flex-1 sm:flex-none`}
            >
              <Share2 size={16} />
              Compartilhar
            </button>

            <button
              onClick={handleOpenUrl}
              className={`flex items-center justify-center gap-2 px-4 py-2
                         ${themeClasses.btnSecondary} rounded-lg transition-all duration-200 hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-offset-2
                         shadow-md hover:shadow-lg text-sm font-semibold flex-1 sm:flex-none`}
            >
              <ExternalLink size={16} />
              Abrir
            </button>
          </div>

          {showSuccess && (
            <div className={`mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 high-contrast:bg-green-400
                           border border-green-200 dark:border-green-700 high-contrast:border-green-500
                           text-green-700 dark:text-green-300 high-contrast:text-black
                           font-semibold text-sm flex items-center gap-2 animate-slide-up`}>
              <Copy size={16} />
              ✓ Link copiado para a área de transferência!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
