import { pool } from '../lib/db'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  try {
    // Dados do admin
    const adminData = {
      name: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin'
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    // Verificar se o usuário já existe
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [adminData.email]
    )

    if (existingUser.rows.length > 0) {
      console.log('Usuário admin já existe!')
      return
    }

    // Inserir o usuário
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role`,
      [adminData.name, adminData.email, hashedPassword, adminData.role]
    )

    console.log('Usuário admin criado com sucesso:', result.rows[0])
    console.log('Email:', adminData.email)
    console.log('Senha:', adminData.password)

  } catch (error) {
    console.error('Erro ao criar usuário admin:', error)
  } finally {
    await pool.end()
  }
}

createAdmin() 