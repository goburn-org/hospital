import { z } from 'zod';

export const createPatientPrescriptionSchema = z.object({
  medicineName: z.string(),
  medicineId: z.string(),
  generic: z.string().nullable().optional(),
  frequency: z.string().nullable().optional(), // 1-0-1
  duration: z.string().nullable().optional(), // 30 days
  instruction: z.string().nullable().optional(), // Before meal
});

export type CreatePatientPrescriptionRequest = (z.infer<
  typeof createPatientPrescriptionSchema
> & {
  idx: number;
})[];

export const prescriptionDbConvertor = {
  from: (data: unknown) => {
    if (!data) {
      return [];
    }
    const isArray = Array.isArray(data);
    if (!isArray) {
      return [];
    }
    return data.map((item: any): CreatePatientPrescriptionRequest[number] => {
      createPatientPrescriptionSchema.parse(item);
      return item;
    });
  },
  to: (data: unknown) => {
    if (!data) {
      return [];
    }
    const isArray = Array.isArray(data);
    if (!isArray) {
      return [];
    }
    return data.map((item: any): CreatePatientPrescriptionRequest[number] => {
      createPatientPrescriptionSchema.parse(item);
      return item;
    });
  },
};
