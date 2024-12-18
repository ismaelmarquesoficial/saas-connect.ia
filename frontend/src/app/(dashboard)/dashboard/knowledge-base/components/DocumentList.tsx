'use client'

import { useDocuments } from '@/hooks/use-documents'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { DocumentEditor } from './DocumentEditor'
import { useState } from 'react'
import { Document } from '@/services/document-service'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function DocumentList() {
  const { documents, createDocument, updateDocument, deleteDocument } = useDocuments()
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const handleCreate = async (data: { title: string; content: string }) => {
    await createDocument.mutateAsync(data)
    setIsEditorOpen(false)
  }

  const handleUpdate = async (data: { title: string; content: string }) => {
    if (!selectedDocument) return
    await updateDocument.mutateAsync({ id: selectedDocument.id, data })
    setIsEditorOpen(false)
    setSelectedDocument(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocument.mutateAsync(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Base de Conhecimento</h2>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      {documents.isLoading ? (
        <div>Carregando...</div>
      ) : documents.error ? (
        <div>Erro ao carregar documentos</div>
      ) : (
        <div className="grid gap-4">
          {documents.data?.map((document) => (
            <div 
              key={document.id} 
              className="p-4 rounded-lg border border-border bg-card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{document.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Atualizado em {format(new Date(document.updated_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedDocument(document)
                      setIsEditorOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DocumentEditor 
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setSelectedDocument(null)
        }}
        onSave={selectedDocument ? handleUpdate : handleCreate}
        initialData={selectedDocument || undefined}
      />
    </div>
  )
}