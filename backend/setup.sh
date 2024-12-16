#!/bin/bash

# Criar estrutura de diretórios
mkdir -p src/modules/auth
mkdir -p src/modules/knowledge-base
mkdir -p src/shared/middlewares
mkdir -p src/database/migrations
mkdir -p src/@types

# Criar arquivo de configuração do TypeScript se não existir
if [ ! -f tsconfig.json ]; then
  npx tsc --init
fi

# Instalar dependências
npm install 