/// <reference path="../../symbols.d.ts" />
import "reflect-metadata";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { User } from "@/helpers/models/entities/userEntity";
import { ConnectionSource } from "../../../ormconfig";
import response from "@/helpers/response";
import { httpErrors, httpStatusCodes } from "@/helpers/configs/errorConstants";
import { paginationConstants } from "@/helpers/configs/paginationConstants";
import { findUsersWithPagination } from "@/helpers/daos/userDao";

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  global.cb = callback;
  try {
    const page: number = parseInt(
      event.queryStringParameters?.page || paginationConstants.DEFAULT_PAGE,
      10
    );
    const limit: number = parseInt(
      event.queryStringParameters?.limit || paginationConstants.DEFAULT_LIMIT,
      10
    );

    const result = await findUsersWithPagination(page, limit);

    if (result) {
      const { data, count } = result;

      return response({
        code: httpStatusCodes.OK,
        data: { users: data, total: count, page, limit },
      });
    }

    return response({
      code: httpStatusCodes.BAD_REQUEST,
      err: httpErrors.BAD_REQUEST_ERROR_NO_USERS_FOUND,
    });
  } catch (error) {
    return response(error);
  }
};

export default handler;
