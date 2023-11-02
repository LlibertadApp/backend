/// <reference path="../../symbols.d.ts" />
// import { DatabaseConnection } from "@/helpers/database/connection";
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
        const findUsers = await findUserByUuid('test');
        console.log(findUsers);
        return response({
            code: 200,
            data: findUsers
        })
    } catch (error) {
        console.log(error);
        return response({
            code: 400,
            err: error
        })
    }
}

export default handler;