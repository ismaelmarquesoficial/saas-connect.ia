-- Atualizar a estrutura da tabela users
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
ALTER COLUMN tenant_id SET NOT NULL,
ALTER COLUMN role SET DEFAULT 'user';

-- Atualizar o usuário admin existente
UPDATE users 
SET password = '$2a$10$Xr7wpuV9KRGYc4Nj5VG/eO41iBy2QTb5/nfU.sIMmhdUkiajVK6WO'
WHERE email = 'admin@admin.com';

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role); 