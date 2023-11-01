import HttpStatus from "./enum/http";

const response = ({
  code = HttpStatus.OK,
  data = null,
  err = null,
  headers = {},
}: {
  code?: number;
  data?: any;
  err?: Error | [] | null | unknown;
  headers?: any;
}) => {
  headers["Content-Type"] = "application/json";
  if (!headers["Cache-Control"] && code != 404) {
    headers["Cache-Control"] = process.env.CACHE_TTL;
  }
  // determinate the type of the args
  let body: { data?: null | [] | {}; errors?: any[] | any } = { data };
  if (err) {
    delete body.data;
    code = code && code != HttpStatus.OK ? code : HttpStatus.BAD_REQUEST;
    body.errors = err instanceof Error ? { message: err.message } : err;
  }

  // @ts-ignore global cb
  return cb(null, {
    statusCode: code,
    body: JSON.stringify(body),
    headers,
  });
};

export default response;
