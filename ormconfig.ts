import { DataSource } from "typeorm";
import * as Dotenv from 'dotenv';
import * as path from 'path';
import { EnvironmentSelector } from "@/helpers/configs/environmentSelector";

Dotenv.config({
    path: `${path.join(__dirname)}/${EnvironmentSelector()}`,
}).parsed;
console.log(`TYPEORM ENVIRONMENT: ${process.env.LBERTAPP_ENV}\nDATABASE CONNECTION: ${process.env.DATABASE_HOST}`);

export const ConnectionSource = new DataSource({
    migrationsTableName: 'migrations',
    type: process.env.DATABASE_TYPE as any,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
    logging: Boolean(process.env.DATABASE_LOGGING),
    synchronize: Boolean(process.env.DATABASE_SYNC),
    migrations: [__dirname + '/src/helpers/migrations/*.{ts,js}'],
    entities: [path.resolve(__dirname, "src/helpers/models/entities/*.{ts,js}")],
})

ConnectionSource
    .initialize()
    .then(() => console.log('Database connected'))
    .catch(error => console.log('Typeorm connection error: ', error));