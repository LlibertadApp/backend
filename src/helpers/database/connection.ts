import { Pool, QueryResult } from "pg";
import { readPool, writePool } from "./pool";

export class DatabaseConnection {

    private static _instance: DatabaseConnection;
    private _readPool: Pool;
    private _writePool: Pool;

    private constructor() {
        this._readPool = readPool;
        this._writePool = writePool;
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection._instance) {
            DatabaseConnection._instance = new DatabaseConnection();
        }

        return DatabaseConnection._instance;
    }

    async queryRead(query: string, params?: any[]): Promise<QueryResult> {
        const client = await this._readPool.connect();
        try {
            return await client.query(query, params);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async queryWrite(query: string, params?: any[]): Promise<QueryResult> {
        const client = await this._writePool.connect();
        try {
            return await client.query(query, params);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }
}