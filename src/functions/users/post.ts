/// <reference path="../../symbols.d.ts" />
import "reflect-metadata";
import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import { createUser } from "@/helpers/daos/userDao";
import response from "@/helpers/response";
import { User } from "@/helpers/models/entities/userEntity";
import { v4 as uuidv4 } from "uuid";
import { httpErrors, httpStatusCodes } from "@/helpers/configs/errorConstants";

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  global.cb = callback;
  try {
    if (!event.body) {
      return response({
        code: httpStatusCodes.BAD_REQUEST,
        err: httpErrors.BAD_REQUEST_ERROR_NO_DATA_PROVIDED,
      });
    }

    const userBody = JSON.parse(event.body) as Partial<User>;

    const userData = {
      ...userBody,
      uuid: uuidv4(),
    };

    const newUser = await createUser(userData);
    if (!newUser) {
      return response({
        code: httpStatusCodes.BAD_REQUEST,
        err: httpErrors.BAD_REQUEST_ERROR_USER_COULD_NOT_BE_CREATED,
      });
    }

    return response({ code: httpStatusCodes.CREATED, data: newUser });
  } catch (error) {
    return response(error);
  }
};

export default handler;
