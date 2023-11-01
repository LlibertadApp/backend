import logger from "@/helpers/logger";
import HttpStatus from "./enum/http";

type HttpResponse = {
  statusCode: number;
  body: any;
  headers: [key: string];
};

const response = ({
  code = HttpStatus.OK,
  data = null,
  err = null,
  headers = {},
}: {
  code?: number;
  data?: any;
  err?: Error | null | unknown;
  headers?: any;
}): HttpResponse => {
  const log = logger("RESPONSE");
  headers["Content-Type"] = "application/json";
  if (!headers["Cache-Control"] && code != 404) {
    headers["Cache-Control"] = process.env.CACHE_TTL;
  }
  // determinate the type of the args
  let body: { data?: null | [] | {}; error?: any | any } = { data };
  if (err) {
    log.error(err);
    delete body.data;
    code = code && code != 200 ? code : 400;
    body.error = err instanceof Error ? { message: err.message } : err;
  }

  // @ts-ignore global cb
  return cb(null, {
    statusCode: code,
    body: JSON.stringify(body),
    headers,
  });
};

export default response;
