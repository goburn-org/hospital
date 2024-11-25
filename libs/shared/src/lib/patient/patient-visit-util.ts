import { PatientVisit, Prisma } from '@prisma/client';
import { z } from 'zod';
import { Maybe } from '../ts-util';
import { AssessmentResponse } from './assessment-util';

export const createPatientVisitSchema = z.object({
  doctorId: z.string(),
  checkInTime: z.date(),
});

export type CreatePatientVisitRequest = z.infer<
  typeof createPatientVisitSchema
>;

export type PatientVisitResponse = Maybe<PatientVisit>;

export const DetailedPatientVisitGetPayload = {
  include: {
    Assessment: true,
    PatientOrder: {
      select: {
        order: {
          select: {
            id: true,
            name: true,
            orderDeptId: true,
          },
        },
      },
    },
  },
} as const;

export type DetailedPatientVisit = Prisma.PatientVisitGetPayload<
  typeof DetailedPatientVisitGetPayload
> & {
  Assessment: Maybe<{
    diagnosis: Maybe<AssessmentResponse['diagnosis']>;
    updatedBy: Maybe<string>;
  }>;
};
