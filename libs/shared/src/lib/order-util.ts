import { Prisma } from '@prisma/client';
import { Maybe } from './ts-util';

export type AvailableOrder = {
  id: string;
  name: string;
  departmentId?: Maybe<number>;
  departmentName?: string;
  description?: Maybe<string>;
  baseAmount: number;
  taxCodeId: number;
  maxDiscount: Maybe<number>;
  consultationRequired: boolean;
  tags: string[];
};

export const orderConverter = {
  to: (
    order: Prisma.OrderGetPayload<{
      include: {
        department: true;
      };
    }>,
  ): AvailableOrder => ({
    baseAmount: order.baseAmount,
    consultationRequired: order.consultationRequired,
    departmentId: order.departmentId,
    departmentName: order.department?.name,
    description: order.description,
    id: order.id,
    maxDiscount: order.maxDiscount,
    name: order.name,
    tags: order.tags,
    taxCodeId: order.taxCodeId,
  }),
};
