import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateKnowledgeBase1709000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de categorias
    await queryRunner.createTable(
      new Table({
        name: 'knowledge_categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'tenant_id',
            type: 'uuid'
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    );

    // Criar tabela de documentos
    await queryRunner.createTable(
      new Table({
        name: 'knowledge_documents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'tenant_id',
            type: 'uuid'
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'title',
            type: 'varchar'
          },
          {
            name: 'content',
            type: 'text'
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'draft'"
          },
          {
            name: 'type',
            type: 'varchar'
          },
          {
            name: 'metadata',
            type: 'jsonb',
            default: "'{}'"
          },
          {
            name: 'created_by',
            type: 'uuid'
          },
          {
            name: 'updated_by',
            type: 'uuid'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    );

    // Criar tabela de vínculo entre documentos e agentes
    await queryRunner.createTable(
      new Table({
        name: 'agent_documents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'agent_id',
            type: 'uuid'
          },
          {
            name: 'document_id',
            type: 'uuid'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    );

    // Adicionar chaves estrangeiras
    await queryRunner.createForeignKey(
      'knowledge_categories',
      new TableForeignKey({
        name: 'CategoryTenant',
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'knowledge_documents',
      new TableForeignKey({
        name: 'DocumentTenant',
        columnNames: ['tenant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tenants',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'knowledge_documents',
      new TableForeignKey({
        name: 'DocumentCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'knowledge_categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'knowledge_documents',
      new TableForeignKey({
        name: 'DocumentCreatedBy',
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'knowledge_documents',
      new TableForeignKey({
        name: 'DocumentUpdatedBy',
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'agent_documents',
      new TableForeignKey({
        name: 'AgentDocumentAgent',
        columnNames: ['agent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'agents',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'agent_documents',
      new TableForeignKey({
        name: 'AgentDocumentDocument',
        columnNames: ['document_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'knowledge_documents',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    );

    // Criar índices
    await queryRunner.query(`
      CREATE INDEX idx_knowledge_categories_tenant ON knowledge_categories(tenant_id);
      CREATE INDEX idx_knowledge_documents_tenant ON knowledge_documents(tenant_id);
      CREATE INDEX idx_knowledge_documents_category ON knowledge_documents(category_id);
      CREATE INDEX idx_knowledge_documents_status ON knowledge_documents(status);
      CREATE INDEX idx_agent_documents_agent ON agent_documents(agent_id);
      CREATE INDEX idx_agent_documents_document ON agent_documents(document_id);
      CREATE UNIQUE INDEX idx_agent_documents_unique ON agent_documents(agent_id, document_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_knowledge_categories_tenant;
      DROP INDEX IF EXISTS idx_knowledge_documents_tenant;
      DROP INDEX IF EXISTS idx_knowledge_documents_category;
      DROP INDEX IF EXISTS idx_knowledge_documents_status;
      DROP INDEX IF EXISTS idx_agent_documents_agent;
      DROP INDEX IF EXISTS idx_agent_documents_document;
      DROP INDEX IF EXISTS idx_agent_documents_unique;
    `);

    // Remover chaves estrangeiras
    await queryRunner.dropForeignKey('agent_documents', 'AgentDocumentDocument');
    await queryRunner.dropForeignKey('agent_documents', 'AgentDocumentAgent');
    await queryRunner.dropForeignKey('knowledge_documents', 'DocumentUpdatedBy');
    await queryRunner.dropForeignKey('knowledge_documents', 'DocumentCreatedBy');
    await queryRunner.dropForeignKey('knowledge_documents', 'DocumentCategory');
    await queryRunner.dropForeignKey('knowledge_documents', 'DocumentTenant');
    await queryRunner.dropForeignKey('knowledge_categories', 'CategoryTenant');

    // Remover tabelas
    await queryRunner.dropTable('agent_documents');
    await queryRunner.dropTable('knowledge_documents');
    await queryRunner.dropTable('knowledge_categories');
  }
} 