import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { orderService } from '../../service/order-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/order';

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    const data = await orderService.getAll(user.hospitalId);
    return res.send(data);
  }),
);

export default [route];