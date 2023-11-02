/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import response from "@/helpers/response";
import logger from "@/helpers/logger";
import { object, string, number } from "yup";
import { DatabaseConnection } from "@/helpers/database/connection";
import HttpStatus from "@/helpers/enum/http";
import { PostResultadosResponse, ResultadosInput } from "@/types";

/**
 * Usage
 * POST /results
 * @param mesa_id
 * @param fiscal_lla
 * @param fiscal_uxp
 * @param fiscal_blanco
 * @param fiscal_comando
 * @param fiscal_impugnado
 * @param fiscal_nulo
 * @param fiscal_recurrido
 */
const log = logger("POST_RESULTADOS");
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  try {
    global.cb = callback;
    const payload = JSON.parse(event.body!) as ResultadosInput;

    const schema = object({
      mesa_id: string().required(),
      fiscal_lla: number().required().positive().integer(),
      fiscal_uxp: number().required().positive().integer(),
      fiscal_blanco: number().required().positive().integer(),
      fiscal_comando: number().required().positive().integer(),
      fiscal_impugnado: number().required().positive().integer(),
      fiscal_nulo: number().required().positive().integer(),
      fiscal_recurrido: number().required().positive().integer(),
    });

    // valida
    const {
      mesa_id,
      fiscal_lla,
      fiscal_uxp,
      fiscal_blanco,
      fiscal_comando,
      fiscal_impugnado,
      fiscal_nulo,
      fiscal_recurrido,
    } = payload;
    await schema.validate(payload);

    // escritura
    const dbConnection = DatabaseConnection.getInstance();
    const query = `
    INSERT INTO resultados (mesa_id, fiscal_lla, fiscal_uxp, fiscal_blanco, fiscal_comando, fiscal_impugnado, fiscal_nulo, fiscal_recurrido)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    let values = [
      mesa_id,
      fiscal_lla,
      fiscal_uxp,
      fiscal_blanco,
      fiscal_comando,
      fiscal_impugnado,
      fiscal_nulo,
      fiscal_recurrido,
    ];

    await dbConnection.queryWrite(query, values);

    let successfulProcess: PostResultadosResponse = {
      result: "successful",
      mesa_id,
    };

    log.info(`resultados de mesa ${mesa_id} cargados correctamente`);
    return response({
      code: HttpStatus.CREATED,
      data: successfulProcess,
    });
  } catch (err: any) {
    return response(err);
  }
};

export default handler;
