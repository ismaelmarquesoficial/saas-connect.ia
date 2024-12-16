#!/bin/bash

echo "🔄 Iniciando atualização do Connect.ia SaaS..."

# Fazer backup dos arquivos importantes
echo "📦 Fazendo backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p backups/$timestamp
cp docker-compose.yml backups/$timestamp/ 2>/dev/null || true
cp .env backups/$timestamp/ 2>/dev/null || true

# Parar containers
echo "⏹️ Parando containers..."
docker-compose down

# Limpar cache e imagens antigas
echo "🧹 Limpando cache..."
docker system prune -f

# Atualizar código
echo "⬇️ Atualizando código..."
git pull

# Reconstruir e reiniciar
echo "🏗️ Reconstruindo containers..."
docker-compose up -d --build

# Verificar status
echo "🔍 Verificando status..."
docker-compose ps

echo "✅ Atualização concluída!"
echo "🌐 Acesse: http://localhost:3002" 