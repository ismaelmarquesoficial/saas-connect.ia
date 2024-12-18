import { Request, Response } from 'express'
import { pool } from '../../lib/db'

export class DocumentController {
  async create(req: Request, res: Response) {
    const { title, content } = req.body
    const tenantId = req.user?.tenant_id

    const { rows: [document] } = await pool.query(
      'INSERT INTO documents (title, content, tenant_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, tenantId]
    )

    return res.status(201).json(document)
  }

  async list(req: Request, res: Response) {
    const tenantId = req.user?.tenant_id

    const { rows } = await pool.query(
      'SELECT * FROM documents WHERE tenant_id = $1 ORDER BY updated_at DESC',
      [tenantId]
    )

    return res.json(rows)
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { title, content } = req.body
    const tenantId = req.user?.tenant_id

    const { rows: [document] } = await pool.query(
      'UPDATE documents SET title = $1, content = $2 WHERE id = $3 AND tenant_id = $4 RETURNING *',
      [title, content, id, tenantId]
    )

    return res.json(document)
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params
    const tenantId = req.user?.tenant_id

    await pool.query(
      'DELETE FROM documents WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    )

    return res.status(204).send()
  }
} 