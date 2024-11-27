import { z } from 'zod';
import { NullOrUndefined } from '../ts-util';

export const createAssessmentSchema = z.object({
  complaint: z.string().nullable().optional(),
  currentMedication: z.string().nullable().optional(),
  pastMedicalHistory: z.string().nullable().optional(),
  examination: z.string().nullable().optional(),
  investigation: z.string().nullable().optional(),
  procedureDone: z.string().nullable().optional(),
  diagnosis: z
    .array(
      z.object({
        name: z.string(),
        result: z.string(),
        diagnosisId: z.string(),
      }),
    )
    .nullable()
    .optional(),
  treatmentGiven: z.string().nullable().optional(),
  advice: z.string().nullable().optional(),
  followUpDate: z
    .preprocess((v) => new Date(v as string), z.date())
    .nullable()
    .optional(),
  followupInstruction: z.string().nullable().optional(),
  visitId: z.string(),
  patientId: z.string(),
});

export type CreateAssessmentRequest = NullOrUndefined<
  z.infer<typeof createAssessmentSchema>
>;
export type AssessmentResponse = CreateAssessmentRequest & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
