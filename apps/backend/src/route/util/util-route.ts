import { AllTokensResponse } from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { employeeService } from '../../service/employee-service';
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
  `${baseVersion}${baseRoute}/token`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    const isAdmin = user.Department.Role?.isSuperAdmin;
    const doctors = isAdmin
      ? await employeeService.getAllDoctor({
          hospitalId: user.hospitalId,
        })
      : [user];
    const tokens = await Promise.all(
      doctors.map((d) => patientVisitService.getToken(d.id)),
    );
    const tokenMap = tokens.reduce(
      (acc, t, idx) => ({
        ...acc,
        [doctors[idx].id]: {
          ...t,
          consultantName: doctors[idx].name,
        },
      }),
      {} as AllTokensResponse,
    );
    res.json(tokenMap);
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
