import pdf from 'pdf-parse';
import { AppError } from '../../../shared/middlewares/error-handler';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    throw new AppError('Erro ao processar arquivo PDF', 400);
  }
} 