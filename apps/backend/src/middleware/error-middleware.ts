import { NextFunction, Request, Response, ErrorRequestHandler, RequestHandler } from 'express'
import { HttpError } from '@hospital/shared';
import { logger } from '../logger/logger-service'

export const errorMiddleware: ErrorRequestHandler = async (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    res.status(err.code).send({ message: err.message })
    return;
  }
  console.log(err)
  res.status(500).send({ message: 'Something went wrong' })
  return next(err);
}

export const errorHandler = (
  cb: (req: Request, res: Response, next: NextFunction) => unknown,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
      return;
    } catch (err) {
      if (err instanceof HttpError) {
        const { code, message, extra } = err as HttpError
        if (extra) {
          logger.error(`HttpError - code: ${code} - message: ${message} - extra: ${extra}`);
          res.status(code).json({ message, extra })
          return;
        }
        logger.error(`HttpError - message: ${message}`);
        res.status(code).json({ message })
        return;
      } else {
        logger.error(`HttpError - message: ${err}`);
        res
          .status(500)
          .json({ message: 'Unknown error. Retry after some time', extra: `${err}` })
        return;
      }
    }
  }
}
