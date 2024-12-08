import { PaymentMode, Prisma } from '@prisma/client';
import { z } from 'zod';
import { DateLike, Maybe, PaginatedResponse } from '../ts-util';

export const createPatientBillingSchema = z.object({
  cashAmount: z.number(),
  cardAmount: z.number(),
  totalAmount: z.number(),
  billId: z.string().nullable().optional(),
  items: z.array(
    z.object({
      itemId: z.string(),
      itemName: z.string(),
      itemAmount: z.number(),
      isRemoved: z.boolean(),
    }),
  ),
});

export type VisitBillingAggregationByPatientId = {
  visitId: string;
  billing: {
    billId: string;
    total: number;
  }[];
  receipt: {
    receiptId: string;
    billId: string | null;
    paid: number;
    reason: string | null;
  }[];
};

export type AllPatientVisitBillingResponse = {
  patient: {
    name: string;
    uhid: string;
    lastVisit: DateLike;
    mobile: string;
    city: Maybe<string>;
  };
  lastVisit: {
    visitId: string;
    billing: VisitBillingAggregationByPatientId['billing'];
    receipt: VisitBillingAggregationByPatientId['receipt'];
  };
};

export type OpBillingReportResponse = PaginatedResponse<
  AllPatientVisitBillingResponse & {
    BillingPatientOrderLineItem: Prisma.BillingPatientOrderLineItemGetPayload<{
      include: { order: true };
    }>[];
    BillingConsultationOrderLineItem: Prisma.BillingConsultationOrderLineItemGetPayload<{
      include: { order: true };
    }>[];
    PatientOrder: Prisma.PatientOrderGetPayload<{
      include: { order: true };
    }> | null;
  }
> & {
  totalBilling: number;
  totalVisit: number;
};

export type OpBillingReportQuery = {
  query?: {
    orderIds?: string[];
    visitDate?: {
      from: DateLike;
      to: DateLike;
    };
  };
};

export const validateOpBillingReportQuery = (
  query: unknown,
): query is OpBillingReportQuery => {
  if (!query) {
    return true;
  }
  if (typeof query !== 'object') {
    return false;
  }
  const queryObj = query as OpBillingReportQuery;
  if (queryObj.query) {
    const { orderIds, visitDate } = queryObj.query;
    if (orderIds && !Array.isArray(orderIds)) {
      return false;
    }
    if (visitDate) {
      const { from, to } = visitDate;
      if (!from || !to) {
        return false;
      }
    }
  }
  return true;
};

export type VisitBill = {
  bill: {
    id: string;
    visitId: string;
    items: any;
    totalAmount: number;
    details: Maybe<string>;
    BillingPatientOrderLineItem: Prisma.BillingPatientOrderLineItemGetPayload<{
      include: { order: true };
    }>[];
    BillingConsultationOrderLineItem: Prisma.BillingConsultationOrderLineItemGetPayload<{
      include: { order: true };
    }>[];
  }[];
  Receipt: {
    id: string;
    createdAt: DateLike;
    updatedAt: DateLike;
    visitId: string;
    billId: Maybe<string>;
    paid: number;
    reason: Maybe<string>;
    items: any;
    paymentMode: PaymentMode;
  }[];
};

export type CreatePatientBillingRequest = z.infer<
  typeof createPatientBillingSchema
>;
