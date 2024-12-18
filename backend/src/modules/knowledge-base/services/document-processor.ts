import { readFile } from 'fs/promises'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

export class DocumentProcessor {
  async processFile(file: Express.Multer.File) {
    const content = await readFile(file.path)
    
    switch(file.mimetype) {
      case 'application/pdf':
        return await this.processPDF(content)
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await this.processDOCX(content)
      
      case 'text/plain':
        return content.toString()
        
      default:
        throw new Error('Formato não suportado')
    }
  }

  private async processPDF(buffer: Buffer) {
    const data = await pdf(buffer)
    return data.text
  }

  private async processDOCX(buffer: Buffer) {
    const result = await mammoth.extractRawText({buffer})
    return result.value
  }
}
