import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'saas_lari'
});

async function runMigrations() {
    try {
        // Criar tabela de controle de migrations se não existir
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Ler arquivos de migration
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        // Executar cada migration
        for (const file of files) {
            const migrationName = file;
            
            // Verificar se migration já foi executada
            const { rows } = await pool.query(
                'SELECT * FROM migrations WHERE name = $1',
                [migrationName]
            );

            if (rows.length === 0) {
                // Ler e executar o arquivo SQL
                const sql = fs.readFileSync(
                    path.join(migrationsDir, file),
                    'utf8'
                );
                
                await pool.query(sql);
                
                // Registrar migration como executada
                await pool.query(
                    'INSERT INTO migrations (name) VALUES ($1)',
                    [migrationName]
                );
                
                console.log(`Migration ${migrationName} executada com sucesso`);
            }
        }

        console.log('Todas as migrations foram executadas');
    } catch (error) {
        console.error('Erro ao executar migrations:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

runMigrations(); 