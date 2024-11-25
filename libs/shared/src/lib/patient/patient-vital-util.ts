import { z } from 'zod';
import { DateLike } from '../ts-util';

export const createPatientVitalSchema = z.object({
  height: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  temperature: z.number().nullable().optional(),
  pulse: z.number().nullable().optional(),
  bp: z.string().nullable().optional(),
  spo2: z.number().nullable().optional(),
});

export type CreatePatientVitalRequest = z.infer<
  typeof createPatientVitalSchema
>;

export type CreatePatientVitalResponse = CreatePatientVitalRequest & {
  createdAt: DateLike;
};
