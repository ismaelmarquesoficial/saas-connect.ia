import { z } from 'zod';

// Schemas para Categorias
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional()
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional()
  })
});

// Schemas para Documentos
export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    content: z.string().min(1),
    categoryId: z.string().uuid().optional(),
    type: z.enum(['text', 'file', 'link']),
    status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
    metadata: z.record(z.any()).optional()
  })
});

export const updateDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().min(1).optional(),
    categoryId: z.string().uuid().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    metadata: z.record(z.any()).optional()
  })
});

// Schemas para Agentes
export const linkAgentSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    agentId: z.string().uuid()
  })
});

export const unlinkAgentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
    agentId: z.string().uuid()
  })
});

// Schemas para Busca
export const searchDocumentsSchema = z.object({
  query: z.object({
    query: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional()
  })
}); 