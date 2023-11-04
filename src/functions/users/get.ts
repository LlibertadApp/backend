/// <reference path="../../symbols.d.ts" />
// import { DatabaseConnection } from "@/helpers/database/connection";
import "reflect-metadata";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { findUserByUuid } from "@/helpers/daos/userDao";
import response from "@/helpers/response";
import { httpErrors, httpStatusCodes } from "@/helpers/configs/errorConstants";

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  global.cb = callback;
  try {
    const uuid = event.pathParameters?.id;
    if (!uuid) {
      return response({
        code: httpStatusCodes.BAD_REQUEST,
        err: JSON.stringify(event.pathParameters),
      });
    }

    const user = await findUserByUuid(uuid);
    return response({ code: httpStatusCodes.OK, data: user });
  } catch (error) {
    return response(error);
  }
};

export default handler;
