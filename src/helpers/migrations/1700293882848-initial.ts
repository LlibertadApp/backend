import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1700293882848 implements MigrationInterface {
    name = 'Initial1700293882848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Actas_estado_enum" AS ENUM('ENVIADO', 'ANOMALIA', 'OK')`);
        await queryRunner.query(`CREATE TABLE "Actas" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mesaId" character varying NOT NULL, "userId" character varying NOT NULL, "conteoLla" integer NOT NULL, "conteoUp" integer NOT NULL, "votosImpugnados" integer NOT NULL, "votosNulos" integer NOT NULL, "votosEnBlanco" integer NOT NULL, "votosRecurridos" integer NOT NULL, "votosEnTotal" integer NOT NULL, "imagenActa" character varying NOT NULL, "estado" "public"."Actas_estado_enum" NOT NULL DEFAULT 'ENVIADO', CONSTRAINT "PK_43ffd9918ef6f392ca4d817b687" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7b300cef30790a6c44c9d4011e" ON "Actas" ("mesaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d7ccc6c1ce019ab692aa86546" ON "Actas" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9d7ccc6c1ce019ab692aa86546"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b300cef30790a6c44c9d4011e"`);
        await queryRunner.query(`DROP TABLE "Actas"`);
        await queryRunner.query(`DROP TYPE "public"."Actas_estado_enum"`);
    }

}
