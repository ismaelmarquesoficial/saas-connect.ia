'use strict'

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { z } from 'zod';
import { AuthRequest } from '../../shared/middlewares/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    try {
      console.log('\n=== Iniciando Login ===');
      console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));

      const { email, password } = loginSchema.parse(req.body);
      console.log('Dados validados com sucesso');

      const result = await this.authService.login({ email, password });
      console.log('Login processado com sucesso');
      console.log('Resultado:', JSON.stringify(result, null, 2));

      console.log('=== Fim do Login ===\n');
      return res.json(result);
    } catch (error) {
      console.error('\n=== Erro no Login ===');
      console.error('Dados da requisição:', JSON.stringify(req.body, null, 2));
      console.error('Erro:', error);
      console.error('=== Fim do Erro ===\n');
      throw error;
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      console.log('\n=== Iniciando Registro ===');
      console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));

      const { name, email, password } = registerSchema.parse(req.body);
      console.log('Dados validados com sucesso');

      const result = await this.authService.register({ name, email, password });
      console.log('Registro processado com sucesso');
      console.log('Resultado:', JSON.stringify(result, null, 2));

      console.log('=== Fim do Registro ===\n');
      return res.json(result);
    } catch (error) {
      console.error('\n=== Erro no Registro ===');
      console.error('Dados da requisição:', JSON.stringify(req.body, null, 2));
      console.error('Erro:', error);
      console.error('=== Fim do Erro ===\n');
      throw error;
    }
  };

  me = async (req: AuthRequest, res: Response) => {
    try {
      console.log('\n=== Iniciando Me ===');
      if (!req.user?.id) {
        throw new Error('Usuário não autenticado');
      }
      console.log('User ID:', req.user.id);

      const user = await this.authService.getUserById(req.user.id);
      console.log('Dados do usuário recuperados com sucesso');
      console.log('Resultado:', JSON.stringify(user, null, 2));

      console.log('=== Fim do Me ===\n');
      return res.json({ user });
    } catch (error) {
      console.error('\n=== Erro no Me ===');
      console.error('User ID:', req.user?.id);
      console.error('Erro:', error);
      console.error('=== Fim do Erro ===\n');
      throw error;
    }
  };
} 