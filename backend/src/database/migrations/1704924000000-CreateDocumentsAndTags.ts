import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocumentsAndTags1704924000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS document_tags (
                document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                tag VARCHAR(50) NOT NULL,
                PRIMARY KEY (document_id, tag)
            );

            CREATE INDEX idx_documents_user_id ON documents(user_id);
            CREATE INDEX idx_documents_created_at ON documents(created_at);
            CREATE INDEX idx_document_tags_tag ON document_tags(tag);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_document_tags_tag;
            DROP INDEX IF EXISTS idx_documents_created_at;
            DROP INDEX IF EXISTS idx_documents_user_id;
            DROP TABLE IF EXISTS document_tags;
            DROP TABLE IF EXISTS documents;
        `);
    }
} 