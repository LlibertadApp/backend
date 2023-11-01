/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import response from "@/helpers/response";
import logger from "@/helpers/logger";
import { object, string, number } from "yup";
import { DatabaseConnection } from "@/helpers/database/connection";
import HttpStatus from "@/helpers/enum/http";
import { postReultsResponse } from "@/helpers/models/response/postResultsResponse";

type ActasInput = {
  mesa_id: string;
  fiscal_lla: number;
  fiscal_uxp: number;
  fiscal_blanco: number;
  fiscal_comando: number;
  fiscal_impugnado: number;
  fiscal_nulo: number;
  fiscal_recurrido: number;
};

type ActasResponse = {
  mesaId: string;
  url: string;
};

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
const log = logger("POST_RESULTS");
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  global.cb = callback;
  /* const { BUCKET_NAME } = process.env; */
  const payload = JSON.parse(event.body!) as ActasInput;

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
    INSERT INTO resultados
        mesa_id = $1
        fiscal_lla = $2,
        fiscal_uxp = $3,
        fiscal_blanco = $4,
        fiscal_comando = $5,
        fiscal_impugnado = $6,
        fiscal_nulo = $7,
        fiscal_recurrido = $8
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

  try {
    await dbConnection.queryWrite(query, values);

    let successfulProcess: postReultsResponse = {
      result: "successful",
    };

    log.info(`resultados de mesa ${mesa_id} cargados correctamente`);
    return response({
      code: HttpStatus.OK,
      data: successfulProcess,
    });
  } catch (err: any) {
    return response({
      code: HttpStatus.BAD_REQUEST,
      err: err,
    });
  }
};

export default handler;
