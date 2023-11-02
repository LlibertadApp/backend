/// <reference path="../../symbols.d.ts" />
// import { DatabaseConnection } from "@/helpers/database/connection";
import 'reflect-metadata'
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { findUserByUuid } from "@/helpers/daos/userDao";
import response from '@/helpers/response';

export const handler = async (
    event: APIGatewayEvent,
    context: Context,
    callback: Callback
): Promise<any> => {
    global.cb = callback;
    try {
        const uuid = event.pathParameters?.id;
        if (!uuid) {
            return response({ code: 400, err: JSON.stringify(event.pathParameters) });
        }

        const user = await findUserByUuid(uuid);
        return response({ code: 200, data: user });
    } catch (error) {
        console.error(error);
        return response({ code: 500, err: 'Internal Server Error' });
    }
}

export default handler;