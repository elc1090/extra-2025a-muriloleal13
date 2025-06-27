import { PrefilledData, FormType } from '@/types/forms';

export const generatePrefilledUrl = (
  formType: FormType,
  data: PrefilledData,
  baseUrl?: string
): string => {
  const base = baseUrl || window.location.origin;
  const params = new URLSearchParams();


  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  return `${base}/forms/${formType}?${params.toString()}`;
};

export const parseUrlParams = (): PrefilledData => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const data: PrefilledData = {};


  const validFields = [
    'studentName',
    'registration',
    'course',
    'advisor',
    'coadvisor',
    'title',
    'semester',
    'year',
    'evaluatorName',
    'evaluatorInstitution',
    'evaluationDate'
  ];

  validFields.forEach(field => {
    const value = params.get(field);
    if (value) {
      (data as any)[field] = value;
    }
  });

  return data;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {

      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Erro ao copiar para a área de transferência:', error);
    return false;
  }
};

export const shareUrl = async (url: string, title: string): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        url
      });
      return true;
    } else {
      // Fallback: copiar para área de transferência
      return await copyToClipboard(url);
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
    return false;
  }
};

export const getFormTypeFromPath = (pathname: string): FormType | null => {
  const match = pathname.match(/\/forms\/(.+)/);
  if (!match) return null;

  const formType = match[1];
  const validTypes: FormType[] = [
    'avaliacao_andamento_cc',
    'avaliacao_final_cc',
    'avaliacao_final_si',
    'ata_apresentacao'
  ];

  return validTypes.includes(formType as FormType) ? formType as FormType : null;
};

export const getFormTitle = (formType: FormType): string => {
  const titles = {
    avaliacao_andamento_cc: 'Avaliação de Andamento - Ciência da Computação',
    avaliacao_final_cc: 'Avaliação Final - Ciência da Computação',
    avaliacao_final_si: 'Avaliação Final - Sistemas de Informação',
    ata_apresentacao: 'Ata de Apresentação de TCC'
  };

  return titles[formType];
};

export const getFormDescription = (formType: FormType): string => {
  const descriptions = {
    avaliacao_andamento_cc: 'Formulário para avaliação do andamento do Trabalho de Conclusão de Curso do curso de Ciência da Computação',
    avaliacao_final_cc: 'Formulário para avaliação final do Trabalho de Conclusão de Curso do curso de Ciência da Computação',
    avaliacao_final_si: 'Formulário para avaliação final do Trabalho de Conclusão de Curso do curso de Sistemas de Informação',
    ata_apresentacao: 'Ata para registro da apresentação do Trabalho de Conclusão de Curso'
  };

  return descriptions[formType];
};
