import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Adicionar log para debug
  console.log('Middleware - Path:', request.nextUrl.pathname)
  
  // ... resto do código
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/knowledge-base/:path*'
  ]
} 