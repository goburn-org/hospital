import { Patient } from '@prisma/client';
import { z } from 'zod';
import { NullOrUndefined } from '../ts-util';
import { PatientVisitResponse } from './patient-visit-util';

export const createPatientSchema = z.object({
  name: z.string().min(3, 'At least 3 characters'),
  fatherName: z.string().min(3, 'At least 3 characters'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'Invalid Gender',
  }),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Phone Number')
    .min(10, 'Invalid Phone Number')
    .max(10, 'Invalid Phone Number'),
  dob: z.preprocess((v) => new Date(v as string), z.date()).optional(),
  bornYear: z
    .number()
    .min(1900, 'Invalid born year')
    .max(new Date().getFullYear(), 'Invalid born year')
    .optional(),
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, 'Invalid Aadhar Number')
    .optional(),
  aadharName: z.string().min(3, 'At least 3 characters').optional(),
  bloodGroup: z
    .string()
    .refine(
      (value) =>
        ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(value),
      {
        message: 'Invalid Blood Group',
      },
    )
    .optional(),
  address: z.string().min(5, 'Address too short').optional(),
  city: z.string().min(2, 'City name too short').optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, 'Invalid Pincode')
    .optional(),
});

export const updatePatientSchema = createPatientSchema.extend({
  uhid: z.string(),
});

export type CreatePatientInput = NullOrUndefined<
  z.infer<typeof createPatientSchema>
>;
export type UpdatePatientInput = NullOrUndefined<
  z.infer<typeof updatePatientSchema>
>;

export type PatientResponse = NullOrUndefined<
  Patient & {
    lastVisit: PatientVisitResponse;
  }
>;
