import { PatientVisit, Prisma } from '@prisma/client';
import { z } from 'zod';
import { Maybe } from '../ts-util';
import { AssessmentResponse } from './assessment-util';
import { CreatePatientPrescriptionRequest } from './patient-prescription-util';
import { CreatePatientVitalResponse } from './patient-vital-util';

export const createPatientVisitSchema = z.object({
  doctorId: z.string(),
  checkInTime: z.preprocess((v) => new Date(v as string), z.date()),
});

export type CreatePatientVisitRequest = z.infer<
  typeof createPatientVisitSchema
>;

export type PatientVisitResponse = Maybe<PatientVisit>;

export const DetailedPatientVisitGetPayload = {
  include: {
    Assessment: true,
    PatientVital: true,
    PatientPrescription: true,
    Doctor: true,
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

type _DetailedPatientVisit = Omit<
  Prisma.PatientVisitGetPayload<typeof DetailedPatientVisitGetPayload>,
  'PatientVital' | 'PatientPrescription'
>;

export type DetailedPatientVisit = _DetailedPatientVisit & {
  PatientVital: Maybe<CreatePatientVitalResponse>;
  Assessment: Maybe<{
    diagnosis: Maybe<AssessmentResponse['diagnosis']>;
    updatedBy: Maybe<string>;
  }>;
  PatientPrescription: Maybe<CreatePatientPrescriptionRequest>;
};
