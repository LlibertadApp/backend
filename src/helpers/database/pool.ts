import { Pool } from 'pg';

export const writePool: Pool = new Pool({
    connectionString: process.env.LBERTAPP_ENV === 'local' ? process.env.DB_LOCAL_ENDPOINT : process.env.DB_WRITE_ENDPOINT, 
    max: Number(process.env.DATABASE_MAX_CONNECTIONS) || 1
});

export const readPool: Pool = new Pool({
    connectionString: process.env.LBERTAPP_ENV === 'local' ? process.env.DB_LOCAL_ENDPOINT : process.env.DB_READ_ENDPOINT,
    max: Number(process.env.DATABASE_MAX_CONNECTIONS) || 1
});