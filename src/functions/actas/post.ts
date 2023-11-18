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
import { ScrutinyStatus } from "@/helpers/models/entities/scrutinyEntity";

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
      files: array().required(),
    });

    // @TODO: Validar formato de imagen
    // @TODO: Validar tamaño de imagen

    // Validamos el payload
    await schema.validate(payload);

    const { mesaId } = payload;

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

    // Generamos el nombre de los recursos
    const d = new Date();
    const filename = `${mesaId}_${d.toISOString().slice(0, 10).split("-").join("")}-${d.getUTCHours()}${d.getUTCMinutes()}${d.getUTCSeconds()}_${(+d).toString(16).slice(-8)}`;

    // Generamos instancia del cliente de S3
    const s3 = new S3Client();

    // Guardamos la imagen en el bucket correspondiente
    const imagePath = `actas/${filename}.jpg`;
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: imagePath,
            Body: payload.files[0].content,
            ContentType: "image/jpeg",
        })
    );

    log.info("telegrama subido a s3 correctamente");

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
      imagenActa: {
        path: imagePath,
      },
      estado: ScrutinyStatus.ENVIADO,
    };

    const totalVotes =
      Number(payload.conteoLla) +
      Number(payload.conteoUp) +
      Number(payload.votosImpugnados) +
      Number(payload.votosNulos) +
      Number(payload.votosEnBlanco) +
      Number(payload.votosRecurridos);

    if (totalVotes > 600 || totalVotes !== Number(payload.votosEnTotal)) {
      payloadToSave.estado = ScrutinyStatus.ANOMALIA;
    }

    // Guardar payload en el bucket correspondiente
    const payloadPath = `payloads/${filename}.json`;
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: payloadPath,
            Body: JSON.stringify(payloadToSave),
            ContentType: "application/json",
        })
    );

    const data: ActasResponse = {
      mesaId: mesaId,
      url: imagePath,
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
