/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import response from "@/helpers/response";
import logger from "@/helpers/logger";
import { object, string } from "yup";
import { DatabaseConnection } from "@/helpers/database/connection";
import HttpStatus from "@/helpers/enum/http";

type ActasInput = {
  mesaId: string;
  imagenActa: string;
};

type ActasResponse = {
  mesaId: string;
  url: string;
};

/**
 * Usage
 * POST /actas
 * @param mesaId ID de la mesa auditada a la que pertenece este telegrama
 * @param imagenActa Base64 que representa la imagen tomada por el usuario
 */
const log = logger("POST_ACTAS");
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  global.cb = callback;
  const { BUCKET_NAME } = process.env;
  const payload = JSON.parse(event.body!) as ActasInput;
  try {
    const schema = object({
      mesaId: string().required(),
      imagenActa: string().required(),
    });

    // valida
    const { imagenActa, mesaId } = payload;
    await schema.validate(payload);

    // manda acta a S3
    const base64 = Buffer.from(
      imagenActa.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const asset = `actas/${mesaId}.jpeg`;
    const opts: AWS.S3.PutObjectRequest = {
      Bucket: BUCKET_NAME!,
      Key: asset,
      ContentEncoding: "base64",
      Body: base64,
      ACL: "public-read",
    };

    const bucket = new AWS.S3();
    await bucket.putObject(opts).promise();
    log.info("telegrama subido a s3 correctamente");
    const url = `https://${BUCKET_NAME}/${asset}`;
    const data: ActasResponse = {
      mesaId,
      url,
    };

    const dbConnection = DatabaseConnection.getInstance();
    const query: string = 'INSERT INTO telegramas(mesa_id, link) VALUES ( \
      (SELECT id from mesas where identificador_unico_mesa = $1 LIMIT 1), $2) \
      ON CONFLICT (mesa_id) DO UPDATE SET link = EXCLUDED.link';

    const insertValues = [mesaId, url];
    dbConnection.queryWrite(query, insertValues);

    // @TODO: encolar evento para OCRs
    return response({
      code: HttpStatus.CREATED,
      data: data,
    });
  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
