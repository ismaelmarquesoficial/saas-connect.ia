'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Users, Database, MessageSquare } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const stats = [
    {
      title: 'Base de Conhecimento',
      value: '0',
      icon: Database,
      description: 'documentos cadastrados'
    },
    {
      title: 'Usuários',
      value: '1',
      icon: Users,
      description: 'usuários ativos'
    },
    {
      title: 'Interações',
      value: '0',
      icon: MessageSquare,
      description: 'mensagens trocadas'
    }
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          Tenant: {user.tenant_name}
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Informações do Usuário */}
      <Card className="p-6 bg-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Informações da Conta</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <p className="text-foreground">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Função</p>
            <p className="text-foreground capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tenant</p>
            <p className="text-foreground">{user.tenant_name}</p>
          </div>
        </div>
      </Card>
    </div>
  )
} 