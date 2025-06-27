'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Info, CheckCircle, ExternalLink } from 'lucide-react';

import { LinkGenerator } from '@/components/LinkGenerator';
import { FormType } from '@/types/forms';
import { getFormTitle, getFormDescription } from '@/utils/urlUtils';
import { useThemeClasses } from '@/contexts/ThemeContext';
import { ThemeSelector } from '@/components/ThemeSelector';

export default function GeneratorPage() {
  const params = useParams();
  const formType = params.formType as FormType;
  const themeClasses = useThemeClasses();

  if (!formType || !['avaliacao_andamento_cc', 'avaliacao_final_cc', 'avaliacao_final_si', 'ata_apresentacao'].includes(formType)) {
    return (
      <div className={`min-h-screen ${themeClasses.bgSecondary} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>Formulário não encontrado</h1>
          <Link href="/" className="text-blue-600 dark:text-blue-400 high-contrast:text-yellow-400 hover:underline">
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.gradient}`}>
      {/* Header */}
      <header className={`${themeClasses.bgPrimary} shadow-lg border-b ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className={`flex items-center ${themeClasses.textSecondary} hover:${themeClasses.textPrimary}
                           transition-colors duration-200 mr-6 group`}
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
                Voltar
              </Link>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${themeClasses.bgAccent} shadow-md`}>
                  <Share2 className={`h-6 w-6 ${themeClasses.textPrimary}`} />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${themeClasses.textPrimary}`}>
                    Gerador de Link - {getFormTitle(formType)}
                  </h1>
                  <p className={`text-sm ${themeClasses.textSecondary} mt-1`}>
                    Crie um link pré-preenchido para facilitar o preenchimento do formulário
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Selector */}
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Como funciona */}
        <div className={`${themeClasses.card} p-8 mb-8 animate-slide-up`}>
          <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
            <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
              <Info className={`h-5 w-5 ${themeClasses.textPrimary}`} />
            </div>
            Como funciona?
          </h3>
          <p className={`${themeClasses.textSecondary} leading-relaxed`}>
            Preencha os campos abaixo com as informações que você deseja que apareçam
            automaticamente no formulário. O sistema gerará um link que, quando acessado,
            pré-preencherá o formulário com essas informações, facilitando o trabalho
            do avaliador.
          </p>
        </div>

        {/* Gerador de Link */}
        <LinkGenerator formType={formType} />

        {/* Informações Adicionais */}
        <div className={`${themeClasses.card} p-8 mt-8 animate-slide-up`} style={{ animationDelay: '200ms' }}>
          <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
            <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
              <CheckCircle className={`h-5 w-5 ${themeClasses.textPrimary}`} />
            </div>
            Informações Adicionais
          </h3>
          <ul className={`${themeClasses.textSecondary} space-y-3`}>
            <li className="flex items-start gap-3">
              <span className={`inline-block w-2 h-2 rounded-full ${themeClasses.bgAccent} mt-2 flex-shrink-0`}></span>
              Todos os campos são opcionais - preencha apenas os que desejar
            </li>
            <li className="flex items-start gap-3">
              <span className={`inline-block w-2 h-2 rounded-full ${themeClasses.bgAccent} mt-2 flex-shrink-0`}></span>
              O link gerado pode ser compartilhado por email, WhatsApp ou outras plataformas
            </li>
            <li className="flex items-start gap-3">
              <span className={`inline-block w-2 h-2 rounded-full ${themeClasses.bgAccent} mt-2 flex-shrink-0`}></span>
              Os dados são passados através da URL de forma segura
            </li>
            <li className="flex items-start gap-3">
              <span className={`inline-block w-2 h-2 rounded-full ${themeClasses.bgAccent} mt-2 flex-shrink-0`}></span>
              O avaliador ainda poderá editar as informações pré-preenchidas se necessário
            </li>
          </ul>
        </div>

        {/* Botão para ir ao formulário */}
        <div className="mt-8 text-center">
          <Link
            href={`/forms/${formType}`}
            className={`inline-flex items-center gap-3 px-6 py-3 ${themeClasses.btnSecondary}
                       rounded-lg font-semibold transition-all duration-200 hover:scale-105
                       shadow-md hover:shadow-lg animate-slide-up`}
            style={{ animationDelay: '300ms' }}
          >
            <ExternalLink className="h-5 w-5" />
            Ir para o formulário
          </Link>
        </div>
      </main>
    </div>
  );
}
