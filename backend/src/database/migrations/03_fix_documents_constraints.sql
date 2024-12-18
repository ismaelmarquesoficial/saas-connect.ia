-- Remover a constraint duplicada
ALTER TABLE documents 
DROP CONSTRAINT IF EXISTS fk_tenant;

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_agents_tenant_id ON agents(tenant_id);

-- Adicionar trigger de updated_at para documents (como já existe em agents)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Adicionar trigger para documents
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 