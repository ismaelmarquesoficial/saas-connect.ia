-- Limpar tabelas existentes
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Criar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agentes
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  purpose VARCHAR(255),
  ai_model VARCHAR(100),
  ai_key VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tenant padrão
INSERT INTO tenants (id, name, status) VALUES 
('00000000-0000-0000-0000-000000000000', 'Default Tenant', 'active');

-- Criar usuário admin padrão com senha: admin123
INSERT INTO users (id, tenant_id, name, email, password, role) VALUES 
('00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000000', 
 'Admin', 
 'admin@admin.com',
 '$2a$10$AC8hQLC/Bw3/UMpRIdl.2uUjCYO1GzoX94LRJ4qqJAlb9QVEbU5PW',
 'admin'); 