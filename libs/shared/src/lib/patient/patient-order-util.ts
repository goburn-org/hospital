import { z } from 'zod';
import { DateLike, NullOrUndefined } from '../ts-util';

export const createPatientOrderSchema = z.object({
  order: z
    .array(
      z.object({
        id: z.string(),
        remark: z.string().optional().nullable(),
      }),
    )
    .nullable()
    .optional(),
  visitId: z.string(),
  patientId: z.string(),
  doctorIds: z.record(z.string(), z.string()), // { orderId: doctorId }
});

export type CreatePatientOrderRequest = NullOrUndefined<
  z.infer<typeof createPatientOrderSchema>
>;
export type PatientOrderResponse = CreatePatientOrderRequest & {
  createdAt: DateLike;
  updatedAt: DateLike;
};
