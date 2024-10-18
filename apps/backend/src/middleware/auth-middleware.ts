import { NextFunction, Request, Response } from 'express';
import { apiLogger } from '../logger/logger-service';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('AuthMiddleware');
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  apiLogger.log('AuthMiddleware', `Token: ${token}`);
  next();
  return;
};
