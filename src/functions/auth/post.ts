/// <reference path="../../symbols.d.ts" />
// import { DatabaseConnection } from "@/helpers/database/connection";
import "reflect-metadata";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import response from "@/helpers/response";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { isValidMesasResponse } from "@/_domain/validators/mesa/mesa.validator";
import { httpErrors, httpStatusCodes } from "@/_core/configs/errorConstants";
import { initializeFirebaseAdminApp } from "@/_core/firebase/firebase-admin";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: Callback
): Promise<any> => {
  global.cb = callback;
  const userId = event.queryStringParameters?.userId;

  if (!userId || !event.body) {
    return response({
      code: httpStatusCodes.BAD_REQUEST,
      err: httpErrors.BAD_REQUEST_ERROR_NO_DATA_PROVIDED,
    });
  }

  await initializeFirebaseAdminApp();

  try {
    const mesasBody: MesasBody = JSON.parse(event.body);

    if (!isValidMesasResponse(mesasBody)) {
      return response({
        code: httpStatusCodes.BAD_REQUEST,
        err: httpErrors.BAD_REQUEST_ERROR_INVALID_PAYLOAD,
      });
    }

    const customToken = await admin.auth().createCustomToken(uuidv4(), mesasBody);

    return response({
      code: httpStatusCodes.OK,
      data: {
        oneTimeLinkAuthLink: `${process.env.FRONT_END_URL}/?authToken=${customToken}`,
      },
    });
  } catch (error) {
    console.error(httpErrors.BAD_REQUEST_ERROR_CREATING_CUSTOM_TOKEN, error);
    return response({
      code: httpStatusCodes.INTERNAL_SERVER_ERROR,
      err: httpErrors.BAD_REQUEST_ERROR_CREATING_CUSTOM_TOKEN,
    });
  }
};

export default handler;
