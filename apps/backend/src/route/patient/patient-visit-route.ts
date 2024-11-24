import {
  createPatientVisitSchema,
  ensure,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { patientVisitService } from '../../service/patient/patient-visit-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/visit';

route.post(
  `${baseVersion}${baseRoute}/:patientId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid sort params');
    const body = createPatientVisitSchema.parse({
      ...req.body,
      checkInTime: new Date(req.body.checkInTime),
    });
    const data = await patientVisitService.create(patientId, body);
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:patientId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid sort params');
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    const param = {
      paginate: req.query.paginate,
      sort: req.query.sort,
      search: req.query.search,
    };
    const data = await patientVisitService.getAll(patientId, param);
    res.send(data);
  }),
);

export default [route];
