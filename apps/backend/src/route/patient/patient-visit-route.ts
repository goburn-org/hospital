import {
  createAssessmentSchema,
  createPatientBillingSchema,
  createPatientOrderSchema,
  createPatientVisitSchema,
  createPatientVitalSchema,
  ensure,
  PaginateParamsWithSort,
  prescriptionDbConvertor,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { assessmentService } from '../../service/patient/assessment-service';
import { patientBillingService } from '../../service/patient/patient-billing-service';
import { patientOrderService } from '../../service/patient/patient-order-service';
import { patientPrescriptionService } from '../../service/patient/patient-prescription-service';
import { patientReceiptService } from '../../service/patient/patient-receipt-service';
import { patientVisitService } from '../../service/patient/patient-visit-service';
import { patientVitalService } from '../../service/patient/patient-vital-service';

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
    const { advanceAmount, ...rest } = body;
    const data = await patientVisitService.create(patientId, rest);
    if (advanceAmount) {
      await patientReceiptService.create({
        visitId: data.id,
        paid: advanceAmount,
        reason: 'Advance Payment',
      });
    }
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
    const body = createAssessmentSchema.parse(req.body);
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

route.post(
  `${baseVersion}${baseRoute}/vital/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const body = createPatientVitalSchema.parse(req.body);
    const data = await patientVitalService.upsert(visitId, body);
    res.json(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/prescription/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const body = prescriptionDbConvertor.to(req.body);
    const data = await patientPrescriptionService.upsert(visitId, body);
    res.json(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/checkout/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const body = createPatientBillingSchema.parse(req.body);
    await patientBillingService.upsert(visitId, body);
    const data = await patientVisitService.checkout(visitId);
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:patientId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid sort params');
    let paginate: PaginateParamsWithSort | undefined = undefined;
    if (req.query.paginate) {
      ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
      paginate = req.query;
    }
    const data = await patientVisitService.getAll(patientId, paginate);
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
    console.log('getting visit id', visitId);
    const data = await patientVisitService.getById(visitId);
    res.send(data);
  }),
);

export default [route];
