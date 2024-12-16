import { extractTextFromPDF } from './pdf-extractor';
import { extractTextFromOffice } from './office-extractor';
import { extractTextFromImage } from './image-extractor';
import { AppError } from '../../../shared/middlewares/error-handler';

export interface ProcessedDocument {
  content: string;
  tags: string[];
}

type DocumentTag = 'pdf' | 'word' | 'image' | 'text' | 'large';

export async function processDocument(file: Express.Multer.File): Promise<ProcessedDocument> {
  try {
    let content = '';
    const tags: DocumentTag[] = [];

    // Adicionar tag baseada no tipo do arquivo
    if (file.mimetype.includes('pdf')) {
      tags.push('pdf');
      content = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype.includes('word')) {
      tags.push('word');
      content = await extractTextFromOffice(file.buffer);
    } else if (file.mimetype.includes('image')) {
      tags.push('image');
      content = await extractTextFromImage(file.buffer);
    } else if (file.mimetype === 'text/plain') {
      tags.push('text');
      content = file.buffer.toString('utf-8');
    } else {
      throw new AppError('Tipo de arquivo não suportado', 400);
    }

    // Adicionar tag baseada no tamanho do arquivo
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      tags.push('large');
    }

    return {
      content: content.trim(),
      tags
    };
  } catch (error) {
    console.error('Erro ao processar documento:', error);
    throw new AppError('Erro ao processar documento', 400);
  }
} 