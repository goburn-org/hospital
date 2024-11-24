import { z } from 'zod';

export const createAssessmentSchema = z.object({
  complaint: z.string().optional(),
  currentMedication: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  examination: z.string().optional(),
  investigation: z.string().optional(),
  procedureDone: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentGiven: z.string().optional(),
  advice: z.string().optional(),
  followUpDate: z.string().optional(),
  followupInstruction: z.string().optional(),
  visitId: z.string(),
  patientId: z.string(),
});

export type CreateAssessmentRequest = z.infer<typeof createAssessmentSchema>;
export type AssessmentResponse = CreateAssessmentRequest & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
