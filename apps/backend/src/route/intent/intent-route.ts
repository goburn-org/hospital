import { createIntentSchema } from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { intentService } from '../../service/pharmacy/intent-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/intent';

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await intentService.getAll();
    return res.send(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = createIntentSchema.parse(req.body);
    const data = await intentService.create(body);
    return res.send(data);
  }),
);

export default [route];
