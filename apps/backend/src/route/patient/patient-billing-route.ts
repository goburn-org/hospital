import {
  ensure,
  getToday,
  getYesterday,
  validateOpBillingReportQuery,
  validatePaginateParamsWithSort,
} from '@hospital/shared';
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth-middleware';
import { errorHandler } from '../../middleware/error-middleware';
import { patientBillingService } from '../../service/patient/patient-billing-service';
import { patientOrderService } from '../../service/patient/patient-order-service';
import { patientReceiptService } from '../../service/patient/patient-receipt-service';

const route = Router();
const baseVersion = '/v1';
const baseRoute = '/billing';

route.post(
  `${baseVersion}${baseRoute}/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const patientId = req.params.patientId;
    ensure(patientId, 'Invalid patientId params');
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const orders = await patientOrderService.getByVisitId(visitId);
    const oldData = await patientBillingService.getBill(visitId);
    const alreadyAddedOrder =
      (oldData?.bill?.map((o) => o.BillingPatientOrderLineItem) ?? [])
        .flat()
        ?.map((o) => o.order)
        .flat() ?? [];
    const orderToQuantity = orders.reduce(
      (acc, o) => {
        if (acc[o.id]) {
          acc[o.id] += 1;
          return acc;
        }
        acc[o.id] = 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const alreadyAddedOrderToQuantity = alreadyAddedOrder.reduce(
      (acc, o) => {
        if (acc[o.id]) {
          acc[o.id] += 1;
          return acc;
        }
        acc[o.id] = 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const orderToQuantityToBeAdded = Object.keys(orderToQuantity).reduce(
      (acc, o) => {
        if (alreadyAddedOrderToQuantity[o]) {
          const quantity = orderToQuantity[o] - alreadyAddedOrderToQuantity[o];
          if (quantity > 0) {
            acc[o] = quantity;
          }
          return acc;
        }
        acc[o] = orderToQuantity[o];
        return acc;
      },
      {} as Record<string, number>,
    );
    const ordersToBeAdded = Object.keys(orderToQuantityToBeAdded).map((o) => {
      return orders.find((order) => order.id === o)!;
    });
    if (ordersToBeAdded.length) {
      await patientBillingService.createOutpatientBilling(
        visitId,
        ordersToBeAdded,
      );
    }
    const data = await patientBillingService.getBill(visitId);
    res.json(data);
  }),
);

route.put(
  `${baseVersion}${baseRoute}/:patientId/:visitId/:lineItemId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const lineItemId = Number(req.params.lineItemId);
    const { isRemoved } = req.body;
    ensure(lineItemId, 'Invalid lineItemId params');
    await patientBillingService.toggleLineItem(
      req.params.visitId,
      lineItemId,
      isRemoved,
    );
    const data = await patientBillingService.getBill(req.params.visitId);
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}/report`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const data = await patientReceiptService.getReport();
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
  `${baseVersion}${baseRoute}/:patientId/:visitId`,
  authMiddleware,
  errorHandler(async (req, res) => {
    const visitId = req.params.visitId;
    ensure(visitId, 'Invalid visitId params');
    const data = await patientBillingService.getBill(visitId);
    res.json(data);
  }),
);

route.get(
  `${baseVersion}${baseRoute}`,
  authMiddleware,
  errorHandler(async (req, res) => {
    ensure(validatePaginateParamsWithSort(req.query), 'Invalid sort params');
    ensure(validateOpBillingReportQuery(req.query), 'Invalid query params');
    const yesterday = getYesterday();
    const today = getToday();
    const query =
      !req.query.search && !req.query.query?.visitDate
        ? {
            ...req.query.query,
            visitDate: {
              from: yesterday,
              to: today,
            },
          }
        : req.query.query;
    const param = {
      paginate: req.query.paginate,
      sort: req.query.sort,
      search: req.query.search,
      query: query,
    };
    const data = await patientBillingService.getAll(param);
    res.json(data);
  }),
);

export default [route];
