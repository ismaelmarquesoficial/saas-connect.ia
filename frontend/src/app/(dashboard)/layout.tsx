'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { MessageSquare, LayoutDashboard, LogOut, User, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen flex font-sans bg-background text-text-primary">
      {/* Sidebar */}
      <div className="w-64 bg-secondary border-r border-overlay-light">
        <div className="p-6">
          {/* Logo e Nome do Tenant */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              Connect<span className="text-primary">.ia</span>
            </h2>
            <p className="text-sm text-text-secondary mt-2">{user.tenant_name}</p>
          </div>

          {/* Menu de Navegação */}
          <nav className="space-y-2">
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-3 py-2.5 px-4 rounded-lg transition-all duration-200 ${
                isActive('/dashboard') 
                  ? 'bg-primary text-white shadow-primary' 
                  : 'text-text-secondary hover:bg-overlay-light hover:text-white'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/dashboard/knowledge" 
              className={`flex items-center space-x-3 py-2.5 px-4 rounded-lg transition-all duration-200 ${
                isActive('/dashboard/knowledge') 
                  ? 'bg-primary text-white shadow-primary' 
                  : 'text-text-secondary hover:bg-overlay-light hover:text-white'
              }`}
            >
              <MessageSquare size={20} />
              <span>Base de Conhecimento</span>
            </Link>

            <Link 
              href="/dashboard/settings" 
              className={`flex items-center space-x-3 py-2.5 px-4 rounded-lg transition-all duration-200 ${
                isActive('/dashboard/settings') 
                  ? 'bg-primary text-white shadow-primary' 
                  : 'text-text-secondary hover:bg-overlay-light hover:text-white'
              }`}
            >
              <Settings size={20} />
              <span>Configurações</span>
            </Link>
          </nav>
        </div>

        {/* Perfil do Usuário */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-overlay-light bg-secondary">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-overlay-light">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full flex items-center justify-center space-x-2 text-text-secondary hover:text-primary hover:bg-overlay-light"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 bg-background overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
} 