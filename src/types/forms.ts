export type CourseType = 'CC' | 'SI';

export type FormType =
  | 'avaliacao_andamento_cc'
  | 'avaliacao_final_cc'
  | 'avaliacao_final_si'
  | 'ata_apresentacao';

export interface StudentInfo {
  name: string;
  registration?: string;
  course: CourseType;
  advisor: string;
  coadvisor?: string;
  title: string;
  semester: string;
  year: string;
}

export interface EvaluatorInfo {
  name: string;
  institution: string;
  role: 'orientador' | 'coorientador' | 'banca' | 'coordenador';
}

export interface EvaluationCriteria {
  id: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface EvaluationScore {
  criteriaId: string;
  score: number;
  comments?: string;
}

export interface SignatureData {
  orientador?: string;
  avaliador1?: string;
  avaliador2?: string;
  estudante?: string;
  avaliador?: string; // Para formulários de avaliação (andamento/final)
}

export interface FormData {
  id: string;
  type: FormType;
  studentInfo: StudentInfo;
  evaluatorInfo: EvaluatorInfo;
  evaluatorInfo2?: EvaluatorInfo; // Para ata - segundo avaliador
  evaluatorInfo3?: EvaluatorInfo; // Para ata - terceiro avaliador
  evaluationDate: string;
  scores: EvaluationScore[];
  generalComments?: string;
  finalScore?: number;
  approved?: boolean;
  signature?: string; // Mantido para compatibilidade
  signatures?: SignatureData; // Novas assinaturas estruturadas
  presentationTime?: string; // Para ata - hora da apresentação
  room?: string; // Para ata - sala
  finalDeliveryDate?: string; // Para ata - data final para entrega
  createdAt: string;
  updatedAt: string;
}


export const EVALUATION_CRITERIA = {
  avaliacao_andamento_cc: [
    {
      id: 'apresentacao',
      description: 'Apresentação',
      weight: 1,
      maxScore: 5.0
    },
    {
      id: 'qualidade_conteudo',
      description: 'Qualidade do Conteúdo',
      weight: 1,
      maxScore: 3.0
    },
    {
      id: 'relevancia_originalidade',
      description: 'Relevância e Originalidade',
      weight: 1,
      maxScore: 2.0
    }
  ],
  avaliacao_final_cc: [
    {
      id: 'conteudo_apresentacao',
      description: 'Conteúdo da Apresentação',
      weight: 1,
      maxScore: 2.0
    },
    {
      id: 'utilizacao_tempo_sintese',
      description: 'Utilização do Tempo e Poder de Síntese',
      weight: 1,
      maxScore: 1.0
    },
    {
      id: 'estrutura_trabalho',
      description: 'Estrutura do Trabalho',
      weight: 1,
      maxScore: 1.0
    },
    {
      id: 'relevancia_qualidade_conteudo',
      description: 'Relevância, Originalidade e Qualidade do Conteúdo do Texto',
      weight: 1,
      maxScore: 3.0
    },
    {
      id: 'grau_conhecimento',
      description: 'Grau de Conhecimento Demonstrado no Trabalho Escrito',
      weight: 1,
      maxScore: 2.0
    },
    {
      id: 'adequacao_bibliografia',
      description: 'Adequação da Bibliografia Apresentada',
      weight: 1,
      maxScore: 1.0
    }
  ],
  avaliacao_final_si: [
    {
      id: 'conteudo_apresentacao',
      description: 'Conteúdo da Apresentação',
      weight: 1,
      maxScore: 1.0
    },
    {
      id: 'dominio_recursos_didaticos',
      description: 'Domínio dos Recursos Didáticos',
      weight: 1,
      maxScore: 1.0
    },
    {
      id: 'utilizacao_tempo_sintese',
      description: 'Utilização do Tempo e Poder de Síntese',
      weight: 1,
      maxScore: 1.0
    },
    {
      id: 'estrutura_trabalho',
      description: 'Estrutura do Trabalho',
      weight: 1,
      maxScore: 1.0
    },
    {
      id: 'relevancia_qualidade_conteudo',
      description: 'Relevância, Originalidade e Qualidade do Conteúdo do Texto',
      weight: 1,
      maxScore: 3.0
    },
    {
      id: 'grau_conhecimento',
      description: 'Grau de Conhecimento Demonstrado no Trabalho Escrito',
      weight: 1,
      maxScore: 2.0
    },
    {
      id: 'adequacao_bibliografia',
      description: 'Adequação da Bibliografia Apresentada',
      weight: 1,
      maxScore: 1.0
    }
  ],
  ata_apresentacao: [
    {
      id: 'nota_final',
      description: 'Nota Final',
      weight: 1,
      maxScore: 10.0
    }
  ]
} as const;

export interface PrefilledData {
  studentName?: string;
  registration?: string;
  course?: CourseType;
  advisor?: string;
  coadvisor?: string;
  title?: string;
  semester?: string;
  year?: string;
  evaluatorName?: string;
  evaluatorInstitution?: string;
  evaluationDate?: string;
}

// Configuração de limites de aprovação por curso
export const APPROVAL_LIMITS = {
  CC: 6.0, // Ciência da Computação
  SI: 7.0  // Sistemas de Informação
} as const;

// Função para obter o limite de aprovação baseado no curso
export const getApprovalLimit = (course: CourseType): number => {
  return APPROVAL_LIMITS[course];
};

// Função para verificar se deve mostrar status de aprovação
export const shouldShowApprovalStatus = (approvalLimit?: number): boolean => {
  return approvalLimit !== undefined && approvalLimit > 0;
};
