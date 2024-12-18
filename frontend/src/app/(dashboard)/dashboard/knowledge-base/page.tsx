'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Upload, FileText, Clock, CheckCircle } from 'lucide-react'
import { DocumentList } from './components/DocumentList'
import { DocumentEditor } from './components/DocumentEditor'

export default function KnowledgeBasePage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const stats = [
    {
      title: 'Total de Documentos',
      value: '0',
      icon: FileText,
      description: 'documentos cadastrados'
    },
    {
      title: 'Documentos Ativos',
      value: '0',
      icon: CheckCircle,
      description: 'em uso'
    },
    {
      title: 'Última Atualização',
      value: '-',
      icon: Clock,
      description: 'nenhuma atualização'
    }
  ]

  const handleSaveDocument = async (data: { title: string; content: string }) => {
    try {
      console.log('Salvando documento:', data)
    } catch (error) {
      console.error('Erro ao salvar documento:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Base de Conhecimento</h1>
          <p className="text-text-secondary mt-2">
            Gerencie seus documentos e conhecimentos
          </p>
        </div>

        <div className="flex space-x-2">
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsEditorOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Documento
          </Button>
          
          <Button variant="outline">
            <Upload className="h-5 w-5 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-secondary border-overlay-light">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-text-secondary">{stat.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Lista de Documentos */}
      <Card className="p-6 bg-secondary border-overlay-light">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Documentos</h2>
        </div>
        <DocumentList />
      </Card>

      <DocumentEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveDocument}
      />
    </div>
  )
} 