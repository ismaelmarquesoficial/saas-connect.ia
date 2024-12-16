import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'saas_lari'
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err);
}); 