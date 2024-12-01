import { PatientVisit, Prisma } from '@prisma/client';
import { z } from 'zod';
import { Maybe } from '../ts-util';
import { AssessmentResponse } from './assessment-util';
import { CreatePatientPrescriptionRequest } from './patient-prescription-util';
import { CreatePatientVitalResponse } from './patient-vital-util';

export const createPatientVisitSchema = z.object({
  doctorId: z.string(),
  checkInTime: z.preprocess((v) => new Date(v as string), z.date()),
  billing: z.object({
    advanceAmount: z.number().optional().nullable(),
    isCash: z.boolean(),
  }),
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
        remark: true,
        order: {
          select: {
            id: true,
            name: true,
            departmentId: true,
            consultationRequired: true,
            baseAmount: true,
            taxCodeId: true,
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
