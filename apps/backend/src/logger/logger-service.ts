import { LoggingWinston } from '@google-cloud/logging-winston';
import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from 'winston';
import 'winston-daily-rotate-file';
import { NODE_ENV } from '../env';

const { combine, timestamp, json } = format;

const loggingWinston = new LoggingWinston();
const getLoggerProperties = (type = 'common'): LoggerOptions => ({
  defaultMeta: {
    component: type,
  },
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    json(),
  ),
  transports: [
    ...(NODE_ENV === 'development' ? [new transports.Console()] : []),
    ...(NODE_ENV !== 'development' ? [loggingWinston] : []),
  ],
});

export const logger: Logger = createLogger(getLoggerProperties('common'));
export const apiLogger: Logger = createLogger(getLoggerProperties('api'));
