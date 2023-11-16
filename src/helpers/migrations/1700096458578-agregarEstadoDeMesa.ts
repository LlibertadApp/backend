import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarEstadoDeMesa1700096458578 implements MigrationInterface {
    name = 'AgregarEstadoDeMesa1700096458578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Actas_estado_enum" AS ENUM('ENVIADO', 'ANOMALIA', 'OK')`);
        await queryRunner.query(`ALTER TABLE "Actas" ADD "estado" "public"."Actas_estado_enum" NOT NULL DEFAULT 'ENVIADO'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Actas" DROP COLUMN "estado"`);
        await queryRunner.query(`DROP TYPE "public"."Actas_estado_enum"`);
    }

}
