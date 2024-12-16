import mammoth from 'mammoth';
import { AppError } from '../../../shared/middlewares/error-handler';

export async function extractTextFromOffice(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Erro ao extrair texto do documento Office:', error);
    throw new AppError('Erro ao processar documento Office', 400);
  }
} 