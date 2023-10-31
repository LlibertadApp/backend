/// <reference path="../../symbols.d.ts" />
import { DatabaseConnection } from "@/helpers/database/connection";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import response from "@/helpers/response";
import HttpStatus from "@/helpers/enum/http";
import GetUsersResponse from "@/helpers/models/response/getUsersResponse";

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
    let usersResponse: GetUsersResponse[] = [];
    try {
        const result = await dbConnection.queryRead(query);
        usersResponse = result.rows.map((user: any) => {
            return new GetUsersResponse(user.email, user.rol, user.fecha_creacion);
        });
        return response({
            code: HttpStatus.OK,
            data: usersResponse
        });
    } catch (err: any) {
        throw response({
            code: HttpStatus.BAD_REQUEST,
            err: err
        });
    }
}

export default handler;