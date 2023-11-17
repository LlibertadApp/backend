// import 'reflect-metadata';
// import { DataSource } from "typeorm";
// import * as path from 'path';
// import { User } from '@/helpers/models/entities/userEntity';
// import { Role } from '@/helpers/models/entities/roleEntity';

// export const AppDataSource = new DataSource({
//     migrationsTableName: 'migrations',
//     type: process.env.DATABASE_TYPE as any,
//     host: process.env.DATABASE_HOST,
//     port: Number(process.env.DATABASE_PORT),
//     username: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASS,
//     database: process.env.DATABASE_DB,
//     logging: Boolean(process.env.DATABASE_LOGGING),
//     synchronize: Boolean(process.env.DATABASE_SYNC),
//     migrations: [__dirname + '/src/helpers/migrations/*.{ts,js}'],
//     entities: [User, Role],
// })