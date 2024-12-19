import bcrypt from 'bcryptjs';

async function testBcrypt() {
    const storedHash = '$2a$10$8DqVP8V5mxj0nKph3s7HX.0Gu4p.cYADwQxz0CMF9qQPRKHD5R.B6';
    const password = 'admin123';
    
    console.log('Testando bcrypt:');
    console.log('Password:', password);
    console.log('Stored Hash:', storedHash);
    
    // Teste de comparação
    const isValid = await bcrypt.compare(password, storedHash);
    console.log('Resultado da comparação:', isValid);
    
    // Gerar novo hash para comparar
    const newHash = await bcrypt.hash(password, 10);
    console.log('Novo hash gerado:', newHash);
}

testBcrypt().catch(console.error); 