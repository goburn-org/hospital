import { z } from 'zod';
import { DateLike } from '../ts-util';

export const createPatientVisitReceiptSchema = z.object({
  visitId: z.string(),
  billId: z.string().optional().nullable(),
  paid: z.number(),
  reason: z.string().optional().nullable(),
  isCash: z.boolean(),
});
export type CreatePatientVisitReceiptRequest = z.infer<
  typeof createPatientVisitReceiptSchema
>;

export interface ReceiptReport {
  details: {
    date: string;
    cash: number;
    card: number;
  }[];
  accountDetails: {
    bankAccountId: number;
    amount: number;
    date: DateLike;
    createdAt: DateLike;
    receiptId: string;
  }[];
  byEmp: {
    empId: string | null;
    cashAmount: number;
    date: DateLike;
    receiptId: string;
    createdAt: DateLike;
  }[];
}
