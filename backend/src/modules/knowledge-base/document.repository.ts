import { db } from '../../database'
import { Document } from './document.types'

export class DocumentRepository {
  async create(data: { title: string; content: string; tenant_id: string }): Promise<Document> {
    const [document] = await db('documents')
      .insert(data)
      .returning('*')
    
    return document
  }

  async findByTenantId(tenant_id: string): Promise<Document[]> {
    const documents = await db('documents')
      .where({ tenant_id })
      .orderBy('updated_at', 'desc')
    
    return documents
  }

  async update(id: string, tenant_id: string, data: { title?: string; content?: string }): Promise<Document> {
    const [document] = await db('documents')
      .where({ id, tenant_id })
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return document
  }

  async delete(id: string, tenant_id: string): Promise<void> {
    await db('documents')
      .where({ id, tenant_id })
      .delete()
  }
} 