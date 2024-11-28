import { Maybe } from './ts-util';

export type AvailableOrder = {
  id: string;
  name: string;
  departmentId: number;
  orderDeptName: string;
  description?: Maybe<string>;
};
