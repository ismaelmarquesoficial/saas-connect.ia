#!/bin/bash

echo "🛑 Parando containers..."
docker-compose down -v

echo "🗑️ Removendo containers antigos..."
docker system prune -f

echo "🗑️ Removendo volumes..."
docker volume prune -f

echo "🏗️ Reconstruindo containers..."
docker-compose build

echo "🚀 Iniciando containers..."
docker-compose up -d postgres

echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

echo "🚀 Iniciando backend e frontend..."
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

echo "📊 Status dos containers:"
docker ps

echo "📝 Logs dos containers:"
docker-compose logs

echo "🚀 Executando migrações..."
docker-compose exec postgres psql -U postgres -d saas_lari -c "
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    tenant_id UUID REFERENCES tenants(id),
    profile_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);"

echo "🔄 Recriando usuário inicial..."
docker-compose exec postgres psql -U postgres -d saas_lari -c "
-- Criar tenant padrão
INSERT INTO tenants (id, name, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Tenant', 'active')
ON CONFLICT (id) DO NOTHING;

-- Criar usuário admin
INSERT INTO users (name, email, password, role, tenant_id)
VALUES (
    'Admin',
    'admin@admin.com',
    '\$2a\$10\$8DqVP8V5mxj0nKph3s7HX.0Gu4p.cYADwQxz0CMF9qQPRKHD5R.B6',
    'admin',
    '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT (email) DO NOTHING;"

echo "✅ Ambiente pronto para uso!"
echo "📧 Usuário admin criado:"
echo "   Email: admin@admin.com"
echo "   Senha: admin123"
echo ""
echo "🌐 Serviços disponíveis em:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo "   Banco de dados: localhost:5433"
echo ""
echo "Para ver os logs em tempo real, execute:"
echo "docker-compose logs -f"
