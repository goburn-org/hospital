import { Router } from 'express';
import { errorHandler } from '../../middleware/error-middleware';
import { orderService } from '../../service/order-service';
import { authMiddleware } from '../../middleware/auth-middleware';
import { useAuthUser } from '../../provider/async-context';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/util';

route.get(
  `${baseVersion}${baseRoute}/orders`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    const orders = await orderService.getAll(user.hospitalId);
    res.json(orders);
  }),
);

export default [route];
