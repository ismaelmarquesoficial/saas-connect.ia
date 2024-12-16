#!/bin/bash

echo "🛑 Parando containers..."
docker-compose down

echo "🗑️ Removendo containers antigos..."
docker rm -f saas_lari_db saas_lari_backend saas_lari_frontend 2>/dev/null || true

echo "🗑️ Removendo volumes..."
docker volume rm lariiasaas_postgres_data 2>/dev/null || true

echo "🏗️ Reconstruindo containers..."
docker-compose build --no-cache

echo "🚀 Iniciando containers..."
docker-compose up -d postgres

echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

echo "🚀 Iniciando backend e frontend..."
docker-compose up -d backend frontend

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

echo "📊 Status dos containers:"
docker-compose ps

echo "📝 Logs dos containers:"
docker-compose logs --tail=20

echo "🚀 Executando migrações..."
docker-compose exec -T backend npm run migration:run

echo "🔄 Recriando usuário inicial..."
# Hash da senha 'admin123' gerado com bcrypt
ADMIN_PASSWORD='$2a$10$gyjP3OjbiD2m7NdMkRLyquKsGwrRwUGMfEJVJytQvXbo/cdyZ6FA.'

docker-compose exec -T postgres psql -U postgres -d saas_lari -c "INSERT INTO tenants (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Admin') ON CONFLICT DO NOTHING;"
docker-compose exec -T postgres psql -U postgres -d saas_lari -c "INSERT INTO users (id, tenant_id, name, email, password, role) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Admin', 'admin@admin.com', '${ADMIN_PASSWORD}', 'admin') ON CONFLICT (email) DO UPDATE SET password = '${ADMIN_PASSWORD}';"

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
