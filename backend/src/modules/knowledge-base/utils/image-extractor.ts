import { createWorker } from 'tesseract.js';
import { AppError } from '../../../shared/middlewares/error-handler';

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  try {
    const worker = await createWorker('por');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('Erro ao extrair texto da imagem:', error);
    throw new AppError('Erro ao processar imagem', 400);
  }
} 