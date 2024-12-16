export const config = {
  port: 3001,
  database: {
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'saas_lari',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
    expiresIn: '24h',
  },
} 