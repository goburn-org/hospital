import { z } from 'zod';

export const taxCodeSchema = z.object({
  taxCode: z.string(),
  taxRate: z
    .number()
    .refine((x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON),
  description: z.string().nullable().optional(),
});

export type TaxCodeRequest = z.infer<typeof taxCodeSchema>;
export type TaxCodeResponse = z.infer<typeof taxCodeSchema> & {
  id: number;
};
