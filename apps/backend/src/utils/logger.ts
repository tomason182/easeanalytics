import winston from "winston";
import path from "node:path";
import fs from "node:fs";

const backendLogDir = path.join(__dirname, "logs/easeanalytics_api");

if (!fs.existsSync(backendLogDir)) {
  fs.mkdirSync(backendLogDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(backendLogDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(backendLogDir, "combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp} ${level}: ${message}]`;
        })
      ),
    })
  );
}
