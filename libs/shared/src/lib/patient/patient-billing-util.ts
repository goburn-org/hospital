import { z } from 'zod';
import { DateLike, Maybe } from '../ts-util';

export const createPatientBillingSchema = z.object({
  details: z.string().nullable().optional(),
  cashAmount: z.number(),
  cardAmount: z.number(),
  totalAmount: z.number(),
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

export type CreatePatientBillingRequest = z.infer<
  typeof createPatientBillingSchema
>;
