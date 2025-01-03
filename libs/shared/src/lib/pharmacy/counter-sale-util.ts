import { Prisma } from '@prisma/client';

export type CounterSaleResponse = Prisma.CounterSaleGetPayload<{
  include: {
    CounterItem: true;
    CounterSaleBill: true;
  };
}>;
