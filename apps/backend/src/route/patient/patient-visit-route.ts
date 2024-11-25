import {
  createAssessmentSchema,
  createPatientOrderSchema,
  createPatientVisitSchema,
  ensure,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { patientVisitService } from '../../service/patient/patient-visit-service';
import { assessmentService } from '../../service/patient/assessment-service';
import { patientOrderService } from '../../service/patient/patient-order-service';

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

route.post(
  `${baseVersion}${baseRoute}/assessment/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const body = createAssessmentSchema.parse({
      ...req.body,
      followUpDate: req.body.followUpDate
        ? new Date(req.body.followUpDate)
        : undefined,
    });
    const data = await assessmentService.upsert(visitId, body);
    res.json(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/order/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const body = createPatientOrderSchema.parse(req.body);
    const data = await patientOrderService.upsert(visitId, body);
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

route.get(
  `${baseVersion}${baseRoute}/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const data = await patientVisitService.getById(visitId);
    res.send(data);
  }),
);

export default [route];
