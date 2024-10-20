import { NextFunction, Request, Response } from 'express';
import { setAuthUser, useAuthUser } from '../provider/async-context';
import { userService } from '../service/user-service';
import { logger } from '../logger/logger-service';

export const setUserContext = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (token == null) {
    next();
    return;
  }
  const user = await userService.validateByToken(token);
  if (user) {
    setAuthUser(user);
  }
  next();
  return;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('AuthMiddleware');
  try {
    useAuthUser();
  } catch (e) {
    logger.error('Unauthorized', e);
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  next();
  return;
};
