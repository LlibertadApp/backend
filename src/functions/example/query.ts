/// <reference path="../../symbols.d.ts" />
import { DatabaseConnection } from "@/helpers/database/connection";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import response from "@/helpers/response";
import HttpStatus from "@/helpers/enum/http";

/**
 * Example of a query function
 * Usage
 * GET /example
*/

export const handler = async (
    event: APIGatewayEvent,
    context: Context,
    callback: Callback
): Promise<any> => {
    global.cb = callback;
    const dbConnection = DatabaseConnection.getInstance();
    const query: string = 'SELECT * FROM usuarios';
    try {
        const result = await dbConnection.queryRead(query);
        return response({
            code: HttpStatus.OK,
            data: result.rows
        });
    } catch (err: any) {
        throw response({
            code: HttpStatus.BAD_REQUEST,
            err: err
        });
    }
}

export default handler;