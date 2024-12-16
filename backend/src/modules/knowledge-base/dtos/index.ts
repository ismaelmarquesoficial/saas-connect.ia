// DTOs para Categorias
export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

// DTOs para Documentos
export interface CreateDocumentDTO {
  title: string;
  content: string;
  categoryId?: string;
  status?: 'draft' | 'published' | 'archived';
  type: 'text' | 'file' | 'link';
  metadata?: Record<string, any>;
}

export interface UpdateDocumentDTO {
  title?: string;
  content?: string;
  categoryId?: string;
  status?: 'draft' | 'published' | 'archived';
  metadata?: Record<string, any>;
}

export interface SearchDocumentsDTO {
  query?: string;
  categoryId?: string;
  status?: 'draft' | 'published' | 'archived';
  page?: number;
  limit?: number;
}

// DTOs para Agentes
export interface LinkAgentDTO {
  agentId: string;
  documentId: string;
}

// DTOs para Respostas
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Document {
  id: string;
  tenant_id: string;
  category_id?: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  type: 'text' | 'file' | 'link';
  metadata: Record<string, any>;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
} 