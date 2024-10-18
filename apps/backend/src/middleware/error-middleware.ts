import { NextFunction, Request, Response, ErrorRequestHandler } from 'express'
import { HttpError } from '@hospital/shared';
import { logger } from '../logger/logger-service'

export const errorMiddleware: ErrorRequestHandler = async (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    return res.status(err.code).send({ message: err.message })
  }
  console.log(err)
  res.status(500).send({ message: 'Something went wrong' })
  next(err)
}

export const errorHandler = (
  cb: (req: Request, res: Response, next: NextFunction) => unknown,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await cb(req, res, next)
    } catch (err) {
      if (err instanceof HttpError) {
        const { code, message, extra } = err as HttpError
        if (extra) {
          logger.error(`HttpError - code: ${code} - message: ${message} - extra: ${extra}`);
          return res.status(code).json({ message, extra })
        }
        logger.error(`HttpError - message: ${message}`);
        return res.status(code).json({ message })
      } else {
        logger.error(`HttpError - message: ${err}`);
        return res
          .status(500)
          .json({ message: 'Unknown error. Retry after some time', extra: `${err}` })
      }
    }
  }
}
