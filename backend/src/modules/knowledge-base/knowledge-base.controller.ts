import { Request, Response } from 'express';
import { pool } from '../../lib/db';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class KnowledgeBaseController {
  async createDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, content, tags } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        `INSERT INTO documents (title, content, user_id) 
         VALUES ($1, $2, $3) 
         RETURNING id, title, content`,
        [title, content, userId]
      );

      const document = result.rows[0];

      if (tags && tags.length > 0) {
        await Promise.all(
          tags.map(tag =>
            pool.query(
              'INSERT INTO document_tags (document_id, tag) VALUES ($1, $2)',
              [document.id, tag]
            )
          )
        );
      }

      return res.json(document);
    } catch (error) {
      console.error('Error creating document:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getDocuments(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await pool.query(
        `SELECT d.*, array_agg(dt.tag) as tags
         FROM documents d
         LEFT JOIN document_tags dt ON d.id = dt.document_id
         WHERE d.user_id = $1
         GROUP BY d.id`,
        [userId]
      );

      return res.json(result.rows);
    } catch (error) {
      console.error('Error getting documents:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getDocumentById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await pool.query(
        `SELECT d.*, array_agg(dt.tag) as tags
         FROM documents d
         LEFT JOIN document_tags dt ON d.id = dt.document_id
         WHERE d.id = $1 AND d.user_id = $2
         GROUP BY d.id`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Error getting document:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await pool.query(
        `UPDATE documents 
         SET title = $1, content = $2 
         WHERE id = $3 AND user_id = $4
         RETURNING id, title, content`,
        [title, content, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (tags) {
        await pool.query('DELETE FROM document_tags WHERE document_id = $1', [id]);
        await Promise.all(
          tags.map(tag =>
            pool.query(
              'INSERT INTO document_tags (document_id, tag) VALUES ($1, $2)',
              [id, tag]
            )
          )
        );
      }

      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating document:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await pool.query(
        'DELETE FROM documents WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting document:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchDocuments(req: AuthenticatedRequest, res: Response) {
    try {
      const { query } = req.query;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await pool.query(
        `SELECT d.*, array_agg(dt.tag) as tags
         FROM documents d
         LEFT JOIN document_tags dt ON d.id = dt.document_id
         WHERE d.user_id = $1
         AND (d.title ILIKE $2 OR d.content ILIKE $2)
         GROUP BY d.id`,
        [userId, `%${query}%`]
      );

      return res.json(result.rows);
    } catch (error) {
      console.error('Error searching documents:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTags(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await pool.query(
        `SELECT DISTINCT tag
         FROM document_tags dt
         JOIN documents d ON d.id = dt.document_id
         WHERE d.user_id = $1`,
        [userId]
      );

      return res.json(result.rows.map(row => row.tag));
    } catch (error) {
      console.error('Error getting tags:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addTag(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { tag } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await pool.query(
        'INSERT INTO document_tags (document_id, tag) VALUES ($1, $2)',
        [id, tag]
      );

      return res.status(201).json({ message: 'Tag added successfully' });
    } catch (error) {
      console.error('Error adding tag:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async removeTag(req: AuthenticatedRequest, res: Response) {
    try {
      const { id, tag } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await pool.query(
        'DELETE FROM document_tags WHERE document_id = $1 AND tag = $2',
        [id, tag]
      );

      return res.status(204).send();
    } catch (error) {
      console.error('Error removing tag:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async uploadDocument(req: AuthenticatedRequest, res: Response) {
    // Implementação do upload de documento
    res.status(501).json({ error: 'Not implemented' });
  }

  async getDocumentsByTag(req: AuthenticatedRequest, res: Response) {
    try {
      const { tag } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await pool.query(
        `SELECT d.*, array_agg(dt2.tag) as tags
         FROM documents d
         JOIN document_tags dt ON d.id = dt.document_id
         LEFT JOIN document_tags dt2 ON d.id = dt2.document_id
         WHERE d.user_id = $1 AND dt.tag = $2
         GROUP BY d.id`,
        [userId, tag]
      );

      return res.json(result.rows);
    } catch (error) {
      console.error('Error getting documents by tag:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 