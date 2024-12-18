import { Request, Response } from 'express'
import { pool } from '../../../lib/db'
import { DocumentProcessor } from '../services/document-processor'

interface AuthenticatedRequest extends Request {
  user: {
    id: string
    tenant_id: string
    email: string
  }
}

export class KnowledgeBaseController {
  private documentProcessor: DocumentProcessor

  constructor() {
    this.documentProcessor = new DocumentProcessor()
  }

  uploadFile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' })
      }

      const content = await this.documentProcessor.processFile(req.file)
      
      const result = await pool.query(
        `INSERT INTO knowledge_documents 
         (tenant_id, title, content, file_path, file_type, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          req.user.tenant_id,
          req.file.originalname,
          content,
          req.file.path,
          req.file.mimetype,
          req.user.id
        ]
      )

      res.json(result.rows[0])
    } catch (error) {
      console.error('Erro no upload:', error)
      res.status(500).json({ error: 'Erro ao processar arquivo' })
    }
  }

  listDocuments = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT id, title, file_type, created_at, status 
         FROM knowledge_documents 
         WHERE tenant_id = $1 
         ORDER BY created_at DESC`,
        [req.user.tenant_id]
      )

      res.json(result.rows)
    } catch (error) {
      console.error('Erro ao listar documentos:', error)
      res.status(500).json({ error: 'Erro ao listar documentos' })
    }
  }

  deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params

    try {
      await pool.query(
        'DELETE FROM knowledge_documents WHERE id = $1 AND tenant_id = $2',
        [id, req.user.tenant_id]
      )

      res.json({ message: 'Documento excluído com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir documento:', error)
      res.status(500).json({ error: 'Erro ao excluir documento' })
    }
  }

  getDocument = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params

    try {
      const result = await pool.query(
        `SELECT * FROM knowledge_documents 
         WHERE id = $1 AND tenant_id = $2`,
        [id, req.user.tenant_id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Documento não encontrado' })
      }

      res.json(result.rows[0])
    } catch (error) {
      console.error('Erro ao buscar documento:', error)
      res.status(500).json({ error: 'Erro ao buscar documento' })
    }
  }

  updateDocument = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params
    const { title, content } = req.body

    try {
      const result = await pool.query(
        `UPDATE knowledge_documents 
         SET title = $1, content = $2, updated_by = $3, updated_at = NOW()
         WHERE id = $4 AND tenant_id = $5
         RETURNING *`,
        [title, content, req.user.id, id, req.user.tenant_id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Documento não encontrado' })
      }

      res.json(result.rows[0])
    } catch (error) {
      console.error('Erro ao atualizar documento:', error)
      res.status(500).json({ error: 'Erro ao atualizar documento' })
    }
  }

  createDocument = async (req: AuthenticatedRequest, res: Response) => {
    const { title, content } = req.body

    try {
      const result = await pool.query(
        `INSERT INTO knowledge_documents 
         (tenant_id, title, content, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $4)
         RETURNING *`,
        [req.user.tenant_id, title, content, req.user.id]
      )

      res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Erro ao criar documento:', error)
      res.status(500).json({ error: 'Erro ao criar documento' })
    }
  }

  // ... outros métodos do controlador ...
}
