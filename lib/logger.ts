import { createLogger, format, transports } from "winston";
import "@/lib/envConfig";

const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || "info";

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.prettyPrint(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const logMessage = `${timestamp} ${level}: ${message}`;
      const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : "";
      return `${logMessage}${metaString}`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
