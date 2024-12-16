import 'dotenv/config';
import { app } from './server';
import { pool } from './lib/db';

const port = Number(process.env.PORT) || 3001;

// Testar conexão com o banco
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    process.exit(1);
  }
  console.log('Banco conectado com sucesso');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${port}`);
}); 