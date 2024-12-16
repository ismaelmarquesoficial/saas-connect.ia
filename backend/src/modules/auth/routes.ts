import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../shared/middlewares/auth';

const authRouter = Router();
const authController = new AuthController();

// Rotas públicas
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

// Rotas protegidas
authRouter.get('/me', authMiddleware, authController.me);

export default authRouter; 