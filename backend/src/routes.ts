import { Router } from 'express';
import { AuthController } from './controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Rotas de autenticação
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

export default router; 