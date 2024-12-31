import {
  createAssessmentSchema,
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
import { orderService } from '../../service/order-service';
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
    ensure(patientId, 'Invalid patientId');
    const body = createPatientVisitSchema.parse({
      ...req.body,
      checkInTime: new Date(req.body.checkInTime),
    });
    const { billing, orders, ...rest } = body;
    const data = await patientVisitService.create(patientId, rest);
    if (orders.length) {
      const orderList = await orderService.getOrdersByIds(
        orders.map((o) => o.orderId),
      );
      await patientOrderService.upsert(data.id, {
        orderToDoctor: orders.reduce(
          (acc, o) => ({ ...acc, [o.orderId]: o.doctorId }),
          {},
        ),
        patientId,
        visitId: data.id,
        order: orderList,
      });
      const bill = await patientBillingService.createOutpatientBilling(
        data.id,
        orderList,
      );
      if (billing.advanceAmount) {
        await patientReceiptService.create(data.id, {
          cardAmount: billing.cardAmount || [],
          cashAmount: billing.cashAmount || 0,
          items: [],
          totalAmount: billing.advanceAmount,
          billId: bill.id,
        });
      }
    }
    res.json(data);
  }),
);

route.post(
  `${baseVersion}${baseRoute}/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId');
    const body = createPatientVisitSchema.parse({
      ...req.body,
      checkInTime: new Date(req.body.checkInTime),
    });
    const { billing, orders, ...rest } = body;
    const data = await patientVisitService.update(visitId, patientId, rest);
    if (orders.length) {
      const orderList = await orderService.getOrdersByIds(
        orders.map((o) => o.orderId),
      );
      await patientOrderService.upsert(data.id, {
        orderToDoctor: orders.reduce(
          (acc, o) => ({ ...acc, [o.orderId]: o.doctorId }),
          {},
        ),
        patientId,
        visitId: data.id,
        order: orderList,
      });
      const bill = await patientBillingService.createOutpatientBilling(
        data.id,
        orderList,
      );
      if (billing.advanceAmount) {
        await patientReceiptService.create(data.id, {
          cardAmount: billing.cardAmount || [],
          cashAmount: billing.cashAmount || 0,
          items: [],
          totalAmount: billing.advanceAmount,
          billId: bill.id,
        });
      }
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
  `${baseVersion}${baseRoute}/open/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const data = await patientVisitService.open(visitId);
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
