import { z } from 'zod';

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
