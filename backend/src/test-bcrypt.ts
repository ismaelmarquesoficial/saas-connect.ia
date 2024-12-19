import bcrypt from 'bcryptjs';

async function testBcrypt() {
    // Hash atual no banco
    const storedHash = '$2b$10$EzWqGiHxU/Jt.ZKxvCXKDuntr/RhWHD3w0T9UiN5ZYhxOBaWX52Uy';
    const password = 'admin123';
    
    console.log('Testando bcrypt:');
    console.log('Password:', password);
    console.log('Stored Hash:', storedHash);
    
    // Teste de comparação
    const isValid = await bcrypt.compare(password, storedHash);
    console.log('Resultado da comparação:', isValid);
    
    // Gerar novo hash para comparar formato
    const newHash = await bcrypt.hash(password, 10);
    console.log('Novo hash gerado:', newHash);

    // Testar novo hash também
    const isValidNewHash = await bcrypt.compare(password, newHash);
    console.log('Resultado da comparação com novo hash:', isValidNewHash);
}

testBcrypt().catch(console.error); 