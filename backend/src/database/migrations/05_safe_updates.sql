-- Função auxiliar para verificar se uma constraint existe
CREATE OR REPLACE FUNCTION check_constraint_exists(table_name text, constraint_name text) 
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = $1
        AND constraint_name = $2
    );
END;
$$ LANGUAGE plpgsql;

-- Remover constraint duplicada apenas se existir
DO $$ 
BEGIN
    IF (SELECT check_constraint_exists('documents', 'fk_tenant')) THEN
        ALTER TABLE documents DROP CONSTRAINT fk_tenant;
    END IF;
END $$;

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_agents_tenant_id ON agents(tenant_id);

-- Criar ou atualizar a função trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers apenas se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_documents_updated_at'
    ) THEN
        CREATE TRIGGER update_documents_updated_at
        BEFORE UPDATE ON documents
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Criar tabela agent_documents apenas se não existir
CREATE TABLE IF NOT EXISTS agent_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    status VARCHAR(50) DEFAULT 'pending',
    last_processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agent_id, document_id)
);

-- Criar índices para agent_documents se não existirem
CREATE INDEX IF NOT EXISTS idx_agent_documents_agent ON agent_documents(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_documents_document ON agent_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_agent_documents_status ON agent_documents(status);

-- Criar trigger para agent_documents se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_agent_documents_updated_at'
    ) THEN
        CREATE TRIGGER update_agent_documents_updated_at
        BEFORE UPDATE ON agent_documents
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$; 