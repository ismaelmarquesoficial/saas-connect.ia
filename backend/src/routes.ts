import { Router } from 'express';
import { AuthController } from './modules/auth/auth.controller';
import { documentRouter } from './modules/knowledge-base/document.routes';
import authRouter from './modules/auth/routes';

const router = Router();

// Rotas de autenticação
router.use('/auth', authRouter);
router.use('/documents', documentRouter);

export default router; 