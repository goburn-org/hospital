import { PatientVisit } from '@prisma/client';
import { z } from 'zod';
import { Maybe } from '../ts-util';

export const createPatientVisitSchema = z.object({
  doctorId: z.string(),
  checkInTime: z.date(),
});

export type CreatePatientVisitRequest = z.infer<
  typeof createPatientVisitSchema
>;

export type PatientVisitResponse = Maybe<PatientVisit>;
