'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Mail, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null)
      await signIn(data.email, data.password)
    } catch (err: any) {
      console.error('Erro ao fazer login:', err)
      setError(err.message || 'Erro ao fazer login. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center">
            Connect<span className="text-primary">.ia</span>
          </h1>
          <p className="mt-2 text-text-secondary">Faça login para acessar sua conta</p>
        </div>

        {error && (
          <div className="bg-overlay-light border border-primary/20 text-primary p-4 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
              <Input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="pl-10 bg-secondary border-overlay-light focus:border-primary text-white placeholder-text-secondary"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-primary text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
              <Input
                {...register("password")}
                type="password"
                placeholder="Senha"
                className="pl-10 bg-secondary border-overlay-light focus:border-primary text-white placeholder-text-secondary"
                disabled={isSubmitting}
              />
            </div>
            {errors.password && (
              <p className="text-primary text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:bg-gradient-hover shadow-primary hover:shadow-hover transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center">
            <p className="text-text-secondary">
              Não tem uma conta?{' '}
              <Link 
                href="/register" 
                className="text-primary hover:text-primary-light transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 