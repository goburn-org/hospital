import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Atlesat 3 characters'),
  sku: z.string().min(3, 'Atlesat 3 characters'),
  hsnCode: z.string().min(3, 'Atlesat 3 characters'),
  genericName: z.string().nullable().optional(),
  brandName: z.string().min(3, 'Atlesat 3 characters').nullable().optional(),
  manufacturer: z.string().min(3, 'Atlesat 3 characters').nullable().optional(),
  strength: z.string().min(3, 'Atlesat 3 characters').nullable().optional(),
  dosageForm: z.string().min(3, 'Atlesat 3 characters').nullable().optional(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  departmentIds: z.array(z.number()),
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
