import { z } from 'zod';

export const createGrnLineItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  costPrice: z.number(),
  sellPrice: z.number(),
  mrp: z.number(),
  expiryDate: z.preprocess((v) => new Date(v as string), z.date()),
  batchNumber: z.string(),
});

export const createGrnSchema = z.object({
  grnLineItem: z.array(createGrnLineItemSchema),
});

export type CreateGrnRequest = z.infer<typeof createGrnSchema>;
export type CreateGrnLineItemRequest = z.infer<typeof createGrnLineItemSchema>;

/**
 * model GRN {
  id         String   @id @default(uuid())
  hospitalId Int
  hospital   Hospital @relation(fields: [hospitalId], references: [id])
  updatedBy  String?
  createdBy  String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  json       Json
  Vendor     Vendor?  @relation(fields: [vendorId], references: [id])
  vendorId   String?
}

 */

export type GrnResponse = {
  id: string;
  hospitalId: number;
  updatedBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  json: CreateGrnRequest;
  vendorId?: string;
};
