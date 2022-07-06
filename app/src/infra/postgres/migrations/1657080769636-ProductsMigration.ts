import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsMigration1657080769636 implements MigrationInterface {
    name = 'ProductsMigration1657080769636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "free_shipping" integer NOT NULL, "description" character varying NOT NULL, "price" double precision NOT NULL, "category" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
