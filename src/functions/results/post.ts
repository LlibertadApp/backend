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
  //api_lla: number,
  //api_uxp: number,
  //api_blanco: number,
  //api_comando: number,
  //api_impugnado: number,
  //api_nulo: number,
  //api_recurrido: number,
  //ocr_lla: number,
  //ocr_uxp: number,
  //ocr_blanco: number,
  //ocr_comando: number,
  //ocr_impugnado: number,
  //ocr_nulo: number,
  //ocr_recurrido: number
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
    UPDATE resultados
    SET
        fiscal_lla = $1,
        fiscal_uxp = $2,
        fiscal_blanco = $3,
        fiscal_comando = $4,
        fiscal_impugnado = $5,
        fiscal_nulo = $6,
        fiscal_recurrido = $7
    WHERE mesa_id = $8
`;

  let values = [
    fiscal_lla,
    fiscal_uxp,
    fiscal_blanco,
    fiscal_comando,
    fiscal_impugnado,
    fiscal_nulo,
    fiscal_recurrido,
    mesa_id,
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
