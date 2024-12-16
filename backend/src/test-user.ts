import { pool } from './lib/db';

async function testUser() {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Usuários:', result.rows);
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await pool.end();
  }
}

testUser(); 