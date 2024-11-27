import { PatientVital } from '@prisma/client';
import { z } from 'zod';
import { timeSeriesSchema } from '../time-series-util';
import { DateLike } from '../ts-util';

export const createPatientVitalSchema = z.object({
  height: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  temperature: timeSeriesSchema.nullable().optional(),
  pulse: timeSeriesSchema.nullable().optional(),
  bp: timeSeriesSchema.nullable().optional(),
  spo2: timeSeriesSchema.nullable().optional(),
});

export type CreatePatientVitalRequest = z.infer<
  typeof createPatientVitalSchema
>;

export const patientVitalConverter = {
  from: (data: PatientVital): CreatePatientVitalResponse => {
    const body = createPatientVitalSchema.parse(data);
    return {
      ...body,
      createdAt: data.createdAt,
      visitId: data.visitId,
    };
  },
};

export type CreatePatientVitalResponse = CreatePatientVitalRequest & {
  visitId: string;
  createdAt: DateLike;
};
