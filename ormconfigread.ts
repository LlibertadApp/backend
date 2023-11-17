import { DataSource } from 'typeorm';
import * as Dotenv from 'dotenv';
import * as path from 'path';
import { User } from '@/helpers/models/entities/userEntity';
import { GenericTable } from '@/helpers/models/entities/genericTable';
import { Role } from '@/helpers/models/entities/roleEntity';
import { Scrutiny } from '@/helpers/models/entities/scrutinyEntity';
import { FirstMigration1698943496462 } from '@/helpers/migrations/1698943496462-firstMigration';
import { TablaActas1699999228781 } from '@/helpers/migrations/1699999228781-tablaActas';
import { AgregarEstadoDeMesa1700096458578 } from '@/helpers/migrations/1700096458578-agregarEstadoDeMesa';
import { EnvironmentSelector } from '@/_core/configs/environmentSelector';

Dotenv.config({
	path: `${path.join(__dirname)}/${EnvironmentSelector()}`,
}).parsed;
console.log(
	`TYPEORM ENVIRONMENT: ${process.env.LBERTAPP_ENV}\nDATABASE CONNECTION: ${process.env.DATABASE_HOST}`
);

export const ConnectionSourceRead = new DataSource({
	migrationsTableName: 'migrations',
	type: process.env.DATABASE_TYPE as any,
	host: process.env.DATABASE_RO_HOST,
	port: Number(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_DB,
	logging: process.env.DATABASE_LOGGING === 'true',
	synchronize: process.env.DATABASE_SYNC === 'true',

  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },

	entities: [
        User,
        GenericTable,
        Role,
				Scrutiny,
	],
	migrations: [	],
});