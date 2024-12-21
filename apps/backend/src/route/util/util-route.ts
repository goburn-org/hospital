import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { orderService } from '../../service/order-service';
import { patientOrderService } from '../../service/patient/patient-order-service';
import { patientService } from '../../service/patient/patient-service';
import { patientVisitService } from '../../service/patient/patient-visit-service';
import { taxCodeService } from '../../service/tax-code-service';
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
  `${baseVersion}${baseRoute}/order/token/:orderId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const data = await patientOrderService.getToken(orderId);
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

route.get(
  `${baseVersion}${baseRoute}/tax`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const orders = await taxCodeService.getAll();
    res.json(orders);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/area`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const search = req.query.q as string;
    const orders = await patientService.getArea(search);
    res.json(orders);
  }),
);

export default [route];
