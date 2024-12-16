#!/bin/bash

echo "🚀 Iniciando instalação do Connect.ia SaaS..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar diretórios necessários se não existirem
echo "📁 Criando diretórios..."
mkdir -p connecta-ia_home/public

# Copiar arquivos de configuração
echo "📝 Copiando arquivos de configuração..."
cp .env.example .env 2>/dev/null || true

# Construir e iniciar containers
echo "🏗️ Construindo e iniciando containers..."
docker-compose down -v --remove-orphans
docker system prune -f
docker-compose up -d --build

# Verificar status
echo "🔍 Verificando status dos containers..."
docker-compose ps

echo "✅ Instalação concluída!"
echo "🌐 Acesse: http://localhost:3002" 