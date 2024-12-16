import axios from 'axios';

async function testLogin() {
  console.log('Iniciando testes...');

  try {
    console.log('=== Verificando se o servidor está online ===');
    
    // Teste da rota de saúde com timeout mais curto
    console.log('Tentando acessar: http://localhost:3001/health');
    const healthResponse = await axios.get('http://localhost:3001/health', {
      timeout: 5000, // 5 segundos de timeout
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Aceita qualquer status entre 200-499
      }
    });

    console.log('Health check response:', {
      status: healthResponse.status,
      data: healthResponse.data
    });

    // Teste de login
    console.log('\n=== Iniciando teste de login ===');
    const loginData = {
      email: 'admin@admin.com',
      password: 'admin123'
    };

    console.log('Enviando requisição para: http://localhost:3001/auth/login');
    console.log('Dados:', loginData);
    
    const loginResponse = await axios.post('http://localhost:3001/auth/login', loginData, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n=== Resposta recebida ===');
    console.log('Status:', loginResponse.status);
    console.log('Dados:', loginResponse.data);

  } catch (error: any) {
    console.error('\n=== Erro durante os testes ===');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Servidor não está respondendo. Verifique se o backend está rodando.');
      console.error('Execute: docker-compose up -d');
    } else if (error.response) {
      console.error('Resposta de erro do servidor:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('Requisição feita mas sem resposta');
      console.error('Detalhes:', {
        method: error.config?.method,
        url: error.config?.url,
        timeout: error.config?.timeout
      });
    } else {
      console.error('Erro na configuração da requisição:', error.message);
    }
  }

  console.log('\nTestes finalizados.');
}

// Executa o teste
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
testLogin(); 