import morgan from 'morgan';
import { apiLogger } from '../logger/logger-service';

const messageFormat =
  ':remote-user - :remote-addr - :method :url :status - :user-agent - :response-time ms';

export const apiLoggerMiddleware = morgan(messageFormat, {
  stream: { write: (message: string) => apiLogger.info(message.trim()) },
});
