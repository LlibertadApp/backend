/// <reference path="../../symbols.d.ts" />
import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { S3Client, PutObjectCommand  } from "@aws-sdk/client-s3";
import { object, string, number, array } from "yup";
import { jwtDecode } from "jwt-decode";
import parser from "lambda-multipart-parser";

import response from "@/helpers/response";
import logger from "@/helpers/logger";
import { httpErrors, httpStatusCodes } from "@/_core/configs/errorConstants";
import { ActasResponse, UserToken } from "@/types/api-types.d";

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
      conteoLla: number().required().min(0).integer(),
      conteoUp: number().required().min(0).integer(),
      votosImpugnados: number().required().min(0).integer(),
      votosNulos: number().required().min(0).integer(),
      votosEnBlanco: number().required().min(0).integer(),
      votosRecurridos: number().required().min(0).integer(),
      votosEnTotal: number().required().min(0).integer(),
      userId: string().required(),
      files: array().required(),
    });

    // @TODO: Validar formato de imagen
    // @TODO: Validar tamaño de imagen

    // Validamos el payload
    await schema.validate(payload);

    const { mesaId } = payload;

    // Si llegamos hasta acá es porque hay un Bearer válidado
    const token = event.headers.authorization!.split(" ")[1];
    const decoded = jwtDecode<UserToken>(token);
    const userId = decoded.uid;

    // Validamos que el usuario tenga permisos para la mesa indicada
    const found = decoded.claims.mesas.filter(i => i.mesaId == mesaId);

    if (found.length == 0) {
      // El usuario no tiene acceso a la mesa
      return response({
        code: httpStatusCodes.FORBIDDEN,
        err: httpErrors.FORBIDDEN,
      });
    }

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
      userId,
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
      code: httpStatusCodes.CREATED,
      data: data,
    });
  } catch (err: any) {
    return response({ err });
  }
};

export default handler;
