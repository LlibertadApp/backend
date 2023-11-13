/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { jwtDecode } from "jwt-decode";
import AmazonDaxClient from "amazon-dax-client";

import response from "@/helpers/response";
import { httpErrors, httpStatusCodes } from "@/_core/configs/errorConstants";
import { ActasResponse, UserToken } from "@/types/api-types.d";

// Defined at file level, so we can reuse between lambda executions
var dynamodb;

/**
* Usage
* GET /actas/{mesaId}
* @param mesaId ID de la mesa a consultar
*/
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  global.cb = callback;

  const mesaId = event.pathParameters?.mesaId;

  if (!mesaId) {
    return response({
      code: httpStatusCodes.BAD_REQUEST,
      err: httpErrors.BAD_REQUEST_ERROR_NO_DATA_PROVIDED,
    });
  }

  try {
    // Si llegamos hasta acá es porque hay un Bearer válidado
    const token = event.headers.authorization!;
    const decoded = jwtDecode<UserToken>(token);
    const userId = decoded.user_id;

    // Validamos que el usuario tenga permisos para la mesa indicada
    const found = decoded.mesas.filter(i => i.mesaId == mesaId);

    if (found.length == 0) {
      // El usuario no tiene acceso a la mesa
      return response({
        code: httpStatusCodes.FORBIDDEN,
        err: httpErrors.FORBIDDEN,
      });
    }

    if (!dynamodb) {
      if (process.env.DAX_ENDPOINT) {
        console.log('Using DAX endpoint', process.env.DAX_ENDPOINT);
        dynamodb = new AmazonDaxClient({endpoints: [process.env.DAX_ENDPOINT]});
      } else {
        // DDB_LOCAL can be set if using lambda-local with dynamodb-local or another local
        // testing environment
        if (process.env.DDB_LOCAL) {
          console.log('Using DynamoDB local');
          dynamodb = new DynamoDBClient({endpoint: 'http://localhost:8000', region: 'ddblocal'});
        } else {
          console.log('Using DynamoDB');
          dynamodb = new DynamoDBClient({});
        }
      }
    }

    const docClient = DynamoDBDocumentClient.from(dynamodb);

    const command = new GetCommand({
      TableName: process.env.DDB_TABLE,
      Key: {
        mesaId: mesaId,
        userId: userId,
      },
    });

    const doc = await docClient.send(command);

    if (doc.Item) {
      // 200 OK
      return response({
        code: httpStatusCodes.OK,
        data: doc.Item,
      });
    }

    // Document not found
    return response({
      code: httpStatusCodes.NOT_FOUND,
      err: httpErrors.NOT_FOUND,
    });

  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
