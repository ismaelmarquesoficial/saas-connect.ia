'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DocumentEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string; content: string }) => void
  initialData?: {
    title: string
    content: string
  }
}

export const DocumentEditor = ({ isOpen, onClose, onSave, initialData }: DocumentEditorProps): JSX.Element => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await onSave({ title, content })
      onClose()
    } catch (error) {
      console.error('Erro ao salvar documento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Documento' : 'Novo Documento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Título
            </label>
            <Input
              id="title"
              placeholder="Digite o título do documento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Conteúdo
            </label>
            <Textarea
              id="content"
              placeholder="Digite o conteúdo do documento..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 