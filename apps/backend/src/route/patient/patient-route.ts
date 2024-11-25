import {
  createPatientSchema,
  ensure,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { patientService } from '../../service/patient/patient-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/patient';

route.post(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const body = createPatientSchema.parse({
      ...req.body,
      dob: req.body.dob ? new Date(req.body.dob) : undefined,
    });
    const data = await patientService.create(body);
    res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    const param = {
      paginate: req.query.paginate,
      sort: req.query.sort,
      search: req.query.search,
    };
    const data = await patientService.getAll(param);
    res.send(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:id`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await patientService.getById(req.params.id);
    res.send(data);
  }),
);

export default [route];
