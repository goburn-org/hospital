import { z } from 'zod';

export const timeSeriesSchema = z.array(
  z.object({
    createdAt: z.preprocess((v) => new Date(v as string), z.date()),
    reading: z.union([z.number(), z.string()]),
    updatedAt: z.preprocess((v) => new Date(v as string), z.date()),
    id: z.number(),
  }),
);

export type TimeSeriesType = z.infer<typeof timeSeriesSchema>;
