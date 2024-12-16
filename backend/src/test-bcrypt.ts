import bcrypt from 'bcryptjs';

async function testBcrypt() {
    const storedHash = '$2a$10$wdXmmWqj.dpzTRkQhMNxaOBJp0F8Z6D0M0RhOQDU6pVDZC/P3XfC.';
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