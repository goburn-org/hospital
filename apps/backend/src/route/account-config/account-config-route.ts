import { ensure } from '@hospital/shared';
import { Router } from 'express';
import { errorHandler } from '../../middleware/error-middleware';
import { hospitalService } from '../../service/hospital-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/account-config';

route.get(
  `${baseVersion}${baseRoute}/:hospitalId`,
  errorHandler(async (req, res) => {
    const hospitalId = Number(req.params.hospitalId);
    ensure(Number.isInteger(hospitalId), 'Role Name is required');
    const hospital = await hospitalService.getById(hospitalId);
    res.json(hospital);
  }),
);

export default [route];
