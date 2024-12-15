import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { orderService } from '../../service/order-service';
import { patientOrderService } from '../../service/patient/patient-order-service';
import { patientVisitService } from '../../service/patient/patient-visit-service';
import { tokenService } from '../../service/token-service';

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

route.get(
  `${baseVersion}${baseRoute}/consultation/token`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await tokenService.getAll();
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/order/token`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await patientOrderService.getTotalOrder();
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/token/:doctorId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const doctorId = req.params.doctorId;
    const orders = await patientVisitService.getToken(doctorId);
    res.json(orders);
  }),
);

export default [route];
