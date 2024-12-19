@echo off
echo === Iniciando reset do ambiente ===

echo 1. Parando containers e removendo volumes...
docker-compose down -v

echo 2. Removendo imagens antigas...
docker rmi connectiasaas-backend connectiasaas-frontend

echo 3. Reconstruindo e iniciando containers...
docker-compose up -d --build

echo 4. Aguardando banco de dados inicializar...
timeout /t 15

echo 5. Verificando status dos containers...
docker ps

echo 6. Verificando logs do backend...
docker logs saas_lari_backend

echo 7. Verificando usuário admin...
docker exec saas_lari_db psql -U postgres -d saas_lari -c "SELECT id, email, role FROM users WHERE email = 'admin@admin.com';"

echo 8. Testando conexão com o backend...
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}"

echo.
echo === Reset do ambiente concluído! ===
echo.
echo Credenciais do usuário admin:
echo Email: admin@admin.com
echo Senha: admin123
echo.
echo Serviços disponíveis em:
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo Banco de dados: localhost:5433
echo.
pause 