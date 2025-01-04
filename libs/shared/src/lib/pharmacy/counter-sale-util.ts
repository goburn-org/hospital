import { Prisma } from '@prisma/client';
import { z } from 'zod';

export type CounterSaleResponse = Prisma.CounterSaleGetPayload<{
  include: {
    CounterItem: true;
    CounterSaleBill: true;
  };
}>;

export const counterSaleAvailabilityLineItemInput = z.object({
  productId: z.string(),
  quantity: z.number(),
});

type UnAvailableLineItem = {
  productId: string;
  productName: string;
  quantity: number;
  status: 'unavailable';
  availableQuantity: number;
};

type AvailableLineItem = {
  productId: string;
  productName: string;
  quantity: number;
  status: 'available';
  batchNumber: string;
  availableQuantity: number;
};

export type CounterSaleLineItem = UnAvailableLineItem | AvailableLineItem;

export const counterSaleAvailabilityInput = z.array(
  counterSaleAvailabilityLineItemInput,
);

export type CounterSaleAvailabilityLineItemInput = z.infer<
  typeof counterSaleAvailabilityLineItemInput
>;
export type CounterSaleAvailabilityInput = z.infer<
  typeof counterSaleAvailabilityInput
>;

export type StockAvailabilityResponse = {
  products: {
    id: string;
    name: string;
  }[];
  availableStock: {
    productId: string;
    quantity: number;
    sku: { batchNumber: string; quantity: number; price: number }[];
  }[];
  unAvailableStock: {
    productId: string;
    quantity: number;
    availableStock: number;
  }[];
};
