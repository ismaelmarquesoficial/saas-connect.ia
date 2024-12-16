'use strict'

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { pool } from '../../lib/db';
import { AppError } from '../../shared/middlewares/error-handler';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export class AuthService {
  async register({ name, email, password }: RegisterParams) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar se o email já existe
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new AppError('Email já cadastrado', 400);
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Usar o tenant padrão
      const defaultTenantId = '00000000-0000-0000-0000-000000000000';

      // Inserir o usuário
      const result = await client.query(
        `INSERT INTO users (name, email, password, role, tenant_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, name, email, role, tenant_id`,
        [name, email, hashedPassword, 'user', defaultTenantId]
      );

      await client.query('COMMIT');

      const user = result.rows[0];

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro no serviço de registro:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async login({ email, password }: LoginParams) {
    try {
      // Buscar usuário pelo email
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        throw new AppError('Email ou senha inválidos', 401);
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new AppError('Email ou senha inválidos', 401);
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id
        },
        token
      };
    } catch (error) {
      console.error('Erro no serviço de login:', error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, tenant_id FROM users WHERE id = $1',
        [userId]
      );

      const user = result.rows[0];

      if (!user) {
        throw new AppError('Usuário não encontrado', 404);
      }

      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }
} 