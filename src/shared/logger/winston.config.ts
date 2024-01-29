import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Create transports instance
const transports = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
      ),
    ),
  }),
  new winston.transports.DailyRotateFile({
    level: 'error',
    filename: 'logs/inventory-%DATE%-error.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }),
  new winston.transports.DailyRotateFile({
    level: 'info',
    filename: 'logs/inventory-%DATE%-info.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
  }),
];

// Create and export the logger instance
export const logger = winston.createLogger({
  transports,
});