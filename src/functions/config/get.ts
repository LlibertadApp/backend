/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";

import response from "@/helpers/response";

/**
 * Usage
 * GET /config
 */
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  global.cb = callback;
  try {
    console.log("works");
    response({
      data: {
        works: true,
      },
    });
  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
