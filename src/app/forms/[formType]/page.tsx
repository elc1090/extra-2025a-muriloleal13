'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Download, Save, CheckCircle, AlertCircle } from 'lucide-react';

import { Header } from '@/components/Header';
import { FormField } from '@/components/FormField';
import { EvaluationTable } from '@/components/EvaluationTable';
import { AtaForm } from '@/components/AtaForm';
import { FormType, FormData, StudentInfo, EvaluatorInfo } from '@/types/forms';
import { parseUrlParams, getFormTitle, getFormDescription } from '@/utils/urlUtils';
import { generateFormPDF } from '@/utils/pdfGenerator';
import { useThemeClasses } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface FormValues {
  studentInfo: StudentInfo;
  evaluatorInfo: EvaluatorInfo;
  evaluatorInfo2?: EvaluatorInfo;
  evaluatorInfo3?: EvaluatorInfo;
  evaluationDate: string;
  presentationTime?: string;
  room?: string;
  finalDeliveryDate?: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  generalComments: string;
  finalScore: number;
  signatures?: {
    orientador?: string;
    avaliador1?: string;
    avaliador2?: string;
    estudante?: string;
    avaliador?: string;
  };
}

export default function FormPage() {
  const params = useParams();
  const formType = params.formType as FormType;
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const themeClasses = useThemeClasses();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      studentInfo: {
        name: '',
        registration: '',
        course: formType.includes('cc') ? 'CC' : 'SI',
        advisor: '',
        coadvisor: '',
        title: '',
        semester: '',
        year: ''
      },
      evaluatorInfo: {
        name: '',
        institution: 'UFSM',
        role: 'banca'
      },
      evaluatorInfo2: {
        name: '',
        institution: 'UFSM',
        role: 'banca'
      },
      evaluatorInfo3: {
        name: '',
        institution: 'UFSM',
        role: 'banca'
      },
      evaluationDate: new Date().toISOString().split('T')[0],
      presentationTime: '',
      room: '',
      finalDeliveryDate: '',
      scores: {},
      comments: {},
      generalComments: '',
      finalScore: 0
    }
  });

  useEffect(() => {
    const urlData = parseUrlParams();
    if (urlData.studentName) setValue('studentInfo.name', urlData.studentName);
    if (urlData.registration) setValue('studentInfo.registration', urlData.registration);
    if (urlData.course) setValue('studentInfo.course', urlData.course);
    if (urlData.advisor) setValue('studentInfo.advisor', urlData.advisor);
    if (urlData.coadvisor) setValue('studentInfo.coadvisor', urlData.coadvisor);
    if (urlData.title) setValue('studentInfo.title', urlData.title);
    if (urlData.semester) setValue('studentInfo.semester', urlData.semester);
    if (urlData.year) setValue('studentInfo.year', urlData.year);
    if (urlData.evaluatorName) setValue('evaluatorInfo.name', urlData.evaluatorName);
    if (urlData.evaluatorInstitution) setValue('evaluatorInfo.institution', urlData.evaluatorInstitution);
    if (urlData.evaluationDate) setValue('evaluationDate', urlData.evaluationDate);
  }, [setValue]);

  const courseOptions = [
    { value: 'CC', label: 'Ciência da Computação' },
    { value: 'SI', label: 'Sistemas de Informação' }
  ];

  const roleOptions = [
    { value: 'orientador', label: 'Orientador' },
    { value: 'coorientador', label: 'Coorientador' },
    { value: 'banca', label: 'Membro da Banca' },
    { value: 'coordenador', label: 'Coordenador' }
  ];

  const onSubmit = (data: FormValues) => {
    const formData: FormData = {
      id: `${formType}_${Date.now()}`,
      type: formType,
      studentInfo: data.studentInfo,
      evaluatorInfo: data.evaluatorInfo,
      evaluatorInfo2: data.evaluatorInfo2,
      evaluatorInfo3: data.evaluatorInfo3,
      evaluationDate: data.evaluationDate,
      presentationTime: data.presentationTime,
      room: data.room,
      finalDeliveryDate: data.finalDeliveryDate,
      scores: Object.entries(data.scores).map(([criteriaId, score]) => ({
        criteriaId,
        score,
        comments: data.comments[criteriaId]
      })),
      generalComments: data.generalComments,
      finalScore: data.finalScore,
      approved: data.finalScore >= 6,
      signatures: data.signatures,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };


    generateFormPDF(formData);
  };

  const handleSaveForm = async () => {
    setSaveStatus('saving');
    try {
      const formData = watch();
      localStorage.setItem(`tcc_form_${formType}`, JSON.stringify(formData));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleLoadForm = () => {
    try {
      const savedData = localStorage.getItem(`tcc_form_${formType}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        Object.entries(data).forEach(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(key as any, value);
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  if (!formType || !['avaliacao_andamento_cc', 'avaliacao_final_cc', 'avaliacao_final_si', 'ata_apresentacao'].includes(formType)) {
    return (
      <div className={`min-h-screen ${themeClasses.bgSecondary} flex items-center justify-center`}>
        <div className={`text-center ${themeClasses.card} p-8 max-w-md mx-4`}>
          <AlertCircle className={`h-16 w-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
          <h1 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>
            Formulário não encontrado
          </h1>
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
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bgSecondary}`}>
      {/* Header */}
      <Header
        showBackButton={true}
        title={getFormTitle(formType)}
        subtitle={getFormDescription(formType)}
      />

      {/* Status Bar */}
      {saveStatus !== 'idle' && (
        <div className={`${themeClasses.bgPrimary} border-b ${themeClasses.border} px-4 py-2`}>
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            {saveStatus === 'saving' && (
              <div className={`flex items-center gap-2 ${themeClasses.textSecondary}`}>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span className="text-sm">Salvando...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className={`flex items-center gap-2 ${themeClasses.success} px-3 py-1 rounded-full`}>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Salvo com sucesso!</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className={`flex items-center gap-2 ${themeClasses.error} px-3 py-1 rounded-full`}>
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Erro ao salvar</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className={`${themeClasses.bgPrimary} border-b ${themeClasses.border} px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex justify-end gap-3">
          <button
            type="button"
            onClick={handleLoadForm}
            className={`${themeClasses.btnSecondary} px-4 py-2 rounded-lg text-sm font-medium
                       transition-all duration-200 hover:scale-105`}
          >
            Carregar Salvo
          </button>

          <button
            type="button"
            onClick={handleSaveForm}
            disabled={saveStatus === 'saving'}
            className={`${themeClasses.btnPrimary} px-4 py-2 rounded-lg text-sm font-medium
                       transition-all duration-200 hover:scale-105 disabled:opacity-50
                       disabled:cursor-not-allowed flex items-center gap-2`}
          >
            <Save className="h-4 w-4" />
            {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Progresso'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados do Trabalho - Não exibir para ata */}
          {formType !== 'ata_apresentacao' && (
            <div className={`${themeClasses.card} p-8 animate-slide-up`}>
              <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
                <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
                  <CheckCircle className={`h-5 w-5 ${themeClasses.textPrimary}`} />
                </div>
                Dados do Trabalho
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Nome do Aluno"
                  name="studentInfo.name"
                  register={register}
                  error={errors.studentInfo?.name}
                  required
                />

                <FormField
                  label="Matrícula"
                  name="studentInfo.registration"
                  register={register}
                  error={errors.studentInfo?.registration}
                  required
                />

                <FormField
                  label="Curso"
                  name="studentInfo.course"
                  type="select"
                  register={register}
                  error={errors.studentInfo?.course}
                  options={courseOptions}
                  required
                />

                <FormField
                  label="Semestre/Ano"
                  name="studentInfo.semester"
                  register={register}
                  error={errors.studentInfo?.semester}
                  placeholder="Ex: 2025/1"
                  required
                />

                <FormField
                  label="Orientador"
                  name="studentInfo.advisor"
                  register={register}
                  error={errors.studentInfo?.advisor}
                  required
                />

                <FormField
                  label="Coorientador"
                  name="studentInfo.coadvisor"
                  register={register}
                  error={errors.studentInfo?.coadvisor}
                />
              </div>

              <FormField
                label="Título do Trabalho"
                name="studentInfo.title"
                register={register}
                error={errors.studentInfo?.title}
                required
              />
            </div>
          )}

          {/* Dados do Avaliador - Não exibir para ata */}
          {formType !== 'ata_apresentacao' && (
            <div className={`${themeClasses.card} p-8 animate-slide-up`} style={{ animationDelay: '100ms' }}>
              <h3 className={`text-xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center gap-3`}>
                <div className={`p-2 rounded-lg ${themeClasses.bgAccent}`}>
                  <CheckCircle className={`h-5 w-5 ${themeClasses.textPrimary}`} />
                </div>
                Dados do Avaliador
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Nome do Avaliador"
                  name="evaluatorInfo.name"
                  register={register}
                  error={errors.evaluatorInfo?.name}
                  required
                />

                <FormField
                  label="Instituição"
                  name="evaluatorInfo.institution"
                  register={register}
                  error={errors.evaluatorInfo?.institution}
                  required
                />

                <FormField
                  label="Função"
                  name="evaluatorInfo.role"
                  type="select"
                  register={register}
                  error={errors.evaluatorInfo?.role}
                  options={roleOptions}
                  required
                />
              </div>

              <FormField
                label="Data da Avaliação"
                name="evaluationDate"
                type="date"
                register={register}
                error={errors.evaluationDate}
                required
              />
            </div>
          )}

          {/* Tabela de Avaliação ou Formulário de Ata */}
          {formType === 'ata_apresentacao' ? (
            <AtaForm
              register={register}
              watch={watch}
              setValue={setValue}
            />
          ) : (
            <EvaluationTable
              formType={formType}
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
          )}

          {/* Botão de Submissão */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className={`${themeClasses.btnPrimary} px-8 py-4 rounded-xl text-lg font-bold
                         transition-all duration-200 hover:scale-105 hover:shadow-lg
                         focus:outline-none focus:ring-4 focus:ring-offset-2
                         flex items-center gap-3 animate-fade-in`}
              style={{ animationDelay: '300ms' }}
            >
              <Download className="h-6 w-6" />
              Gerar PDF do Formulário
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
