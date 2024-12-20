import { PatientVisit, Prisma } from '@prisma/client';
import { z } from 'zod';
import { Maybe } from '../ts-util';
import { AssessmentResponse } from './assessment-util';
import { CreatePatientPrescriptionRequest } from './patient-prescription-util';
import { CreatePatientVitalResponse } from './patient-vital-util';

export const createPatientVisitSchema = z.object({
  guardianName: z.string().min(3).optional().nullable(),
  guardianMobile: z
    .string()
    .min(10, 'Incorrect')
    .max(10, 'Incorrect')
    .optional()
    .nullable(),
  orders: z.array(
    z.object({
      orderId: z.string(),
      doctorId: z.string().nullable().optional(),
    }),
  ),
  billing: z.object({
    advanceAmount: z.number(),
    cashAmount: z.number().nullable().optional(),
    cardAmount: z
      .array(
        z.object({
          bankAccountId: z.number(),
          amount: z.number(),
        }),
      )
      .nullable()
      .optional(),
  }),
});

export type CreatePatientVisitRequest = z.infer<
  typeof createPatientVisitSchema
>;

export type PatientVisitResponse = Maybe<
  PatientVisit & {
    PatientOrder: {
      orderToDoctor: Record<string, string>;
    } | null;
  }
>;

export const DetailedPatientVisitGetPayload = {
  include: {
    Assessment: true,
    PatientVital: true,
    PatientPrescription: true,
    PatientOrder: {
      select: {
        remark: true,
        orderToDoctor: true,
        order: {
          select: {
            id: true,
            name: true,
            departmentId: true,
            consultationRequired: true,
            baseAmount: true,
            taxCodeId: true,
            tags: true,
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
  PatientOrder: {
    orderToDoctor: Record<string, string>;
  };
};
