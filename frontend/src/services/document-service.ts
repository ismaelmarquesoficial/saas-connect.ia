import { api } from '@/lib/axios'

export interface Document {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateDocumentDTO {
  title: string
  content: string
}

export interface UpdateDocumentDTO {
  title?: string
  content?: string
}

export const DocumentService = {
  async list() {
    const response = await api.get<Document[]>('/documents')
    return response.data
  },

  async create(data: CreateDocumentDTO) {
    const response = await api.post<Document>('/documents', data)
    return response.data
  },

  async update(id: string, data: UpdateDocumentDTO) {
    const response = await api.put<Document>(`/documents/${id}`, data)
    return response.data
  },

  async delete(id: string) {
    await api.delete(`/documents/${id}`)
  },

  async getById(id: string) {
    const response = await api.get<Document>(`/documents/${id}`)
    return response.data
  }
} 