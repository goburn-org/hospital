import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const createProductSchema = z.object({
  hsnCode: z.string().min(3, 'Atlesat 3 characters'),
  name: z.string().min(3, 'Atlesat 3 characters'),
  uom: z.number().optional().nullable(),
  genericName: z.string().nullable().optional(),
  sku: z.string().min(3, 'Atlesat 3 characters'),
  dosageForm: z.string().min(3, 'Atlesat 3 characters').nullable().optional(),
  chargeHead: z.array(z.number()),
  manufacturer: z.string().min(3, 'Atlesat 3 characters').nullable().optional(),
  branded: z.boolean(),
  scheduleDrugType: z
    .string()
    .min(3, 'Atlesat 3 characters')
    .nullable()
    .optional(),
  description: z.string().min(3, 'Atlesat 3 characters').nullable().optional(),
  active: z.boolean().default(true),
  maxDiscount: z.number(),
  taxCodeId: z.number(),
});

export const updateProductSchema = createProductSchema.extend({
  id: z.string(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type ProductResponse = Prisma.ProductGetPayload<{
  include: {
    Department: true;
  };
}>;
