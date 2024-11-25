import { HttpError, Prisma } from '@hospital/shared';
import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { logger } from '../logger/logger-service';

function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint error
      return 'A record with this field already exists.';
    }
    // Add more Prisma error codes as needed
  }
  return false;
}

export const errorMiddleware: ErrorRequestHandler = async (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    res.status(err.code).send({ message: err.message });
    return;
  }
  const prismError = handlePrismaError(err);
  console.log(prismError);
  if (prismError) {
    res.status(400).send({ message: prismError });
    return;
  }
  console.log(err);
  res.status(500).send({ message: 'Something went wrong' });
  return next(err);
};

export const errorHandler = (
  cb: (req: Request, res: Response, next: NextFunction) => unknown,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
      return;
    } catch (err) {
      if (err instanceof HttpError) {
        const { code, message, extra } = err as HttpError;
        if (extra) {
          logger.error(
            `HttpError - code: ${code} - message: ${message} - extra: ${extra}`,
          );
          res.status(code).json({ message, extra });
          return;
        }
        logger.error(`HttpError - message: ${message}`);
        res.status(code).json({ message });
        return;
      } else {
        const prismError = handlePrismaError(err);
        if (prismError) {
          res.status(400).send({ message: prismError });
          return;
        }
        logger.error(`HttpError - message: ${err}`);
        res.status(500).json({
          message: 'Unknown error. Retry after some time',
          extra: `${err}`,
        });
        return;
      }
    }
  };
};
