/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { object, string, number, array } from "yup";
import { jwtDecode } from "jwt-decode";
import AmazonDaxClient from "amazon-dax-client";

import response from "@/helpers/response";
import logger from "@/helpers/logger";
import { httpErrors, httpStatusCodes } from "@/_core/configs/errorConstants";
import { ActasResponse, UserToken } from "@/types/api-types.d";

// Defined at file level, so we can reuse between lambda executions
var dynamodb;

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

  try {
    // Si llegamos hasta acá es porque hay un Bearer válidado
    const token = event.headers.authorization!;
    const decoded = jwtDecode<UserToken>(token);
    const userId = decoded.user_id;

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
          dynamodb = new DynamoDBClient({region: 'us-east-1'});
        }
      }
    }

    const docClient = DynamoDBDocumentClient.from(dynamodb);

    const params = {
      TableName: process.env.DDB_TABLE,
      IndexName: "userId",
      FilterExpression: "#db360 = :db360",
      ExpressionAttributeValues: {
        ":db360": {
          "S": userId,
        },
      },
      ExpressionAttributeNames: {
        "#db360": "userId",
      },
    };

    const command = new ScanCommand(params);

    const res = await docClient.send(command);

    return response({
      code: httpStatusCodes.OK,
      data: res.Items,
    });

    // // Document not found
    // return response({
    //   code: httpStatusCodes.NOT_FOUND,
    //   err: httpErrors.NOT_FOUND,
    // });

  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
