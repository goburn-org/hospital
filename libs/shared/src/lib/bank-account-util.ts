import { z } from 'zod';

export type BankAccountResponse = {
  name: string;
  icon: string;
  accountNumber: string;
  id: number;
  isActive: boolean;
}[];

export const bankAccountCreateSchema = z.object({
  name: z.string(),
  icon: z.string(),
  accountNumber: z.string(),
});

export type BankAccountCreate = z.infer<typeof bankAccountCreateSchema>;
