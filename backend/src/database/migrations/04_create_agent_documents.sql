-- Criar tabela de relacionamento entre agents e documents
CREATE TABLE IF NOT EXISTS agent_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    status VARCHAR(50) DEFAULT 'pending',  -- pending, processing, completed, error
    last_processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agent_id, document_id)  -- Evita duplicatas
);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_agent_documents_agent ON agent_documents(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_documents_document ON agent_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_agent_documents_status ON agent_documents(status);

-- Adicionar trigger de updated_at
DROP TRIGGER IF EXISTS update_agent_documents_updated_at ON agent_documents;
CREATE TRIGGER update_agent_documents_updated_at
    BEFORE UPDATE ON agent_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 