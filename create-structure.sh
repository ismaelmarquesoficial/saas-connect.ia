#!/bin/bash

# Criar estrutura de diretórios principal
mkdir -p saas-multiagentes/{frontend,backend,docker}

# Frontend
cd saas-multiagentes/frontend
mkdir -p src/{components,pages,hooks,services,utils,styles,contexts}
mkdir -p public/{assets,icons}

# Backend
cd ../backend
mkdir -p src/{modules,shared,config,database}
mkdir -p src/modules/{admin,auth,whatsapp,crm,knowledge-base,billing}
mkdir -p src/shared/{middlewares,utils,types}

# Docker
cd ../docker
touch docker-compose.yml
touch Dockerfile.frontend
touch Dockerfile.backend
touch .env.example 