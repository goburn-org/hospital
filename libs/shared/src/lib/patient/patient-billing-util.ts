import { PaymentMode, Prisma } from '@prisma/client';
import { z } from 'zod';
import { DateLike, Maybe } from '../ts-util';

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
