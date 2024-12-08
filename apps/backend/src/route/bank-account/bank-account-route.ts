import { bankAccountCreateSchema } from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { bankAccountService } from '../../service/bank-account-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/bank-account';

route.put(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = bankAccountCreateSchema.parse(req.body);
    const id = Number(req.params.id);
    const data = await bankAccountService.update(id, body);
    res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await bankAccountService.getAll();
    return res.send(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = bankAccountCreateSchema.parse(req.body);
    const data = await bankAccountService.create(body);
    return res.send(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/:id/active`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const id = Number(req.params.id);
    const isActive = req.body.isActive;
    const data = await bankAccountService.updateActive(id, isActive);
    return res.send(data);
  }),
);

export default [route];
