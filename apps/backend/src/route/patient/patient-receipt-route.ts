import { createPatientBillingSchema, ensure } from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { patientReceiptService } from '../../service/patient/patient-receipt-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/receipt';

route.post(
  `${baseVersion}${baseRoute}/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const body = createPatientBillingSchema.parse({
      ...req.body,
      checkInTime: new Date(req.body.checkInTime),
    });
    const data = await patientReceiptService.create(visitId, body);
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const data = await patientReceiptService.getBill(visitId);
    res.json(data);
  }),
);

export default [route];
