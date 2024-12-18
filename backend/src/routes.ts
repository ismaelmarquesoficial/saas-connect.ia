import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { documentRouter } from './modules/knowledge-base/document.routes';

const router = Router();
const authController = new AuthController();

// Rotas de autenticação
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.use('/documents', documentRouter);

export default router; 