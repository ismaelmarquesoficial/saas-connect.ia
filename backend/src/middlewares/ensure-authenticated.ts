import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface TokenPayload {
  sub: string
  tenant_id: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new Error('JWT token is missing')
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as TokenPayload

    request.user = {
      id: decoded.sub,
      tenant_id: decoded.tenant_id
    }

    return next()
  } catch {
    throw new Error('Invalid JWT token')
  }
} 