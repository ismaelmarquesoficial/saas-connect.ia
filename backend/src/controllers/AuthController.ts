import { Request, Response } from 'express';
import { pool } from '../lib/db';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Log para debug
      console.log('Dados recebidos:', { name, email, password });

      // Validação dos campos
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: "Campos obrigatórios faltando",
          details: {
            name: !name,
            email: !email,
            password: !password
          }
        });
      }

      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Usuário já existe" });
      }

      const hashedPassword = await hash(password, 8);

      const result = await pool.query(
        `INSERT INTO users (name, email, password, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, email`,
        [name, email, hashedPassword, 'user']
      );

      const user = result.rows[0];
      const token = sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '1d'
      });

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error.message 
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ error: "Senha inválida" });
      }

      const token = sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '1d'
      });

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ 
        error: "Erro interno do servidor",
        details: error.message 
      });
    }
  }
} 