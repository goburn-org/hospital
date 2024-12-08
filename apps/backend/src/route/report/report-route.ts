import { ensure, validatePaginateParamsWithSort } from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { useAuthUser } from '../../provider/async-context';
import { patientOrderService } from '../../service/patient/patient-order-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/report';

route.get(
  `${baseVersion}${baseRoute}/order`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const user = useAuthUser();
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    const data = await patientOrderService.getVisitByOrderHistory(
      user.hospitalId,
    );
    return res.send(data);
  }),
);

export default [route];
