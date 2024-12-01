import {
  createPatientVisitSchema,
  ensure,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { patientBillingService } from '../../service/patient/patient-billing-service';
import { patientReceiptService } from '../../service/patient/patient-receipt-service';
import { patientVisitService } from '../../service/patient/patient-visit-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/billing';

route.post(
  `${baseVersion}${baseRoute}/:patientId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const body = createPatientVisitSchema.parse({
      ...req.body,
      checkInTime: new Date(req.body.checkInTime),
    });
    const { billing, ...rest } = body;
    const data = await patientVisitService.create(patientId, rest);
    if (billing.advanceAmount) {
      await patientReceiptService.create({
        visitId: data.id,
        paid: billing.advanceAmount,
        reason: 'Advance Payment',
        isCash: billing.isCash,
      });
    }
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:patientId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId');
    const data = await patientBillingService.getByPatientId(patientId);
    res.json(data);
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
    const data = await patientBillingService.getAll(param);
    res.json(data);
  }),
);

export default [route];
