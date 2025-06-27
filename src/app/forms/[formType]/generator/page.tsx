'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Share2, Info, CheckCircle, ExternalLink } from 'lucide-react';

import { Header } from '@/components/Header';
import { LinkGenerator } from '@/components/LinkGenerator';
import { FormType } from '@/types/forms';
import { getFormTitle } from '@/utils/urlUtils';
import { useThemeClasses } from '@/contexts/ThemeContext';

export default function GeneratorPage() {
  const params = useParams();
  const formType = params.formType as FormType;
  const themeClasses = useThemeClasses();

  if (!formType || !['avaliacao_andamento_cc', 'avaliacao_final_cc', 'avaliacao_final_si', 'ata_apresentacao'].includes(formType)) {
    return (
      <div className={`min-h-screen ${themeClasses.bgSecondary}`}>
        <Header showBackButton={true} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className={`text-center ${themeClasses.card} p-8 max-w-md mx-4`}>
            <h1 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>Formulário não encontrado</h1>
            <p className={`${themeClasses.textSecondary} mb-6`}>
              O tipo de formulário solicitado não existe ou não está disponível.
            </p>
            <Link
              href="/"
              className={`${themeClasses.btnPrimary} inline-block px-6 py-3 rounded-lg font-medium`}
            >
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bgSecondary}`}>
      {/* Header */}
      <Header
        showBackButton={true}
        title={`Gerador de Link - ${getFormTitle(formType)}`}
        subtitle="Crie um link pré-preenchido para facilitar o preenchimento do formulário"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Como funciona */}
          <div className={`${themeClasses.card} p-6 sm:p-8 animate-slide-up`}>
            <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
              <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
                <Info className={`h-5 w-5 ${themeClasses.textPrimary}`} />
              </div>
              Como funciona?
            </h3>
            <p className={`${themeClasses.textSecondary} leading-relaxed text-sm sm:text-base`}>
              Preencha os campos abaixo com as informações que você deseja que apareçam
              automaticamente no formulário. O sistema gerará um link que, quando acessado,
              pré-preencherá o formulário com essas informações, facilitando o trabalho
              do avaliador.
            </p>
          </div>

          {/* Gerador de Link */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <LinkGenerator formType={formType} />
          </div>

          {/* Grid de informações e ações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Informações Adicionais */}
            <div className={`lg:col-span-2 ${themeClasses.card} p-6 sm:p-8`}>
              <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
                <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
                  <CheckCircle className={`h-5 w-5 ${themeClasses.textPrimary}`} />
                </div>
                Informações Adicionais
              </h3>
              <ul className={`${themeClasses.textSecondary} space-y-3 text-sm sm:text-base`}>
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

            {/* Ações rápidas */}
            <div className={`${themeClasses.card} p-6 sm:p-8 flex flex-col justify-center`}>
              <div className="text-center space-y-4">
                <div className={`p-4 rounded-xl ${themeClasses.bgAccent} mx-auto w-fit`}>
                  <Share2 className={`h-8 w-8 ${themeClasses.textPrimary}`} />
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${themeClasses.textPrimary} mb-2`}>
                    Pronto para usar?
                  </h4>
                  <p className={`${themeClasses.textSecondary} text-sm mb-4`}>
                    Acesse o formulário diretamente
                  </p>
                </div>
                <Link
                  href={`/forms/${formType}`}
                  className={`inline-flex items-center justify-center gap-3 px-6 py-3 w-full
                             ${themeClasses.btnPrimary} rounded-lg font-semibold
                             text-white dark:text-white high-contrast:text-black
                             transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg`}
                  style={{ color: 'white' }}
                >
                  <ExternalLink className="h-5 w-5" />
                  Ir para o formulário
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
