import { pool } from '../../lib/db';
import { AppError } from '../../shared/middlewares/error-handler';
import { processDocument } from './utils/document-processor';

interface CreateDocumentParams {
  title: string;
  content: string;
  tags?: string[];
  userId: string;
}

interface UpdateDocumentParams extends CreateDocumentParams {}

export class KnowledgeBaseService {
  async createDocument(params: CreateDocumentParams) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO documents (title, content, user_id) 
         VALUES ($1, $2, $3) 
         RETURNING id, title, content, created_at, updated_at`,
        [params.title, params.content, params.userId]
      );

      const document = result.rows[0];

      if (params.tags && params.tags.length > 0) {
        for (const tag of params.tags) {
          await client.query(
            `INSERT INTO document_tags (document_id, tag) 
             VALUES ($1, $2)`,
            [document.id, tag]
          );
        }
      }

      await client.query('COMMIT');
      return document;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getDocuments(userId: string) {
    const result = await pool.query(
      `SELECT d.*, array_agg(dt.tag) as tags
       FROM documents d
       LEFT JOIN document_tags dt ON d.id = dt.document_id
       WHERE d.user_id = $1
       GROUP BY d.id
       ORDER BY d.created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  async getDocumentById(id: string, userId: string) {
    const result = await pool.query(
      `SELECT d.*, array_agg(dt.tag) as tags
       FROM documents d
       LEFT JOIN document_tags dt ON d.id = dt.document_id
       WHERE d.id = $1 AND d.user_id = $2
       GROUP BY d.id`,
      [id, userId]
    );

    const document = result.rows[0];
    if (!document) {
      throw new AppError('Documento não encontrado', 404);
    }

    return document;
  }

  async updateDocument(id: string, params: UpdateDocumentParams) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const existingDoc = await client.query(
        'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
        [id, params.userId]
      );

      if (!existingDoc.rows[0]) {
        throw new AppError('Documento não encontrado', 404);
      }

      const result = await client.query(
        `UPDATE documents 
         SET title = $1, content = $2, updated_at = NOW() 
         WHERE id = $3 AND user_id = $4
         RETURNING id, title, content, created_at, updated_at`,
        [params.title, params.content, id, params.userId]
      );

      // Atualizar tags
      await client.query('DELETE FROM document_tags WHERE document_id = $1', [id]);

      if (params.tags && params.tags.length > 0) {
        for (const tag of params.tags) {
          await client.query(
            `INSERT INTO document_tags (document_id, tag) 
             VALUES ($1, $2)`,
            [id, tag]
          );
        }
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteDocument(id: string, userId: string) {
    const result = await pool.query(
      'DELETE FROM documents WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rowCount === 0) {
      throw new AppError('Documento não encontrado', 404);
    }
  }

  async searchDocuments(query: string, userId: string) {
    const result = await pool.query(
      `SELECT d.*, array_agg(dt.tag) as tags
       FROM documents d
       LEFT JOIN document_tags dt ON d.id = dt.document_id
       WHERE d.user_id = $1
       AND (
         d.title ILIKE $2 OR
         d.content ILIKE $2 OR
         EXISTS (
           SELECT 1 FROM document_tags dt2
           WHERE dt2.document_id = d.id
           AND dt2.tag ILIKE $2
         )
       )
       GROUP BY d.id
       ORDER BY d.created_at DESC`,
      [userId, `%${query}%`]
    );

    return result.rows;
  }

  async processUploadedDocument(file: Express.Multer.File, userId: string) {
    try {
      const { content, tags } = await processDocument(file);

      return this.createDocument({
        title: file.originalname,
        content,
        userId,
        tags
      });
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      throw new AppError('Erro ao processar documento', 400);
    }
  }

  async addTag(documentId: string, tag: string, userId: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const doc = await client.query(
        'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
        [documentId, userId]
      );

      if (!doc.rows[0]) {
        throw new AppError('Documento não encontrado', 404);
      }

      await client.query(
        `INSERT INTO document_tags (document_id, tag) 
         VALUES ($1, $2)
         ON CONFLICT (document_id, tag) DO NOTHING`,
        [documentId, tag]
      );

      const result = await client.query(
        `SELECT d.*, array_agg(dt.tag) as tags
         FROM documents d
         LEFT JOIN document_tags dt ON d.id = dt.document_id
         WHERE d.id = $1
         GROUP BY d.id`,
        [documentId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async removeTag(documentId: string, tag: string, userId: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const doc = await client.query(
        'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
        [documentId, userId]
      );

      if (!doc.rows[0]) {
        throw new AppError('Documento não encontrado', 404);
      }

      await client.query(
        'DELETE FROM document_tags WHERE document_id = $1 AND tag = $2',
        [documentId, tag]
      );

      const result = await client.query(
        `SELECT d.*, array_agg(dt.tag) as tags
         FROM documents d
         LEFT JOIN document_tags dt ON d.id = dt.document_id
         WHERE d.id = $1
         GROUP BY d.id`,
        [documentId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getTags(userId: string) {
    const result = await pool.query(
      `SELECT DISTINCT tag
       FROM document_tags dt
       JOIN documents d ON d.id = dt.document_id
       WHERE d.user_id = $1
       ORDER BY tag`,
      [userId]
    );

    return result.rows.map(row => row.tag);
  }

  async getDocumentsByTag(tag: string, userId: string) {
    const result = await pool.query(
      `SELECT d.*, array_agg(dt2.tag) as tags
       FROM documents d
       JOIN document_tags dt ON d.id = dt.document_id
       LEFT JOIN document_tags dt2 ON d.id = dt2.document_id
       WHERE d.user_id = $1 AND dt.tag = $2
       GROUP BY d.id
       ORDER BY d.created_at DESC`,
      [userId, tag]
    );

    return result.rows;
  }
} 