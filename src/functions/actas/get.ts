/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { jwtDecode } from "jwt-decode";

import response from "@/helpers/response";
import { httpErrors, httpStatusCodes } from "@/_core/configs/errorConstants";
import { UserToken } from "@/types/api-types.d";
import { findScrutiniesByMesaId} from "@/helpers/daos/scrutinyDao";

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

  // This enables Lambda function to complete
  context.callbackWaitsForEmptyEventLoop = false

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

    const scrutinies = await findScrutiniesByMesaId(mesaId);

    // 200 OK
    return response({
      code: httpStatusCodes.OK,
      data: scrutinies,
    });

  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
