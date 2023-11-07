/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { S3Client, PutObjectCommand  } from "@aws-sdk/client-s3";
import response from "@/helpers/response";
import logger from "@/helpers/logger";
import { object, string, number, array } from "yup";
import HttpStatus from "@/helpers/enum/http";
import { ActasResponse } from "@/types/api-types.d";
import parser from "lambda-multipart-parser";

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

  const {
    S3_ENDPOINT,
    BUCKET_IMAGES_NAME,
    BUCKET_PAYLOADS_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
  } = process.env;

  const payload = await parser.parse(event);
  // const payload = JSON.parse(event.body!) as ActasInput;

  try {
    const schema = object({
      mesaId: string().required(),
      conteoLla: number().required().positive().integer(),
      conteoUp: number().required().positive().integer(),
      votosImpugnados: number().required().positive().integer(),
      votosNulos: number().required().positive().integer(),
      votosEnBlanco: number().required().positive().integer(),
      votosRecurridos: number().required().positive().integer(),
      votosEnTotal: number().required().positive().integer(),
      userId: string().required(),
      files: array().required(),
    });

    // @TODO: Validar formato de imagen
    // @TODO: Validar tamaño de imagen

    // Validamos el payload
    await schema.validate(payload);

    const { mesaId } = payload;

    // Generamos instancia del cliente de S3
    const s3 = new S3Client({
       credentials: {
           accessKeyId: AWS_ACCESS_KEY_ID || '',
           secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
       },
       endpoint: S3_ENDPOINT || '',
       forcePathStyle: true,
    });

    // Guardamos la imagen en el bucket correspondiente
    const imagePath = `actas/${mesaId}.jpg`;
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET_IMAGES_NAME,
            Key: imagePath,
            Body: payload.files[0].content,
            ContentType: "image/jpeg",
            ACL: "public-read",
        })
    );

    log.info("telegrama subido a s3 correctamente");
    const url = `${S3_ENDPOINT}/${imagePath}`;

    const payloadToSave = {
      mesaId: payload.mesaId,
      conteoLla: payload.conteoLla,
      conteoUp: payload.conteoUp,
      votosImpugnados: payload.votosImpugnados,
      votosNulos: payload.votosNulos,
      votosEnBlanco: payload.votosEnBlanco,
      votosRecurridos: payload.votosRecurridos,
      votosEnTotal: payload.votosEnTotal,
      userId: payload.userId,
    };

    // Guardar payload en el bucket correspondiente
    const payloadPath = `payloads/${mesaId}.json`;
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET_PAYLOADS_NAME,
            Key: payloadPath,
            Body: JSON.stringify(payloadToSave),
            ContentType: "application/json",
            ACL: "public-read",
        })
    );

    const data: ActasResponse = {
      mesaId,
      url,
    };

    // 201 CREATED
    return response({
      code: HttpStatus.CREATED,
      data: data,
    });
  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
