import pino from "pino";

let logger: {
  info(event: string, meta?: any): void;
  error(error: any, meta?: any): void;
} | null = null;

const createLogger = (source: string) => {
  if (logger) return logger;

  const pinoInstance = pino({
    base: { source },
    messageKey: "event",
    timestamp: () => `,"timestamp": "${new Date().toISOString()}"`,
  });

  logger = {
    info(event: string, meta?: any) {
      pinoInstance.info({ event, meta });
    },
    error(event: any, error?: any, meta?: any) {
      pinoInstance.error({ error }, event, meta);
    },
  };

  return logger;
};

export default createLogger;
