import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormData, EVALUATION_CRITERIA } from '@/types/forms';

export class PDFGenerator {
  private doc: jsPDF;
  private readonly pageHeight = 297; // A4 height in mm
  private readonly marginBottom = 20; // Bottom margin
  private currentCourse: string = '';

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
  }

  private checkPageBreak(currentY: number, requiredSpace: number): number {
    if (currentY + requiredSpace > this.pageHeight - this.marginBottom) {
      this.doc.addPage();
      // Adicionar cabeçalho simplificado na nova página
      if (this.currentCourse) {
        this.addPageHeader('', this.currentCourse);
      }
      return 40; // Reset to after header
    }
    return currentY;
  }

  private addPageHeader(_title: string, course: string) {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('UNIVERSIDADE FEDERAL DE SANTA MARIA', 105, 15, { align: 'center' });
    this.doc.setFontSize(10);
    this.doc.text('CENTRO DE TECNOLOGIA', 105, 22, { align: 'center' });
    const courseText = course === 'CC' ? 'CURSO DE CIÊNCIA DA COMPUTAÇÃO' : 'CURSO DE SISTEMAS DE INFORMAÇÃO';
    this.doc.text(courseText, 105, 29, { align: 'center' });
    this.doc.line(20, 32, 190, 32);
  }

  private addHeader(title: string, course: string) {

    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('UNIVERSIDADE FEDERAL DE SANTA MARIA', 105, 20, { align: 'center' });

    this.doc.setFontSize(14);
    this.doc.text('CENTRO DE TECNOLOGIA', 105, 28, { align: 'center' });

    this.doc.setFontSize(12);
    const courseText = course === 'CC' ?
      'CURSO DE CIÊNCIA DA COMPUTAÇÃO' :
      'CURSO DE SISTEMAS DE INFORMAÇÃO';
    this.doc.text(courseText, 105, 36, { align: 'center' });

    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 105, 50, { align: 'center' });


    this.doc.line(20, 55, 190, 55);
  }

  private addStudentInfo(formData: FormData) {
    let yPos = 70;

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DADOS DO TRABALHO', 20, yPos);

    yPos += 10;
    this.doc.setFont('helvetica', 'normal');


    const studentLines = this.doc.splitTextToSize(`Aluno: ${formData.studentInfo.name}`, 170);
    this.doc.text(studentLines, 20, yPos);
    yPos += studentLines.length * 7;

    if (formData.studentInfo.registration) {
      this.doc.text(`Matrícula: ${formData.studentInfo.registration}`, 20, yPos);
      yPos += 7;
    }


    const titleLines = this.doc.splitTextToSize(`Título: ${formData.studentInfo.title}`, 170);
    this.doc.text(titleLines, 20, yPos);
    yPos += titleLines.length * 7;


    const advisorLines = this.doc.splitTextToSize(`Orientador: ${formData.studentInfo.advisor}`, 170);
    this.doc.text(advisorLines, 20, yPos);
    yPos += advisorLines.length * 7;

    if (formData.studentInfo.coadvisor) {
      const coadvisorLines = this.doc.splitTextToSize(`Coorientador: ${formData.studentInfo.coadvisor}`, 170);
      this.doc.text(coadvisorLines, 20, yPos);
      yPos += coadvisorLines.length * 7;
    }

    this.doc.text(`Ano/Semestre: ${formData.studentInfo.semester}`, 20, yPos);
    yPos += 7;

    // Formatação de data que evita problemas de timezone
    const evaluationDate = formData.evaluationDate.includes('T')
      ? formData.evaluationDate.split('T')[0]
      : formData.evaluationDate;
    const [year, month, day] = evaluationDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    this.doc.text(`Data da Avaliação: ${formattedDate}`, 20, yPos);

    return yPos + 15;
  }

  private addEvaluationTable(formData: FormData, startY: number) {
    const criteria = EVALUATION_CRITERIA[formData.type];

    // Calcular espaço necessário para a tabela (cabeçalho + critérios + nota final)
    const tableHeight = 18 + (criteria.length * 8) + 8; // cabeçalho + linhas + nota final
    let yPos = this.checkPageBreak(startY, tableHeight);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('AVALIAÇÃO', 20, yPos);

    yPos += 10;


    this.doc.setFontSize(10);
    this.doc.rect(20, yPos, 120, 8);
    this.doc.rect(140, yPos, 20, 8);
    this.doc.rect(160, yPos, 20, 8);

    this.doc.text('Critério', 22, yPos + 5);
    this.doc.text('Peso', 142, yPos + 5);
    this.doc.text('Nota', 162, yPos + 5);

    yPos += 8;

    let totalScore = 0;
    let totalMaxScore = 0;

    // Adicionar cada critério
    criteria.forEach((criterion) => {
      const score = formData.scores.find(s => s.criteriaId === criterion.id);
      const scoreValue = score?.score || 0;

      this.doc.rect(20, yPos, 120, 8);
      this.doc.rect(140, yPos, 20, 8);
      this.doc.rect(160, yPos, 20, 8);

      this.doc.setFont('helvetica', 'normal');
      this.doc.text(criterion.description, 22, yPos + 5);
      this.doc.text(criterion.weight.toString(), 142, yPos + 5);
      this.doc.text(scoreValue.toString(), 162, yPos + 5);

      // Usar a mesma lógica do form: soma simples das notas
      const validScore = Math.min(scoreValue, criterion.maxScore);
      totalScore += validScore;
      totalMaxScore += criterion.maxScore;

      yPos += 8;
    });

    // Linha da nota final
    this.doc.rect(20, yPos, 120, 8);
    this.doc.rect(140, yPos, 20, 8);
    this.doc.rect(160, yPos, 20, 8);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NOTA FINAL', 22, yPos + 5);
    this.doc.text('', 142, yPos + 5);

    // Usar a mesma fórmula do form: (totalScore / totalMaxScore) * 10
    const finalScore = totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 10).toFixed(1) : '0.0';
    this.doc.text(finalScore, 162, yPos + 5);

    return yPos + 15;
  }

  private addComments(formData: FormData, startY: number) {
    if (!formData.generalComments) return startY;

    // Verificar se há espaço suficiente para o título e pelo menos algumas linhas
    let yPos = this.checkPageBreak(startY, 30);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('OBSERVAÇÕES', 20, yPos);

    yPos += 10;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);

    const lines = this.doc.splitTextToSize(formData.generalComments, 170);

    // Verificar se há espaço suficiente para todos os comentários
    const commentsHeight = lines.length * 5;
    yPos = this.checkPageBreak(yPos, commentsHeight);

    this.doc.text(lines, 20, yPos);

    return yPos + commentsHeight + 10;
  }

  private addSignature(formData: FormData, startY: number) {
    // Verificar se há espaço suficiente para a seção de assinatura (aproximadamente 80mm)
    const requiredSpace = 80;
    const yPos = this.checkPageBreak(startY + 20, requiredSpace);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    if (formData.type === 'ata_apresentacao') {
      // Para ATA - múltiplas assinaturas
      this.addAtaSignatures(formData, yPos);
    } else {
      // Para formulários de avaliação - assinatura do avaliador
      this.addEvaluatorSignature(formData, yPos);
    }
  }

  private addEvaluatorSignature(formData: FormData, startY: number) {
    let yPos = startY;

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ASSINATURA DO AVALIADOR', 20, yPos);
    yPos += 15;


    const signature = formData.signatures?.avaliador || formData.signature;

    if (signature && signature.startsWith('data:image/')) {
      try {

        this.doc.addImage(signature, 'PNG', 20, yPos, 60, 20);
        yPos += 25;
      } catch (error) {
        console.warn('Erro ao adicionar assinatura:', error);

        this.doc.line(20, yPos + 15, 100, yPos + 15);
        yPos += 20;
      }
    } else {

      this.doc.line(20, yPos + 15, 100, yPos + 15);
      yPos += 20;
    }

    this.doc.setFont('helvetica', 'normal');

    // Verificar se os dados do avaliador existem e não estão vazios
    const evaluatorName = (formData.evaluatorInfo?.name && formData.evaluatorInfo.name.trim())
      ? formData.evaluatorInfo.name
      : '_________________________________';
    const evaluatorInstitution = (formData.evaluatorInfo?.institution && formData.evaluatorInfo.institution.trim())
      ? formData.evaluatorInfo.institution
      : '_________________________________';

    const evaluatorNameLines = this.doc.splitTextToSize(evaluatorName, 170);
    this.doc.text(evaluatorNameLines, 20, yPos);
    yPos += evaluatorNameLines.length * 5;

    const institutionLines = this.doc.splitTextToSize(evaluatorInstitution, 170);
    this.doc.text(institutionLines, 20, yPos);
    yPos += institutionLines.length * 5;


    yPos += 15;
    // Formatação de data que evita problemas de timezone
    if (formData.evaluationDate) {
      const evaluationDate = formData.evaluationDate.includes('T')
        ? formData.evaluationDate.split('T')[0]
        : formData.evaluationDate;
      const [year, month, day] = evaluationDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      this.doc.text(`Santa Maria, ${formattedDate}`, 20, yPos);
    } else {
      this.doc.text(`Santa Maria, ___/___/______`, 20, yPos);
    }
  }

  private addAtaSignatures(formData: FormData, startY: number) {
    let yPos = startY;


    if (yPos > 150) {
      this.doc.addPage();
      yPos = 20;
    }

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ASSINATURAS', 20, yPos);
    yPos += 15;

    const signatures = [
      {
        label: 'Assinatura do(a) Orientador(a)',
        name: formData.evaluatorInfo?.name || 'Orientador',
        signature: formData.signatures?.orientador
      },
      {
        label: 'Assinatura do(a) Avaliador(a) 1',
        name: formData.evaluatorInfo2?.name || 'Avaliador 1',
        signature: formData.signatures?.avaliador1
      },
      {
        label: 'Assinatura do(a) Avaliador(a) 2',
        name: formData.evaluatorInfo3?.name || 'Avaliador 2',
        signature: formData.signatures?.avaliador2
      },
      {
        label: 'Assinatura do Estudante',
        name: formData.studentInfo?.name || 'Estudante',
        signature: formData.signatures?.estudante
      }
    ];

    signatures.forEach((sig) => {

      if (yPos > 240) {
        this.doc.addPage();
        yPos = 20;
      }

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);


      const labelLines = this.doc.splitTextToSize(sig.label, 170);
      this.doc.text(labelLines, 20, yPos);
      yPos += labelLines.length * 5 + 3;

      if (sig.signature && sig.signature.startsWith('data:image/')) {
        try {

          this.doc.addImage(sig.signature, 'PNG', 20, yPos, 60, 15);
          yPos += 20;
        } catch (error) {
          console.warn('Erro ao adicionar assinatura:', error);

          this.doc.line(20, yPos + 10, 100, yPos + 10);
          yPos += 15;
        }
      } else {

        this.doc.line(20, yPos + 10, 100, yPos + 10);
        yPos += 15;
      }


      const nameLines = this.doc.splitTextToSize(sig.name, 170);
      this.doc.text(nameLines, 20, yPos);
      yPos += nameLines.length * 5 + 15;
    });


    yPos += 10;
    // Formatação de data que evita problemas de timezone
    if (formData.evaluationDate) {
      const evaluationDate = formData.evaluationDate.includes('T')
        ? formData.evaluationDate.split('T')[0]
        : formData.evaluationDate;
      const [year, month, day] = evaluationDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      this.doc.text(`Santa Maria, ${formattedDate}`, 20, yPos);
    } else {
      this.doc.text(`Santa Maria, ___/___/______`, 20, yPos);
    }
  }

  generateFormPDF(formData: FormData): void {
    const titles = {
      avaliacao_andamento_cc: 'FICHA DE AVALIAÇÃO DE ANDAMENTO DE TCC - CIÊNCIA DA COMPUTAÇÃO',
      avaliacao_final_cc: 'FICHA DE AVALIAÇÃO FINAL DE TCC - CIÊNCIA DA COMPUTAÇÃO',
      avaliacao_final_si: 'FICHA DE AVALIAÇÃO FINAL DE TCC - SISTEMAS DE INFORMAÇÃO',
      ata_apresentacao: 'ATA DE APRESENTAÇÃO DE TCC'
    };

    // Armazenar o curso para uso em quebras de página
    this.currentCourse = formData.studentInfo.course;

    this.addHeader(titles[formData.type], formData.studentInfo.course);

    let currentY = this.addStudentInfo(formData);
    currentY = this.addEvaluationTable(formData, currentY);
    currentY = this.addComments(formData, currentY);
    this.addSignature(formData, currentY);


    const fileName = `${formData.type}_${formData.studentInfo.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    this.doc.save(fileName);
  }

  async generateFromHTML(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      this.doc.addPage();
      this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    this.doc.save(fileName);
  }
}

export const generateFormPDF = (formData: FormData) => {
  const generator = new PDFGenerator();
  generator.generateFormPDF(formData);
};

export const generateHTMLToPDF = async (elementId: string, fileName: string) => {
  const generator = new PDFGenerator();
  await generator.generateFromHTML(elementId, fileName);
};
