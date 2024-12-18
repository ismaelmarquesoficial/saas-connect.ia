-- Adicionar nova coluna à tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255);

-- Exemplo de criar uma nova tabela
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bio TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemplo de modificar uma coluna existente
-- ALTER TABLE users 
-- ALTER COLUMN name TYPE VARCHAR(300); 