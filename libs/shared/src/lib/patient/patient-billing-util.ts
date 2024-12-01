import { Prisma } from '@prisma/client';
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

export type VisitBill = Prisma.BillGetPayload<{
  include: {
    BillingConsultationOrderLineItem: {
      include: {
        order: true;
      };
    };
    BillingPatientOrderLineItem: {
      include: {
        order: true;
      };
    };
    Receipt: true;
    Visit: true;
  };
}>;

export type CreatePatientBillingRequest = z.infer<
  typeof createPatientBillingSchema
>;
