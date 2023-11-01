/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import response from "@/helpers/response";
import logger from "@/helpers/logger";

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
  const { imagenActa, mesaId } = event.pathParameters as ActasInput;
  try {
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

    const data: ActasResponse = {
      mesaId,
      url: `https://${BUCKET_NAME}/${asset}`,
    };

    // @TODO: guardar en db, encolar evento para OCRs
    return response({
      data,
    });
  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
