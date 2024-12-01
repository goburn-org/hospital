import { Maybe } from './ts-util';

export type AvailableOrder = {
  id: string;
  name: string;
  departmentId?: number;
  departmentName?: string;
  description?: Maybe<string>;
  baseAmount: number;
  taxCodeId: number;
  maxDiscount: Maybe<number>;
  consultationRequired: boolean;
  tags: string[];
};
