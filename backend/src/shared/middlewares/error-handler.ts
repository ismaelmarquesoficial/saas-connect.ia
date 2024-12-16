import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error('\n=== Erro na Aplicação ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('URL:', request.url);
  console.error('Method:', request.method);
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('=== Fim do Erro ===\n');

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      errors: error.errors,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
} 