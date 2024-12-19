-- Criar tenant padrão se não existir
INSERT INTO tenants (id, name, status)
SELECT 
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Default Tenant',
    'active'
WHERE NOT EXISTS (
    SELECT 1 FROM tenants WHERE id = '00000000-0000-0000-0000-000000000000'::uuid
);

-- Criar usuário admin se não existir
INSERT INTO users (name, email, password, role, tenant_id)
VALUES (
    'Admin',
    'admin@admin.com',
    '$2a$10$N7RbF0d0QpW0UhDI6h3vZOO0qoY3lL6UE0PXJO6i5qOGUTDhH9Tte',  -- senha: admin123
    'admin',
    '00000000-0000-0000-0000-000000000000'::uuid
)
ON CONFLICT (email) 
DO UPDATE SET 
    password = '$2a$10$N7RbF0d0QpW0UhDI6h3vZOO0qoY3lL6UE0PXJO6i5qOGUTDhH9Tte',
    role = 'admin',
    tenant_id = '00000000-0000-0000-0000-000000000000'::uuid; 