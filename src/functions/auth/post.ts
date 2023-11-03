/// <reference path="../../symbols.d.ts" />
// import { DatabaseConnection } from "@/helpers/database/connection";
import "reflect-metadata";
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import response from "@/helpers/response";
import { httpStatusCodes } from "@/helpers/configs/errorConstants";
import * as admin from 'firebase-admin';
import { initializeFirebaseAdminApp } from "@/helpers/firebase/firebase-admin";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: Callback
): Promise<any> => {
  global.cb = callback;
  const userId = event.queryStringParameters?.userId;

  await initializeFirebaseAdminApp();

  if (!userId) {
    return response({
      code: httpStatusCodes.BAD_REQUEST,
      err: 'Missing userId query parameter',
    });
  }

  try {
    const customToken = await admin.auth().createCustomToken(userId);

    return response({
      code: httpStatusCodes.OK,
      data: { customToken },
    });
  } catch (error) {
    console.error('Error creating custom token:', error);
    return response({
      code: httpStatusCodes.INTERNAL_SERVER_ERROR,
      err: 'Error creating custom token',
    });
  }
};

export default handler;
