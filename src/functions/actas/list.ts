/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { object, string, number, array } from "yup";
import { jwtDecode } from "jwt-decode";

import response from "@/helpers/response";
import logger from "@/helpers/logger";
import { httpErrors, httpStatusCodes } from "@/_core/configs/errorConstants";
import { ActasResponse, UserToken } from "@/types/api-types.d";
import { findScrutiniesByUserId } from "@/helpers/daos/scrutinyDao";

/**
* Usage
* GET /actas
*/
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  global.cb = callback;

  // This enables Lambda function to complete
  context.callbackWaitsForEmptyEventLoop = false

  try {
    // Si llegamos hasta acá es porque hay un Bearer válidado
    const token = event.headers.authorization!;
    const decoded = jwtDecode<UserToken>(token);
    const userId = decoded.user_id;

    const scrutinies = await findScrutiniesByUserId(userId);

    return response({
      code: httpStatusCodes.OK,
      data: scrutinies,
    });

  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
