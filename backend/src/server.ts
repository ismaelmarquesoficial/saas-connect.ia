import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './shared/middlewares/error-handler';

console.log('Iniciando servidor...');

const app = express();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

console.log('Configurando CORS...');

// Configuração do CORS
app.use(cors());

console.log('Configurando parser JSON...');

// Parse JSON bodies
app.use(express.json());

// Rota de saúde
app.get('/health', (req, res) => {
  console.log('Health check requisitado');
  res.json({ status: 'ok' });
});

console.log('Configurando rotas...');

// Rotas da API
app.use('/', routes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  next(err);
});

app.use(errorHandler);

console.log('Servidor configurado. Pronto para iniciar...');

export { app }; 