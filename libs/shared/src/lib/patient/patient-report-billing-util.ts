import { Prisma } from '@prisma/client';
import { PaginatedResponse } from '../ts-util';

export type BillingOrderReport = PaginatedResponse<
  Prisma.BillingPatientOrderLineItemGetPayload<{
    include: {
      order: true;
      Visit: {
        include: {
          Patient: true;
        };
      };
    };
  }>
>;
