import { DataSource } from 'typeorm';
import * as Dotenv from 'dotenv';
import * as path from 'path';
import { GenericTable } from '@/helpers/models/entities/genericTable';
import { Scrutiny } from '@/helpers/models/entities/scrutinyEntity';
import { Initial1700293882848 } from '@/helpers/migrations/1700293882848-initial';
import { EnvironmentSelector } from '@/_core/configs/environmentSelector';

Dotenv.config({
	path: `${path.join(__dirname)}/${EnvironmentSelector()}`,
}).parsed;
console.log(
	`TYPEORM ENVIRONMENT: ${process.env.LBERTAPP_ENV}\nDATABASE CONNECTION: ${process.env.DATABASE_RW_HOST}`
);

export const ConnectionSource = new DataSource({
	migrationsTableName: 'migrations',
	type: process.env.DATABASE_TYPE as any,
	host: process.env.DATABASE_RW_HOST,
	port: Number(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_DB,
	logging: process.env.DATABASE_LOGGING === 'true',
	synchronize: process.env.DATABASE_SYNC === 'true',
	entities: [
        GenericTable,
				Scrutiny,
	],
	migrations: [
				Initial1700293882848,
	],
	extra: {
		ssl: {
      rejectUnauthorized: false
    },
	},
});
