import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DocumentService, CreateDocumentDTO, UpdateDocumentDTO } from '@/services/document-service'
import { toast } from 'sonner'

export function useDocuments() {
  const queryClient = useQueryClient()

  const documents = useQuery({
    queryKey: ['documents'],
    queryFn: DocumentService.list
  })

  const createDocument = useMutation({
    mutationFn: (data: CreateDocumentDTO) => DocumentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Documento criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar documento')
    }
  })

  const updateDocument = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentDTO }) => 
      DocumentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Documento atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar documento')
    }
  })

  const deleteDocument = useMutation({
    mutationFn: DocumentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Documento excluído com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao excluir documento')
    }
  })

  return {
    documents,
    createDocument,
    updateDocument,
    deleteDocument
  }
} 