import { Maybe } from './ts-util';

export type AvailableOrder = {
  id: string;
  name: string;
  orderDeptId: number;
  orderDeptName: string;
  description?: Maybe<string>;
};
