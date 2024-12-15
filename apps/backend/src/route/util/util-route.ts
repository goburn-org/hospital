import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { orderService } from '../../service/order-service';
import { patientVisitService } from '../../service/patient/patient-visit-service';

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
  `${baseVersion}${baseRoute}/token/:doctorId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const doctorId = req.params.doctorId;
    const orders = await patientVisitService.getToken(doctorId);
    res.json(orders);
  }),
);

export default [route];
