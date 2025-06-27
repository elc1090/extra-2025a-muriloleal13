'use client';

import Link from 'next/link';
import { FileText, GraduationCap, Users, ExternalLink, Sparkles, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Tooltip } from '@/components/Tooltip';
import { useThemeClasses } from '@/contexts/ThemeContext';

export default function Home() {
  const themeClasses = useThemeClasses();

  const formTypes = [
    {
      id: 'avaliacao_andamento_cc',
      title: 'Avaliação de Andamento - CC',
      description: 'Formulário para avaliação do andamento do TCC do curso de Ciência da Computação',
      course: 'Ciência da Computação',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      id: 'avaliacao_final_cc',
      title: 'Avaliação Final - CC',
      description: 'Formulário para avaliação final do TCC do curso de Ciência da Computação',
      course: 'Ciência da Computação',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500'
    },
    {
      id: 'avaliacao_final_si',
      title: 'Avaliação Final - SI',
      description: 'Formulário para avaliação final do TCC do curso de Sistemas de Informação',
      course: 'Sistemas de Informação',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500'
    },
    {
      id: 'ata_apresentacao',
      title: 'Ata de Apresentação',
      description: 'Ata para registro da apresentação do Trabalho de Conclusão de Curso',
      course: 'Ambos os cursos',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500'
    }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.gradient} transition-all duration-300`}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className={`relative p-4 rounded-2xl ${themeClasses.bgAccent} animate-pulse`}>
                <GraduationCap className={`h-16 w-16 ${themeClasses.textPrimary}`} />
                <Sparkles className={`absolute -top-2 -right-2 h-8 w-8 ${themeClasses.textSecondary} animate-bounce`} />
              </div>
            </div>

            <h1 className={`text-4xl md:text-6xl font-bold ${themeClasses.textPrimary} mb-4 animate-fade-in`}>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EvalTCC
              </span>
            </h1>

            <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} mb-6 animate-slide-up`}>
              Plataforma Moderna de Avaliação Acadêmica
            </p>

            <p className={`text-lg ${themeClasses.textMuted} max-w-3xl mx-auto animate-slide-up`}>
              Simplifique o processo de avaliação de TCCs com formulários inteligentes,
              geração automática de PDFs e links pré-preenchidos para máxima eficiência.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>
            Selecione o Formulário
          </h2>
          <p className={`${themeClasses.textSecondary} max-w-2xl mx-auto text-lg`}>
            Escolha o tipo de formulário que deseja preencher. Cada formulário pode ser
            acessado através de um link específico e suporta pré-preenchimento de dados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formTypes.map((form, index) => {
            const IconComponent = form.icon;
            return (
              <div
                key={form.id}
                className={`${themeClasses.card} hover:shadow-xl transition-all duration-300
                           hover:scale-105 group animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`bg-gradient-to-r ${form.color} p-4 rounded-xl mr-4
                                   group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${themeClasses.textPrimary} group-hover:text-blue-600
                                     dark:group-hover:text-blue-400 high-contrast:group-hover:text-yellow-300
                                     transition-colors duration-200`}>
                        {form.title}
                      </h3>
                      <p className={`text-sm ${themeClasses.textMuted} font-medium`}>
                        {form.course}
                      </p>
                    </div>
                  </div>

                  <p className={`${themeClasses.textSecondary} mb-8 leading-relaxed`}>
                    {form.description}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href={`/forms/${form.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                               high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-500
                               text-white dark:text-white high-contrast:text-black
                               high-contrast:font-bold text-center py-3 px-4 rounded-lg font-semibold
                               transition-all duration-200 hover:scale-105
                               focus:outline-none focus:ring-2 focus:ring-offset-2
                               shadow-md hover:shadow-lg"
                      style={{ color: 'white' }}
                    >
                      Preencher Formulário
                    </Link>

                    <Tooltip content="Gerar link pré-preenchido para este formulário">
                      <Link
                        href={`/forms/${form.id}/generator`}
                        className={`flex items-center justify-center px-4 py-3 rounded-lg
                                   transition-all duration-200 hover:scale-105
                                   focus:outline-none focus:ring-2 focus:ring-offset-2
                                   ${themeClasses.btnSecondary}`}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className={`mt-20 ${themeClasses.card} p-10 animate-fade-in`}>
          <div className="text-center mb-12">
            <h3 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>
              O que o EvalTCC faz
            </h3>
            <p className={`${themeClasses.textSecondary} text-lg max-w-2xl mx-auto`}>
              Sistema completo para digitalizar e simplificar a avaliação de Trabalhos de Conclusão de Curso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className={`${themeClasses.bgAccent} p-6 rounded-2xl inline-block mb-6
                             group-hover:scale-110 transition-transform duration-300`}>
                <FileText className={`h-10 w-10 ${themeClasses.textPrimary}`} />
              </div>
              <h4 className={`font-bold text-xl ${themeClasses.textPrimary} mb-3`}>
                Formulários Digitais
              </h4>
              <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                Substitui formulários em papel por versões digitais responsivas.
                Funciona em qualquer dispositivo - computador, tablet ou celular.
              </p>
            </div>

            <div className="text-center group">
              <div className={`${themeClasses.bgAccent} p-6 rounded-2xl inline-block mb-6
                             group-hover:scale-110 transition-transform duration-300`}>
                <ExternalLink className={`h-10 w-10 ${themeClasses.textPrimary}`} />
              </div>
              <h4 className={`font-bold text-xl ${themeClasses.textPrimary} mb-3`}>
                Links Inteligentes
              </h4>
              <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                Gera links que pré-preenchem automaticamente os dados do aluno.
                Economiza tempo e reduz erros de digitação.
              </p>
            </div>

            <div className="text-center group">
              <div className={`${themeClasses.bgAccent} p-6 rounded-2xl inline-block mb-6
                             group-hover:scale-110 transition-transform duration-300`}>
                <CheckCircle className={`h-10 w-10 ${themeClasses.textPrimary}`} />
              </div>
              <h4 className={`font-bold text-xl ${themeClasses.textPrimary} mb-3`}>
                Geração de PDF
              </h4>
              <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                Converte automaticamente os formulários preenchidos em PDFs profissionais.
                Pronto para arquivo e documentação oficial.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${themeClasses.bgPrimary} border-t ${themeClasses.border} mt-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className={`p-3 rounded-xl ${themeClasses.bgAccent}`}>
                <GraduationCap className={`h-8 w-8 ${themeClasses.textPrimary}`} />
              </div>
            </div>

            <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-2`}>
              EvalTCC
            </h3>

            <p className={`${themeClasses.textSecondary} mb-6 max-w-md mx-auto`}>
              Plataforma moderna para avaliação de Trabalhos de Conclusão de Curso
            </p>

            <div className={`text-sm ${themeClasses.textMuted} space-y-3`}>
              <p>
                © 2025 Sistema EvalTCC - Desenvolvido por <span className="font-semibold">Murilo Leal</span>
              </p>

              {/* Links do desenvolvedor */}
              <div className="flex justify-center gap-6">
                <a
                  href="https://github.com/muriloleal13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.textPrimary}
                           transition-colors duration-200 flex items-center gap-2 text-sm`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>

                <a
                  href="https://linkedin.com/in/murilo-leal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.textPrimary}
                           transition-colors duration-200 flex items-center gap-2 text-sm`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>

              <p>
                Otimizado para cursos de Ciência da Computação e Sistemas de Informação
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400">
              <p className={`text-xs ${themeClasses.textMuted}`}>
                Sistema 100% client-side • Seus dados permanecem seguros no seu dispositivo
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
