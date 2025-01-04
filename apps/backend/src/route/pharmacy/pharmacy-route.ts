import {
  counterSaleAvailabilityInput,
  ensure,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { pharmacyService } from '../../service/pharmacy/pharmacy-service';
import { productService } from '../../service/product-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/pharmacy';

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    const hospitalId = user.hospitalId;
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid query params');
    const data = await pharmacyService.getAll({
      hospitalId,
      options: req.query,
    });
    return res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await productService.getById(req.params.id);
    return res.send(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/availability`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const items = counterSaleAvailabilityInput.parse(req.body.items);
    const data = await pharmacyService.getAvailability(items);
    return res.send(data);
  }),
);

export default [route];
