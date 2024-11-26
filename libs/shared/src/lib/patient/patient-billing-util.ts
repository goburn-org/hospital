import { z } from 'zod';

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

export type CreatePatientBillingRequest = z.infer<
  typeof createPatientBillingSchema
>;
