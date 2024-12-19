-- Adicionar coluna tenant_id na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

-- Atualizar trigger de updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 