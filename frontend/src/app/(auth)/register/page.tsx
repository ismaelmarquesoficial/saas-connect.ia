'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Mail, Lock, AlertCircle, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const { register: registerUser } = useAuth()
  const router = useRouter()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null)
      await registerUser(data.name, data.email, data.password)
      router.push('/login')
    } catch (err: any) {
      console.error('Erro ao fazer cadastro:', err)
      setError(err.message || 'Erro ao fazer cadastro. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center">
            Connect<span className="text-primary">.ia</span>
          </h1>
          <p className="mt-2 text-text-secondary">Crie sua conta para começar</p>
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
              <User className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
              <Input
                {...register("name")}
                type="text"
                placeholder="Nome completo"
                className="pl-10 bg-secondary border-overlay-light focus:border-primary text-white placeholder-text-secondary"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="text-primary text-sm">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirme sua senha"
                className="pl-10 bg-secondary border-overlay-light focus:border-primary text-white placeholder-text-secondary"
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-primary text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:bg-gradient-hover shadow-primary hover:shadow-hover transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
          </Button>

          <div className="text-center">
            <Link 
              href="/login"
              className="inline-flex items-center text-text-secondary hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 