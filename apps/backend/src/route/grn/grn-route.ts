import { createGrnSchema, ensure } from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { grnService } from '../../service/pharmacy/grn-service';
import { skuService } from '../../service/sku/sku-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/grn';

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await grnService.getAll();
    return res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const id = req.params.id as string;
    ensure(id, 'id is required');
    const data = await grnService.getById(id);
    return res.send(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = createGrnSchema.parse(req.body);
    const data = await grnService.create(body);
    await grnService.create(body);
    await skuService.create(body);
    return res.send(data);
  }),
);

export default [route];
